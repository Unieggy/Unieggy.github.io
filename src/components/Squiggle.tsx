export default function Squiggle({ width = 120 }: { width?: number }) {
  const period = 40;
  const extra = period * 2; // always render extra so the loop is seamless
  const totalWidth = width + extra;
  const numPeriods = Math.ceil(totalWidth / period);

  let d = "M0,6";
  for (let i = 0; i < numPeriods; i++) {
    const x = i * period;
    d += ` C${x + 5},1 ${x + 15},1 ${x + 20},6 C${x + 25},11 ${x + 35},11 ${x + 40},6`;
  }

  return (
    <div className="overflow-hidden mb-8" style={{ width, height: 12 }}>
      <svg
        width={totalWidth}
        height={12}
        viewBox={`0 0 ${totalWidth} 12`}
        style={{ animation: "squiggle-flow 3s linear infinite" }}
      >
        <path
          d={d}
          fill="none"
          stroke="var(--color-sage)"
          strokeWidth="1"
          opacity="0.45"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
