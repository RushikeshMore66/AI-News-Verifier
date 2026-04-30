"use client";

import { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  onReset: () => void;
  hasResult: boolean;
}

export default function SearchBar({
  onSearch,
  isLoading,
  onReset,
  hasResult,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading && !hasResult) {
      inputRef.current?.focus();
    }
  }, [isLoading, hasResult]);

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;
    onSearch(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleReset = () => {
    setQuery("");
    onReset();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative">
        {/* Label row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold tracking-[0.15em] text-neutral-500 uppercase">
            Claim Verification
          </span>
          {hasResult && (
            <button
              onClick={handleReset}
              className="text-[10px] tracking-[0.1em] text-neutral-600 hover:text-neutral-400 uppercase transition-colors duration-150"
            >
              ← New Query
            </button>
          )}
        </div>

        {/* Input area */}
        <div
          className={`relative border rounded-lg transition-all duration-200 ${
            isLoading
              ? "border-neutral-700 bg-neutral-900/60"
              : "border-neutral-800 bg-neutral-900 focus-within:border-neutral-600"
          }`}
        >
          <textarea
            ref={inputRef}
            id="claim-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={2}
            placeholder="Enter a news claim, headline, or statement to verify…"
            className="w-full bg-transparent px-4 pt-4 pb-3 text-sm text-neutral-200 placeholder-neutral-600 outline-none resize-none leading-relaxed disabled:cursor-not-allowed disabled:text-neutral-500"
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <span className="text-[10px] text-neutral-700">
              {query.length > 0 ? `${query.length} chars` : "Press ↵ to verify"}
            </span>
            <button
              id="verify-btn"
              onClick={handleSubmit}
              disabled={isLoading || !query.trim()}
              className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-medium tracking-wide transition-all duration-150 ${
                isLoading || !query.trim()
                  ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-100"
              }`}
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-3 h-3 border border-neutral-600 border-t-neutral-400 rounded-full animate-spin" />
                  Verifying
                </>
              ) : (
                "Verify →"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
