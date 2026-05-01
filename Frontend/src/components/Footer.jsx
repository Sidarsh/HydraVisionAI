export default function Footer({ onNavigate }) {
  return (
    <footer style={{ marginTop: "6rem", borderTop: "1px solid var(--border)", background: "var(--bg2)", padding: "3rem 2rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "3rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--grad1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#05080f", fontWeight: 900 }}>◈</div>
            <span style={{ fontWeight: 800, letterSpacing: "-0.03em" }}>DermaSense AI</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: 240 }}>Advanced skin hydration analysis powered by artificial intelligence. Science-backed, privacy-first.</p>
        </div>

        {[
          ["Product", [["Analyze", "analyze"], ["How It Works", "how-it-works"]]],
          ["Science",  [["Research", "science"], ["Methodology", "science"], ["Accuracy", "science"]]],
          ["Company",  [["About", null], ["Privacy", null], ["Contact", null]]],
        ].map(([title, links]) => (
          <div key={title}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1rem" }}>{title}</div>
            {links.map(([l, id]) => (
              <div
                key={l}
                onClick={() => id && onNavigate(id)}
                style={{ fontSize: "0.875rem", color: "var(--text-muted)", cursor: id ? "pointer" : "default", marginBottom: "0.5rem", transition: "color 0.2s" }}
                onMouseEnter={e => id && (e.target.style.color = "var(--teal)")}
                onMouseLeave={e => (e.target.style.color = "var(--text-muted)")}
              >
                {l}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: "2rem auto 0", paddingTop: "1.5rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--text-muted)", fontSize: "0.8rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <span>© 2026 DermaSense AI. All rights reserved.</span>
      </div>
    </footer>
  );
}
