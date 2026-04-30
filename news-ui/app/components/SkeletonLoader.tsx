"use client";

export default function SkeletonLoader() {
  return (
    <div className="space-y-8 soft-pulse">
      {/* Claim skeleton */}
      <div className="space-y-2">
        <div className="h-2 w-12 bg-neutral-800 rounded" />
        <div className="h-4 w-3/4 bg-neutral-800 rounded" />
        <div className="h-4 w-1/2 bg-neutral-800 rounded" />
      </div>

      <div className="h-px bg-neutral-800" />

      {/* Verdict skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-neutral-800" />
        <div className="h-5 w-28 bg-neutral-800 rounded-lg" />
        <div className="w-px h-4 bg-neutral-800" />
        <div className="h-4 w-20 bg-neutral-800 rounded" />
        <div className="h-1 w-16 bg-neutral-800 rounded-full" />
      </div>

      {/* Summary skeleton */}
      <div className="space-y-2">
        <div className="h-2 w-14 bg-neutral-800 rounded" />
        <div className="h-3 w-full bg-neutral-800 rounded" />
        <div className="h-3 w-5/6 bg-neutral-800 rounded" />
        <div className="h-3 w-4/6 bg-neutral-800 rounded" />
      </div>

      {/* Analysis skeleton */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 space-y-2">
        <div className="h-2 w-16 bg-neutral-800 rounded mb-4" />
        <div className="h-3 w-full bg-neutral-800 rounded" />
        <div className="h-3 w-5/6 bg-neutral-800 rounded" />
        <div className="h-3 w-full bg-neutral-800 rounded" />
        <div className="h-3 w-4/6 bg-neutral-800 rounded" />
        <div className="h-3 w-5/6 bg-neutral-800 rounded" />
      </div>

      <div className="h-px bg-neutral-800" />

      {/* Evidence section skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-2 w-14 bg-neutral-800 rounded" />
          <div className="flex-1 h-px bg-neutral-800" />
          <div className="h-2 w-10 bg-neutral-800 rounded" />
        </div>

        {/* Source card skeletons */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-neutral-900/50 border border-neutral-800 border-l-2 border-l-neutral-700 rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between">
              <div className="h-3 w-1/4 bg-neutral-800 rounded" />
              <div className="h-2 w-1/6 bg-neutral-800 rounded" />
            </div>
            <div className="h-3 w-full bg-neutral-800 rounded" />
            <div className="h-3 w-5/6 bg-neutral-800 rounded" />
            <div className="h-2 w-16 bg-neutral-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
