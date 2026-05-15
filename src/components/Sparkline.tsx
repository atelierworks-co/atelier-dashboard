export function Sparkline({
  values,
  width = 80,
  height = 22,
  className = "",
}: {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
}) {
  if (values.length < 2) {
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={`text-zinc-300 dark:text-zinc-700 ${className}`}
        aria-hidden="true"
      >
        <line
          x1={0}
          y1={height - 1}
          x2={width}
          y2={height - 1}
          stroke="currentColor"
          strokeWidth={1}
          strokeDasharray="2 2"
        />
      </svg>
    );
  }

  const max = Math.max(...values, 1);
  const stepX = width / (values.length - 1);
  const points = values
    .map((v, i) => {
      const x = i * stepX;
      const y = height - 1 - (v / max) * (height - 2);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const isFlat = values.every((v) => v === 0);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`${
        isFlat ? "text-zinc-300 dark:text-zinc-700" : "text-emerald-500"
      } ${className}`}
      aria-hidden="true"
    >
      {!isFlat && (
        <polygon points={areaPoints} fill="currentColor" fillOpacity={0.12} />
      )}
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
