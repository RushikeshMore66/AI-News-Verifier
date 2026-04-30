"use client";

import { useReducer, useCallback } from "react";
import type { StreamState, StreamAction, VerificationResult } from "../types";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://10.43.92.138:8000";

function reducer(state: StreamState, action: StreamAction): StreamState {
  switch (action.type) {
    case "START":
      return {
        status: "streaming",
        rawAccumulated: "",
        result: null,
        claim: action.claim,
        errorMessage: null,
      };
    case "TOKEN":
      return {
        ...state,
        rawAccumulated: state.rawAccumulated + action.content,
      };
    case "DONE":
      return { ...state, status: "done", result: action.result };
    case "ERROR":
      return { ...state, status: "error", errorMessage: action.message };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const initialState: StreamState = {
  status: "idle",
  rawAccumulated: "",
  result: null,
  claim: "",
  errorMessage: null,
};

export function useVerifier() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const verify = useCallback(async (claim: string) => {
    if (!claim.trim()) return;

    dispatch({ type: "START", claim });

    try {
      const res = await fetch(`${BACKEND_URL}/api/verify-stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: claim }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      if (!res.body) {
        throw new Error("Response body is null");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE lines
        const lines = buffer.split("\n");
        // Keep the last potentially incomplete line in buffer
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr) continue;

          let parsed: { type: string; content?: string };
          try {
            parsed = JSON.parse(jsonStr);
          } catch {
            continue; // skip malformed chunks
          }

          if (parsed.type === "token" && parsed.content) {
            dispatch({ type: "TOKEN", content: parsed.content });
          } else if (parsed.type === "done") {
            // stream signaled done — handled below via reader exhaustion
            break;
          }
        }
      }

      // At this point the stream is exhausted — parse full accumulated JSON
      // We need to access the latest rawAccumulated via a ref trick.
      // Instead, we fire a custom event for the component to pick up.
      // Actually, we return a sentinel so the caller can parse.
      // Simpler: use a local variable updated alongside dispatch.
      // This hook exposes `state.rawAccumulated` which the caller reads after done.
      // We dispatch DONE with a sentinel result so page.tsx does the parse.
      dispatch({ type: "TOKEN", content: "\x00__PARSE__\x00" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      dispatch({ type: "ERROR", message });
    }
  }, []);

  const parseAndFinalize = useCallback(
    (raw: string) => {
      // Remove sentinel
      const clean = raw.replace("\x00__PARSE__\x00", "").trim();
      try {
        const result = JSON.parse(clean) as VerificationResult;
        dispatch({ type: "DONE", result });
      } catch {
        // Try to extract JSON from raw (LLM might have prepended/appended text)
        const match = clean.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            const result = JSON.parse(match[0]) as VerificationResult;
            dispatch({ type: "DONE", result });
            return;
          } catch {
            /* fall through */
          }
        }
        dispatch({ type: "ERROR", message: "Failed to parse response JSON." });
      }
    },
    []
  );

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  return { state, verify, parseAndFinalize, reset };
}
