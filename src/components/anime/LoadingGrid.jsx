export function LoadingGrid() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Render skeleton placeholders while data is loading */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-card bg-surface overflow-hidden">
          {/* Image skeleton */}
          <div className="skeleton h-48 w-full" />

          {/* Text skeletons */}
          <div className="p-3 space-y-2">
            <div className="skeleton h-4 rounded w-3/4" />
            <div className="skeleton h-3 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}