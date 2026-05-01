import { useState, useEffect } from "react";

export default function HydrationGauge({ percent, level, size = 200 }) {
  const [anim, setAnim] = useState(0);
  const stroke = 12;
  const r = (size / 2) - stroke;
  const circ = 2 * Math.PI * r;
  const offset = circ - (anim / 100) * circ;

  const colorMap = { good: "#4ade80", moderate: "#fbbf24", low: "#fb7185" };
  const color = colorMap[level] || "#2dd4bf";

  useEffect(() => {
    const t = setTimeout(() => setAnim(percent), 200);
    return () => clearTimeout(t);
  }, [percent]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: -8, borderRadius: "50%", background: `radial-gradient(circle, ${color}18 0%,transparent 70%)`, pointerEvents: "none" }} />
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: `drop-shadow(0 0 16px ${color}44)` }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
          {[0, 25, 50, 75, 100].map((v, i) => {
            const a = (v / 100) * 2 * Math.PI - Math.PI / 2;
            const x1 = size / 2 + (r - stroke / 2 - 4) * Math.cos(a);
            const y1 = size / 2 + (r - stroke / 2 - 4) * Math.sin(a);
            const x2 = size / 2 + (r - stroke / 2 - 10) * Math.cos(a);
            const y2 = size / 2 + (r - stroke / 2 - 10) * Math.sin(a);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />;
          })}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.34,1.56,0.64,1)", filter: `drop-shadow(0 0 6px ${color}cc)` }}
          />
          <text x={size / 2} y={size / 2 - 8} textAnchor="middle" fill="white" fontSize={size * 0.18} fontWeight="800" fontFamily="Outfit,sans-serif">{anim}%</text>
          <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="12" fontFamily="Outfit,sans-serif" fontWeight="500">HYDRATION</text>
        </svg>
      </div>
      <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)" }}>
        {{ good: "Excellent", moderate: "Moderate", low: "Critical" }[level]}
      </div>
    </div>
  );
}
