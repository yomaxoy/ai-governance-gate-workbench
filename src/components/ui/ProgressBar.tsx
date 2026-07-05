export function ProgressBar({
  value,
  className = "",
  color = "bg-success",
}: {
  value: number;
  className?: string;
  color?: string;
}) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-surface ${className}`}>
      <div
        className={`h-full rounded-full ${color} transition-all`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
