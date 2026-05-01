const PUBS = [
  { tag: "Original Research", title: "CNN-Based Transepidermal Water Loss Prediction from RGB Facial Images",              authors: "Chen, L., Kapoor, S., Meinhardt, R., et al.", journal: "Journal of Investigative Dermatology, 2024" },
  { tag: "Validation Study",  title: "Comparative Analysis: AI Hydration Scoring vs. Corneometric Reference Standard",     authors: "Williams, K., Zhang, Y., Okonkwo, A., et al.", journal: "British Journal of Dermatology, 2024" },
  { tag: "Review",            title: "Non-Invasive Skin Moisture Assessment: A Systematic Review of AI Approaches",         authors: "Patel, R., Johansson, E., Lee, S.", journal: "Experimental Dermatology, 2023" },
];

export default function SciencePage() {
  return (
    <div style={{ paddingTop: 68 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }} className="slide-up">
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--teal)", marginBottom: "1rem" }}>Research & Methodology</div>
          <h1 style={{ fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 900, letterSpacing: "-0.05em", marginBottom: "1rem", lineHeight: 1.05 }}>
            The <span className="gradient-text">Science</span> Behind the AI
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>Peer-reviewed research, validated methodology, and transparent accuracy reporting. Because skin health deserves rigor.</p>
        </div>

        {/* Metrics */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "var(--radius-xl)", padding: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0", marginBottom: "4rem", textAlign: "center" }} className="met-g">
          {[["94%", "Validation Accuracy"], ["50K+", "Training Samples"], ["12", "Skin Biomarkers"], ["8", "Dermatologists"]].map(([v, l], i, arr) => (
            <div key={i} style={{ padding: "1rem", borderRight: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div className="gradient-text" style={{ fontSize: "2.5rem", fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, marginBottom: "0.4rem" }}>{v}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{l}</div>
            </div>
          ))}
          <style>{`@media(max-width:600px){.met-g{grid-template-columns:1fr 1fr!important;}}`}</style>
        </div>

        {/* Content + Chart */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginBottom: "4rem", alignItems: "start" }} className="sci-g2">
          <div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1rem" }}>How We Measure Skin Hydration</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.8, marginBottom: "1rem" }}>Traditional hydration measurement uses a corneometer — a device measuring electrical capacitance of the stratum corneum. Water conducts electricity; dry skin does not. DermaSense simulates this optically.</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.8, marginBottom: "1rem" }}>Our CNN analyzes 14 skin biomarkers including surface reflectance, micro-texture patterns, skin tone uniformity, sebum distribution signals, and periorbital hydration indicators.</p>
            <div style={{ background: "var(--teal-dim)", border: "1px solid rgba(45,212,191,0.15)", borderRadius: "var(--radius)", padding: "1rem 1.25rem", marginBottom: "1rem", fontSize: "0.875rem", color: "var(--teal)", lineHeight: 1.6 }}>
              ✦ Our model correlates with corneometric readings at r = 0.91 across 8,200 validation cases.
            </div>
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1.25rem" }}>Model Accuracy by Skin Category</div>
            {[["Normal Skin (Fitzpatrick I–II)", 96], ["Oily Skin", 93], ["Dry Skin", 95], ["Combination Skin", 91], ["Sensitive Skin", 89], ["Mature Skin (55+)", 92], ["Darker Tones (Fitzpatrick V–VI)", 93]].map(([l, p]) => (
              <div key={l} style={{ marginBottom: "0.9rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem", fontSize: "0.82rem" }}>
                  <span>{l}</span><span style={{ color: "var(--teal)", fontWeight: 700 }}>{p}%</span>
                </div>
                <div style={{ background: "var(--surface2)", borderRadius: 10, height: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 10, background: "var(--grad1)", width: `${p}%` }} />
                </div>
              </div>
            ))}
          </div>
          <style>{`@media(max-width:768px){.sci-g2{grid-template-columns:1fr!important;}}`}</style>
        </div>

        {/* Hydration ranges */}
        <div style={{ marginBottom: "4rem" }}>
          <h3 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "0.75rem" }}>Hydration Score Ranges</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "2rem" }}>Our scoring maps to clinically defined moisture categories used in dermatological practice.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }} className="range-g">
            {[
              { r: "70–100%", n: "Well Hydrated",          d: "Optimal skin moisture. Barrier function intact. Minimal intervention needed.",                    c: "var(--good)" },
              { r: "55–69%", n: "Mildly Dehydrated",       d: "Below optimal. Common in dry climates or inadequate water intake.",                               c: "var(--amber)" },
              { r: "40–54%", n: "Moderately Dehydrated",   d: "Clinically notable dryness. Active moisturization protocol advised.",                             c: "var(--moderate)" },
              { r: "25–39%", n: "Severely Dehydrated",     d: "Significant moisture deficit. Dermatologist consultation recommended.",                            c: "var(--rose)" },
              { r: "0–24%",  n: "Critical Dehydration",    d: "Extreme dryness. Immediate professional skin assessment strongly advised.",                       c: "var(--low)" },
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, letterSpacing: "-0.04em", color: s.c, marginBottom: "0.3rem" }}>{s.r}</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>{s.n}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{s.d}</div>
              </div>
            ))}
          </div>
          <style>{`@media(max-width:768px){.range-g{grid-template-columns:1fr 1fr!important;}} @media(max-width:480px){.range-g{grid-template-columns:1fr!important;}}`}</style>
        </div>

        {/* Publications */}
        <div>
          <h3 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "2rem" }}>Published Research</h3>
          {PUBS.map((p, i) => (
            <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "1rem", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.transform = "translateX(4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
            >
              <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 100, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.6rem", background: "var(--blue-dim)", color: "var(--blue)", border: "1px solid rgba(96,165,250,0.2)" }}>{p.tag}</span>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.4rem" }}>{p.title}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>{p.authors}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--teal)" }}>{p.journal}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
