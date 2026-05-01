export default function ResultSkeleton() {
  const shimmer = {
    background: "linear-gradient(90deg, var(--surface2) 25%, var(--surface3) 50%, var(--surface2) 75%)",
    backgroundSize: "400% 100%",
    animation: "shimmer 1.8s ease-in-out infinite",
    borderRadius: 8,
  };

  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}`}</style>
      <div style={{ background: "var(--surface)", border: "1.5px dashed var(--border2)", borderRadius: "var(--radius-xl)", overflow: "hidden", opacity: 0.7 }}>
        {/* Header */}
        <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--border)", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ ...shimmer, width: 160, height: 16 }} />
          <div style={{ ...shimmer, width: 90, height: 12 }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr" }} className="sk-body">
          {/* Left gauge placeholder */}
          <div style={{ padding: "2.5rem 2rem", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", background: "linear-gradient(180deg,var(--surface) 0%,var(--surface2) 100%)" }}>
            <div style={{ width: 190, height: 190, borderRadius: "50%", border: "12px solid var(--surface3)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ ...shimmer, width: 60, height: 32, margin: "0 auto 8px" }} />
                <div style={{ ...shimmer, width: 70, height: 10, margin: "0 auto" }} />
              </div>
            </div>
            <div style={{ ...shimmer, width: 110, height: 22, borderRadius: 100 }} />
          </div>

          {/* Right content placeholder */}
          <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1rem", textAlign: "center" }}>
                  <div style={{ ...shimmer, width: "60%", height: 24, margin: "0 auto 8px" }} />
                  <div style={{ ...shimmer, width: "80%", height: 10, margin: "0 auto" }} />
                </div>
              ))}
            </div>
            <div>
              <div style={{ ...shimmer, width: 160, height: 10, marginBottom: "0.75rem" }} />
              {[0, 1, 2].map(i => (
                <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.6rem", alignItems: "center" }}>
                  <div style={{ ...shimmer, width: 20, height: 20, borderRadius: 6, flexShrink: 0 }} />
                  <div style={{ ...shimmer, flex: 1, height: 12 }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <div style={{ ...shimmer, width: 140, height: 42, borderRadius: "var(--radius)" }} />
            </div>
          </div>
        </div>
        <style>{`@media(max-width:700px){.sk-body{grid-template-columns:1fr!important;}}`}</style>
      </div>

      {/* Waiting message */}
      <div style={{ textAlign: "center", marginTop: "1.25rem", color: "var(--text-muted)", fontSize: "0.875rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
        <span style={{ opacity: 0.5 }}>◎</span> Upload a photo and click <strong style={{ color: "var(--text)", margin: "0 4px" }}>Analyze Hydration</strong> to see your results here
      </div>
    </>
  );
}
