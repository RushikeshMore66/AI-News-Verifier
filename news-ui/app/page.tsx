"use client";

import { useEffect, useRef } from "react";
import SearchBar from "./components/SearchBar";
import StreamingResultPanel from "./components/StreamingResultPanel";
import { useVerifier } from "./lib/useVerifier";

export default function Home() {
  const { state, verify, parseAndFinalize, reset } = useVerifier();

  // When the stream finishes (sentinel token arrives), parse accumulated JSON
  const prevRawRef = useRef("");
  useEffect(() => {
    const raw = state.rawAccumulated;
    if (
      state.status === "streaming" &&
      raw.endsWith("\x00__PARSE__\x00") &&
      raw !== prevRawRef.current
    ) {
      prevRawRef.current = raw;
      parseAndFinalize(raw);
    }
  }, [state.rawAccumulated, state.status, parseAndFinalize]);

  const isLoading =
    state.status === "streaming" || state.status === "parsing";

  const hasResult = state.status === "done" || state.status === "error";

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-neutral-200">
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header className="border-b border-neutral-900 sticky top-0 z-10 bg-[#0c0c0c]/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Wordmark */}
            <span className="text-xs font-semibold tracking-[0.2em] text-neutral-300 uppercase">
              Veritas
            </span>
            <span className="w-px h-3 bg-neutral-800" />
            <span className="text-[10px] text-neutral-600 tracking-widest uppercase">
              Intelligence
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                isLoading
                  ? "bg-neutral-500 animate-pulse"
                  : state.status === "done"
                  ? "bg-neutral-500"
                  : "bg-neutral-700"
              }`}
            />
            <span className="text-[10px] text-neutral-700 font-mono">
              {isLoading
                ? "processing"
                : state.status === "done"
                ? "complete"
                : "ready"}
            </span>
          </div>
        </div>
      </header>

      {/* ── BODY ──────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        {/* Hero / Search area */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            hasResult || isLoading ? "pt-8" : "pt-24"
          }`}
        >
          {/* Title shown only on idle */}
          {state.status === "idle" && (
            <div className="mb-10 fade-in">
              <h1 className="text-2xl font-semibold text-neutral-200 tracking-tight mb-2">
                News Claim Verifier
              </h1>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-xl">
                Submit a headline or claim. Our system cross-references multiple
                sources to surface evidence, contradictions, and a confidence
                verdict.
              </p>
            </div>
          )}

          <SearchBar
            onSearch={verify}
            isLoading={isLoading}
            onReset={reset}
            hasResult={hasResult}
          />
        </div>

        {/* Results */}
        <StreamingResultPanel state={state} />
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-neutral-900 bg-[#0c0c0c]/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <span className="text-[10px] text-neutral-800 tracking-widest uppercase font-mono">
            Powered by Groq · LLaMA 3.3
          </span>
          <span className="text-[10px] text-neutral-800 font-mono">
            {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </main>
  );
}