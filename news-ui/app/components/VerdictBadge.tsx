import type { Verdict } from "../types";

interface VerdictBadgeProps {
  verdict: Verdict;
  confidence: number;
}

const VERDICT_CONFIG: Record<
  Verdict,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  TRUE: {
    label: "Verified True",
    bg: "bg-neutral-800/60",
    text: "text-neutral-200",
    border: "border-neutral-600",
    dot: "bg-neutral-400",
  },
  FALSE: {
    label: "False",
    bg: "bg-neutral-900/80",
    text: "text-neutral-300",
    border: "border-neutral-700",
    dot: "bg-neutral-500",
  },
  MISLEADING: {
    label: "Misleading",
    bg: "bg-neutral-900/80",
    text: "text-neutral-300",
    border: "border-neutral-600",
    dot: "bg-neutral-400",
  },
  UNVERIFIED: {
    label: "Unverified",
    bg: "bg-neutral-900/60",
    text: "text-neutral-400",
    border: "border-neutral-700",
    dot: "bg-neutral-600",
  },
};

export default function VerdictBadge({ verdict, confidence }: VerdictBadgeProps) {
  const config = VERDICT_CONFIG[verdict] ?? VERDICT_CONFIG.UNVERIFIED;

  return (
    <div
      className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-lg border ${config.bg} ${config.border}`}
    >
      {/* Status dot */}
      <span className={`w-2 h-2 rounded-full ${config.dot} flex-shrink-0`} />

      {/* Verdict label */}
      <span className={`text-sm font-semibold tracking-wide ${config.text}`}>
        {config.label}
      </span>

      {/* Divider */}
      <span className="w-px h-3.5 bg-neutral-700 flex-shrink-0" />

      {/* Confidence */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] tracking-[0.12em] text-neutral-600 uppercase">
          Confidence
        </span>
        <span className={`text-sm font-mono font-semibold ${config.text}`}>
          {confidence}%
        </span>
        {/* Mini bar */}
        <div className="w-16 h-1 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
}
