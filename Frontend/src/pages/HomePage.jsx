const FEATURES = [
  { icon: "🤖", title: "AI-Powered Analysis",   desc: "Deep learning models trained on 50,000+ skin samples detect hydration levels from facial images with 94% accuracy." },
  { icon: "⚡", title: "Instant Results",        desc: "Get comprehensive skin hydration readings in under 3 seconds — no lab visits, no equipment required." },
  { icon: "🔒", title: "Privacy First",          desc: "Your images are analyzed privately. No photos stored or shared. Results are yours alone." },
  { icon: "📊", title: "Trend Tracking",         desc: "Monitor your skin hydration over time with our dashboard and see how lifestyle changes affect your skin health." },
  { icon: "💬", title: "AI Skin Expert",         desc: "Chat with our Claude-powered dermatology AI for personalized skincare routines and product recommendations." },
  { icon: "🧬", title: "Science-Backed",         desc: "Built on peer-reviewed dermatological research. Methodology validated against professional moisture meters." },
];

export default function HomePage({ onNavigate }) {
  return (
    <div style={{ paddingTop: 68 }}>
      {/* Hero */}
      <section style={{ minHeight: "92vh", display: "flex", alignItems: "center", padding: "4rem 2rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(45,212,191,0.06) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 20% 70%,rgba(96,165,250,0.05) 0%,transparent 50%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }} className="hero-grid">
          <div className="slide-up">
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "5px 14px", borderRadius: 100, background: "var(--teal-dim)", border: "1px solid rgba(45,212,191,0.2)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--teal)", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              <div style={{ width: 6, height: 6, background: "var(--teal)", borderRadius: "50%", animation: "pulseGlow 1.5s infinite" }} /> AI-Powered Skin Intelligence
            </div>
            <h1 style={{ fontSize: "clamp(2.8rem,5vw,5rem)", fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 0.95, marginBottom: "1.5rem" }}>
              Know Your<br /><em className="gradient-text" style={{ fontStyle: "italic", fontFamily: "'DM Serif Display',serif", fontWeight: 400 }}>Skin's</em><br />Hydration
            </h1>
            <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 480, marginBottom: "2.5rem" }}>Upload a selfie and get instant, AI-powered skin hydration analysis with personalized recommendations. No equipment needed.</p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
              <button onClick={() => onNavigate("analyze")} style={{ padding: "14px 32px", borderRadius: "var(--radius)", background: "var(--grad1)", border: "none", color: "#05080f", fontWeight: 800, fontSize: "1rem", boxShadow: "0 0 40px var(--teal-glow)", cursor: "pointer", transition: "all 0.25s" }} onMouseEnter={e => e.target.style.transform = "translateY(-3px)"} onMouseLeave={e => e.target.style.transform = "none"}>
                ✦ Analyze My Skin
              </button>
              <button onClick={() => onNavigate("chat")} style={{ padding: "14px 32px", borderRadius: "var(--radius)", background: "var(--grad1)", border: "none", color: "#05080f", fontWeight: 800, fontSize: "1rem", boxShadow: "0 0 40px var(--teal-glow)", cursor: "pointer", transition: "all 0.25s" }} onMouseEnter={e => e.target.style.transform = "translateY(-3px)"} onMouseLeave={e => e.target.style.transform = "none"}>
                Chatbot
              </button>
              <button onClick={() => onNavigate("how-it-works")} style={{ padding: "14px 28px", borderRadius: "var(--radius)", background: "transparent", border: "1px solid var(--border2)", color: "var(--text)", fontWeight: 600, fontSize: "1rem", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.target.style.borderColor = "var(--teal)"; e.target.style.color = "var(--teal)"; }} onMouseLeave={e => { e.target.style.borderColor = "var(--border2)"; e.target.style.color = "var(--text)"; }}>
                How It Works →
              </button>
            </div>
          </div>

          {/* Mock card */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }} className="hero-vis">
            <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "var(--radius-xl)", padding: "2rem", width: "100%", maxWidth: 370, boxShadow: "0 40px 100px rgba(0,0,0,0.5)", animation: "float 4s ease-in-out infinite", position: "relative", zIndex: 1 }}>
              <div style={{ background: "var(--surface2)", borderRadius: "var(--radius-lg)", height: 200, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", position: "relative", overflow: "hidden", border: "1px solid var(--border)" }}>
                <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--teal),transparent)", animation: "scan 2s linear infinite" }} />
                <div style={{ fontSize: "5rem", opacity: 0.15 }}>🧑</div>
                {[{ t: 12, l: 12, bw: "2px 0 0 2px", br: "4px 0 0 0" }, { t: 12, r: 12, bw: "2px 2px 0 0", br: "0 4px 0 0" }, { b: 12, l: 12, bw: "0 0 2px 2px", br: "0 0 0 4px" }, { b: 12, r: 12, bw: "0 2px 2px 0", br: "0 0 4px 0" }].map((c, i) => (
                  <div key={i} style={{ position: "absolute", ...c, width: 18, height: 18, borderColor: "var(--teal)", borderStyle: "solid", borderWidth: c.bw, borderRadius: c.br, opacity: 0.7 }} />
                ))}
              </div>
              {[["Hydration", 78], ["Moisture", 90], ["Barrier", 85]].map(([l, w]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", width: 70, flexShrink: 0 }}>{l}</span>
                  <div style={{ flex: 1, height: 6, background: "var(--surface3)", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 10, background: "var(--grad1)", width: `${w}%` }} />
                  </div>
                  <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--teal)", width: 35, textAlign: "right" }}>{w}%</span>
                </div>
              ))}
            </div>
            {/* Floating badges */}
            <div style={{ position: "absolute", top: -16, left: -16, background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "var(--radius-sm)", padding: "0.6rem 1rem", fontSize: "0.78rem", fontWeight: 600, boxShadow: "0 4px 30px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: "0.4rem", zIndex: 2 }}>
              <div style={{ width: 8, height: 8, background: "var(--good)", borderRadius: "50%" }} /> Analysis Complete
            </div>
            <div style={{ position: "absolute", bottom: 16, right: -24, background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "var(--radius-sm)", padding: "0.6rem 1rem", fontSize: "0.78rem", fontWeight: 600, boxShadow: "0 4px 30px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: "0.4rem", zIndex: 2, animation: "float 3s 1.5s ease-in-out infinite" }}>
              <div style={{ width: 8, height: 8, background: "var(--teal)", borderRadius: "50%" }} /> 94% Accuracy
            </div>
          </div>
        </div>
        <style>{`@media(max-width:900px){.hero-grid{grid-template-columns:1fr!important;} .hero-vis{display:none!important;}}`}</style>
      </section>

      {/* Stats */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem 3rem", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "2rem" }} className="stats-g">
        {[{ icon: "📸", v: "94%", l: "Analysis Accuracy" }, { icon: "⚡", v: "<3s", l: "Avg Analysis Time" }, { icon: "👥", v: "50K+", l: "Training Samples" }].map((s, i) => (
          <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "var(--radius-lg)", padding: "1.5rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--grad1)" }} />
            <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{s.icon}</div>
            <div className="gradient-text" style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "0.3rem" }}>{s.v}</div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{s.l}</div>
          </div>
        ))}
        <style>{`@media(max-width:768px){.stats-g{grid-template-columns:1fr 1fr!important;} @media(max-width:480px){.stats-g{grid-template-columns:1fr!important;}}}`}</style>
      </div>

      {/* Features */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--teal)", marginBottom: "0.75rem" }}>Why DermaSense</div>
        <h2 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: "1rem", maxWidth: 600 }}>Skin intelligence that <em className="gradient-text" style={{ fontStyle: "normal" }}>actually works</em></h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 520, marginBottom: "3rem" }}>Built by dermatologists and AI researchers. Clinically validated. Used by thousands worldwide.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }} className="feat-g">
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.75rem", transition: "all 0.25s", cursor: "default", position: "relative", overflow: "hidden" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--border2)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--border)"; }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--teal-dim)", border: "1px solid rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1.25rem" }}>{f.icon}</div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.5rem" }}>{f.title}</div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:900px){.feat-g{grid-template-columns:1fr 1fr!important;}} @media(max-width:600px){.feat-g{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--surface2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "5rem 2rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 50% 50%,rgba(45,212,191,0.06) 0%,transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "1rem", lineHeight: 1.1 }}>Ready to understand your skin?</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem" }}>Take a selfie and get your personalized hydration report in seconds. Free, instant, and private.</p>
          <button onClick={() => onNavigate("analyze")} style={{ padding: "15px 40px", borderRadius: "var(--radius)", background: "var(--grad1)", border: "none", color: "#05080f", fontWeight: 800, fontSize: "1.05rem", boxShadow: "0 0 40px var(--teal-glow)", cursor: "pointer", transition: "all 0.25s", display: "inline-block" }} onMouseEnter={e => e.target.style.transform = "translateY(-3px)"} onMouseLeave={e => e.target.style.transform = "none"}>✦ Start Free Analysis</button>
        </div>
      </section>
    </div>
  );
}
