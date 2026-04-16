export function EmptyState({ message = "No data yet" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted">
      <svg
        viewBox="0 0 120 120"
        className="w-24 h-24 mb-4 opacity-30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <rect x="20" y="30" width="80" height="60" rx="4" />
        <path d="M20 50h80" />
        <circle cx="60" cy="70" r="8" />
      </svg>
      <p className="text-sm">{message}</p>
    </div>
  );
}
