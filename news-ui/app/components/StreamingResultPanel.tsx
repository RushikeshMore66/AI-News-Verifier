"use client";

import { useState } from "react";
import VerdictBadge from "./VerdictBadge";
import EvidenceSection from "./EvidenceSection";
import SkeletonLoader from "./SkeletonLoader"; // Skeleton component for loading states
import type { StreamState } from "../types";

interface StreamingResultPanelProps {
  state: StreamState;
}

export default function StreamingResultPanel({
  state,
}: StreamingResultPanelProps) {
  const [analysisExpanded, setAnalysisExpanded] = useState(false);

  if (state.status === "idle") return null;

  // ── STREAMING / PARSING ─────────────────────────────────────────────────
  if (state.status === "streaming" || state.status === "parsing") {
    return (
      <div className="max-w-3xl mx-auto mt-10">
        {/* Live progress indicator */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex gap-1">
            <span className="w-1 h-1 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1 h-1 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1 h-1 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-[10px] tracking-[0.12em] text-neutral-600 uppercase font-medium">
            Analyzing sources…
          </span>
        </div>
        <SkeletonLoader />
      </div>
    );
  }

  // ── ERROR ────────────────────────────────────────────────────────────────
  if (state.status === "error") {
    return (
      <div
        id="error-panel"
        className="max-w-3xl mx-auto mt-10 border border-neutral-800 rounded-lg p-5 bg-neutral-900/60 fade-in"
      >
        <p className="text-[10px] tracking-[0.15em] text-neutral-600 uppercase font-semibold mb-2">
          Verification Failed
        </p>
        <p className="text-sm text-neutral-400 leading-relaxed">
          {state.errorMessage}
        </p>
      </div>
    );
  }

  // ── DONE ─────────────────────────────────────────────────────────────────
  if (state.status === "done" && state.result) {
    const { verdict, confidence, summary, analysis, supporting, contradicting } =
      state.result;

    // Truncate analysis for collapsed view
    const ANALYSIS_PREVIEW_CHARS = 400;
    const analysisNeedsExpand =
      analysis && analysis.length > ANALYSIS_PREVIEW_CHARS;
    const analysisDisplay =
      analysisExpanded || !analysisNeedsExpand
        ? analysis
        : analysis?.slice(0, ANALYSIS_PREVIEW_CHARS).trim() + "…";

    return (
      <div id="result-panel" className="max-w-3xl mx-auto mt-10 space-y-8">

        {/* ── CLAIM ── */}
        <div className="space-y-1 fade-in">
          <span className="text-[10px] font-semibold tracking-[0.15em] text-neutral-600 uppercase">
            Claim
          </span>
          <h1 className="text-base font-medium text-neutral-200 leading-snug">
            {state.claim}
          </h1>
        </div>

        {/* ── DIVIDER ── */}
        <div className="h-px bg-neutral-800" />

        {/* ── VERDICT + CONFIDENCE ── */}
        <div className="fade-in" style={{ animationDelay: "50ms" }}>
          <VerdictBadge verdict={verdict} confidence={confidence} />
        </div>

        {/* ── SUMMARY ── */}
        <div className="space-y-2 fade-in" style={{ animationDelay: "100ms" }}>
          <span className="text-[10px] font-semibold tracking-[0.15em] text-neutral-600 uppercase">
            Summary
          </span>
          <p className="text-sm text-neutral-300 leading-relaxed">{summary}</p>
        </div>

        {/* ── ANALYSIS ── */}
        {analysis && (
          <div
            className="space-y-3 fade-in"
            style={{ animationDelay: "150ms" }}
          >
            <span className="text-[10px] font-semibold tracking-[0.15em] text-neutral-600 uppercase">
              Analysis
            </span>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4">
              <p className="text-sm text-neutral-400 leading-relaxed whitespace-pre-line">
                {analysisDisplay}
              </p>
              {analysisNeedsExpand && (
                <button
                  id="expand-analysis-btn"
                  onClick={() => setAnalysisExpanded((v) => !v)}
                  className="mt-3 text-[11px] text-neutral-600 hover:text-neutral-300 transition-colors duration-150 font-medium tracking-wide"
                >
                  {analysisExpanded ? "Collapse ↑" : "Full Analysis ↓"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── DIVIDER ── */}
        <div className="h-px bg-neutral-800" />

        {/* ── EVIDENCE ── */}
        <div className="fade-in" style={{ animationDelay: "200ms" }}>
          <EvidenceSection
            supporting={supporting ?? []}
            contradicting={contradicting ?? []}
          />
        </div>
      </div>
    );
  }

  return null;
}
