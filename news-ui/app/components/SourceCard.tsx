import type { SourceItem } from "../types";

interface SourceCardProps {
  item: SourceItem;
  variant: "supporting" | "contradicting";
  index: number;
}

export default function SourceCard({ item, variant, index }: SourceCardProps) {
  const borderColor =
    variant === "supporting"
      ? "border-l-neutral-600"
      : "border-l-neutral-500";

  const tagStyle =
    variant === "supporting"
      ? "bg-neutral-800 text-neutral-400 border-neutral-700"
      : "bg-neutral-800/60 text-neutral-500 border-neutral-700/60";

  const tagLabel =
    variant === "supporting" ? "Supporting" : "Contradicting";

  // Format published date
  const formatDate = (raw: string) => {
    if (!raw) return null;
    try {
      const d = new Date(raw);
      if (isNaN(d.getTime())) return raw;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return raw;
    }
  };

  const published = formatDate(item.published);

  return (
    <div
      id={`source-card-${variant}-${index}`}
      className={`group relative bg-neutral-900/50 border border-neutral-800 border-l-2 ${borderColor} rounded-lg p-4 transition-all duration-200 hover:bg-neutral-900/80 hover:border-neutral-700 fade-in`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold text-neutral-300 truncate">
            {item.source || "Unknown Source"}
          </span>
          <span
            className={`flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded border font-medium tracking-[0.1em] uppercase ${tagStyle}`}
          >
            {tagLabel}
          </span>
        </div>
        {published && (
          <span className="flex-shrink-0 text-[10px] text-neutral-600 font-mono">
            {published}
          </span>
        )}
      </div>

      {/* Snippet */}
      <p className="text-sm text-neutral-400 leading-relaxed line-clamp-3 mb-3">
        {item.snippet || "No excerpt available."}
      </p>

      {/* Read link */}
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-neutral-600 hover:text-neutral-300 transition-colors duration-150 font-medium tracking-wide"
        >
          Read source
          <span className="transition-transform duration-150 group-hover:translate-x-0.5">
            →
          </span>
        </a>
      ) : (
        <span className="text-[11px] text-neutral-700">No URL available</span>
      )}
    </div>
  );
}