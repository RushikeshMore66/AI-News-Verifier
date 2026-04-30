import type { SourceItem } from "../types";
import SourceCard from "./SourceCard";

interface EvidenceSectionProps {
  supporting: SourceItem[];
  contradicting: SourceItem[];
}

export default function EvidenceSection({
  supporting,
  contradicting,
}: EvidenceSectionProps) {
  const total = supporting.length + contradicting.length;

  return (
    <section id="evidence-section" className="space-y-8 fade-in">
      {/* Section header */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-semibold tracking-[0.15em] text-neutral-600 uppercase">
          Evidence
        </span>
        <div className="flex-1 h-px bg-neutral-800" />
        <span className="text-[10px] text-neutral-700 font-mono">
          {total} source{total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Conflict summary banner */}
      {contradicting.length > 0 && (
        <div className="flex items-start gap-3 px-4 py-3 bg-neutral-900/60 border border-neutral-800 rounded-lg">
          <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-neutral-500 flex-shrink-0" />
          <p className="text-xs text-neutral-500 leading-relaxed">
            <span className="text-neutral-300 font-medium">
              {contradicting.length} contradicting source
              {contradicting.length !== 1 ? "s" : ""}
            </span>{" "}
            conflict
            {contradicting.length === 1 ? "s" : ""} with the claim or supporting evidence.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Supporting */}
        {supporting.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
              <span className="text-[10px] font-semibold tracking-[0.12em] text-neutral-500 uppercase">
                Supporting
              </span>
              <span className="text-[10px] text-neutral-700 font-mono ml-auto">
                {supporting.length}
              </span>
            </div>
            <div className="space-y-3">
              {supporting.map((item, i) => (
                <SourceCard
                  key={`supporting-${i}`}
                  item={item}
                  variant="supporting"
                  index={i}
                />
              ))}
            </div>
          </div>
        )}

        {/* Contradicting */}
        {contradicting.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
              <span className="text-[10px] font-semibold tracking-[0.12em] text-neutral-500 uppercase">
                Contradicting
              </span>
              <span className="text-[10px] text-neutral-700 font-mono ml-auto">
                {contradicting.length}
              </span>
            </div>
            <div className="space-y-3">
              {contradicting.map((item, i) => (
                <SourceCard
                  key={`contradicting-${i}`}
                  item={item}
                  variant="contradicting"
                  index={i}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
