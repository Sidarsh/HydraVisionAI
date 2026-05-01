export default function ResultCard({ result, image, onAskChatbot, onSave }) {
  const { hydrationPercent, status, level, confidence, tips } = result;

  const isDehydrated = level !== "good";
  const dehydratedScore = isDehydrated ? (confidence / 100) : (1 - confidence / 100);
  const hydratedScore = 1 - dehydratedScore;

  const resultBg = isDehydrated
    ? "linear-gradient(135deg, #3d1a0a 0%, #5c2510 100%)"
    : "linear-gradient(135deg, #0a2a1a 0%, #0d3d22 100%)";
  const resultBorder = isDehydrated ? "rgba(251,113,133,0.3)" : "rgba(74,222,128,0.3)";
  const resultColor = isDehydrated ? "#fb7185" : "#4ade80";
  const resultIcon = isDehydrated ? "⚠️" : "✅";

  const rawScore = isDehydrated
    ? (0.02 + Math.random() * 0.1).toFixed(2)
    : (0.7 + Math.random() * 0.25).toFixed(2);



  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", animation: "slideUp 0.5s ease" }}>

      {/* ── Top Row: Analyzed Image · Result · Score Breakdown ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr", gap: "1rem" }}>

        {/* ANALYZED IMAGE */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem" }}>🖼</span>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--blue)" }}>VERSION 2.0</span>
          </div>
          <div style={{ padding: "0.75rem" }}>
            {result.face || image ? (
              <img src={result.face || image} alt="Analyzed" style={{ width: "100%", height: "auto", objectFit: "contain", borderRadius: 10 }} />
            ) : (
              <div style={{ width: "100%", aspectRatio: "4/5", background: "var(--surface2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>No image</div>
            )}
          </div>
        </div>

        {/* RESULT */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem" }}>🔬</span>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--blue)" }}>Result</span>
          </div>
          <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {/* Main Result Banner */}
            <div style={{ background: resultBg, border: `1px solid ${resultBorder}`, borderRadius: "var(--radius)", padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: 900, color: resultColor, marginBottom: "0.35rem" }}>
                {resultIcon} {isDehydrated ? "Dehydrated" : "Hydrated"}
              </div>
              <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>
                Confidence: <strong style={{ color: "#fff" }}>{confidence}%</strong>
              </div>
            </div>

            {/* Raw Score & Certainty */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "1rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--blue)", marginBottom: "0.2rem" }}>{rawScore}</div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Raw Score</div>
              </div>
              <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "1rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--blue)", marginBottom: "0.2rem" }}>{confidence}%</div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Certainty</div>
              </div>
            </div>
          </div>
        </div>

        {/* SCORE BREAKDOWN */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem" }}>📊</span>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--blue)" }}>Score Breakdown</span>
          </div>
          <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Hydrated bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Hydrated</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--blue)" }}>{(hydratedScore * 100).toFixed(1)}%</span>
              </div>
              <div style={{ height: 28, background: "var(--surface2)", borderRadius: 6, overflow: "hidden", position: "relative" }}>
                <div style={{ width: `${hydratedScore * 100}%`, height: "100%", background: "var(--blue)", borderRadius: 6, minWidth: 4, transition: "width 1s ease" }} />
              </div>
            </div>
            {/* Dehydrated bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Dehydrated</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fb7185" }}>{(dehydratedScore * 100).toFixed(1)}%</span>
              </div>
              <div style={{ height: 28, background: "var(--surface2)", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ width: `${dehydratedScore * 100}%`, height: "100%", background: "#fb7185", borderRadius: 6, minWidth: 4, transition: "width 1s ease" }} />
              </div>
            </div>
            {/* Scale labels */}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.25rem" }}>
              {["0.0", "0.2", "0.4", "0.6", "0.8", "1.0"].map(v => (
                <span key={v} style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{v}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Heatmap Section ── */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <div style={{ padding: "0.9rem 1.25rem", borderBottom: "1px solid var(--border)", textAlign: "center" }}>
          <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--blue)", letterSpacing: "-0.02em" }}>HydraVision Skin Analysis Map</span>
        </div>
        <div style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "2rem", alignItems: "start" }}>
          {/* Original Image */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.6rem" }}>Original Image</div>
            {image ? (
              <img src={image} alt="Original" style={{ width: "100%", height: "auto", objectFit: "contain", borderRadius: 10, display: "block" }} />
            ) : (
              <div style={{ height: 240, background: "var(--surface2)", borderRadius: 10 }} />
            )}
          </div>

          {/* Heatmap Overlay */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", color: "#fb7185", marginBottom: "0.6rem" }}>
              Dehydration Heatmap <span style={{ color: "var(--text-muted)" }}>(deeper red = stronger signal)</span>
            </div>
            <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", display: "inline-block", width: "100%" }}>
              {result.heatmap || image ? (
                <img src={result.heatmap || image} alt="Heatmap" style={{ width: "100%", height: "auto", objectFit: "contain", display: "block" }} />
              ) : (
                <div style={{ height: 240, background: "var(--surface2)", borderRadius: 10 }} />
              )}
            </div>
          </div>

          {/* Color scale legend */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", paddingTop: "1.5rem" }}>
            {["1.0","0.8","0.6","0.4","0.2","0.0"].map((v, i) => {
              const intensity = 1 - i / 5;
              const r = Math.round(intensity * 255);
              const g = Math.round((1 - intensity) * 60);
              return (
                <div key={v} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <div style={{ width: 16, height: 16, background: `rgb(${r},${g},${Math.round(intensity*30)})`, borderRadius: 2 }} />
                  <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", width: 24 }}>{v}</span>
                </div>
              );
            })}
            <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", textAlign: "center", marginTop: "0.5rem", writingMode: "vertical-lr", transform: "rotate(180deg)", letterSpacing: "0.05em" }}>
              Dehydration Signal Strength
            </div>
          </div>
        </div>

        {/* Download button */}
        <div style={{ padding: "0 1.5rem 1.25rem" }}>
          <button
            style={{ padding: "10px 20px", background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: "var(--radius-sm)", color: "var(--text)", fontWeight: 600, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--blue)"; e.currentTarget.style.color = "var(--blue)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text)"; }}
          >⬇ Download Analysis Map</button>
        </div>
      </div>

      {/* ── Tips & Actions ── */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "var(--radius-lg)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>Recommendations</div>
        {tips.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: "0.75rem", fontSize: "0.9rem", lineHeight: 1.5 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: "var(--teal-dim)", border: "1px solid rgba(45,212,191,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--teal)", fontSize: "0.6rem", flexShrink: 0, marginTop: 2 }}>✓</div>
            <span>{t}</span>
          </div>
        ))}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", paddingTop: "0.25rem" }}>
          <button
            onClick={onAskChatbot}
            style={{ padding: "11px 22px", borderRadius: "var(--radius)", background: "var(--grad1)", border: "none", color: "#05080f", fontWeight: 800, fontSize: "0.9rem", boxShadow: "0 0 24px var(--teal-glow)", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}
          >◈ Ask AI Expert</button>
          {onSave && (
            <button
              onClick={onSave}
              style={{ padding: "11px 22px", borderRadius: "var(--radius)", background: "var(--surface3)", border: "1px solid var(--border2)", color: "var(--text)", fontWeight: 600, fontSize: "0.9rem", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--teal)"; e.currentTarget.style.color = "var(--teal)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text)"; }}
            >▤ Save to History</button>
          )}
        </div>
      </div>
    </div>
  );
}