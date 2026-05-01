import { useState } from "react";
import { useApp } from "../context/AppContext";
import ImageUploader from "../components/ImageUploader";
import ResultCard from "../components/ResultCard";
import ResultSkeleton from "../components/ResultSkeleton";
import ChatbotPanel from "../components/ChatbotPanel";
import generateResult from "../utils/generateResult";

function StepHeader({ num, label, title, desc, active }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: active ? "var(--teal)" : "var(--text-muted)", marginBottom: "0.6rem", transition: "color 0.3s" }}>
        <div style={{ width: 20, height: 20, background: active ? "var(--teal-dim)" : "var(--surface2)", border: `1px solid ${active ? "rgba(45,212,191,0.3)" : "var(--border)"}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 800, transition: "all 0.3s" }}>{num}</div>
        {label}
      </div>
      <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "0.5rem", lineHeight: 1.1, color: active ? "var(--text)" : "var(--text-muted)", transition: "color 0.3s" }}>{title}</h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: 480 }}>{desc}</p>
    </div>
  );
}

export default function AnalyzePage({ onNavigate }) {
  const { setAnalysisResult, setAnalysisImage } = useApp();
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageSelect = (img) => {
    setImage(img);
    setResult(null);
  };

  const doAnalyze = async () => {
    if (!image || analyzing) return;
    setResult(null);
    setAnalyzing(true);
    
    try {
      const res = await fetch("http://localhost:8001/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image })
      });
      
      if (!res.ok) throw new Error("Analysis failed");
      
      const data = await res.json();
      setResult(data);
      setAnalysisResult(data);
      setAnalysisImage(image);
    } catch (err) {
      console.error(err);
      alert("Skin analysis failed. Please ensure the backend is running.");
    } finally {
      setAnalyzing(false);
    }
  };

  const askChatbot = () => {
    onNavigate("chat");
  };

  return (
    <div style={{ paddingTop: 68, minHeight: "100vh", background: "#0a0f1a" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2rem", display: "flex", flexDirection: "column", gap: "4rem" }}>

        {/* ── Step 1: Upload — always full width ── */}
        <section>
          <StepHeader num="1" label="Upload" title="Take or Upload a Selfie" desc="Use a clear, front-facing photo with good natural lighting for the most accurate hydration analysis." active={true} />

          {/* Uploader + button */}
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "stretch" }} className="step1-grid">
            <div style={{ flexShrink: 0, width: 260, display: "flex", flexDirection: "column" }}>
              <ImageUploader onImageSelect={handleImageSelect} image={image} scanning={analyzing} />
            </div>

            {/* Right side: tips + button stacked */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Photo tips stretch to fill height */}
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.1rem 1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.8rem" }}>📸 Photo Tips</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                  {[["💡", "Good lighting", "Natural daylight, no harsh shadows."], ["🧖", "Clean face", "Remove makeup and glasses."], ["📐", "Face forward", "Full face visible, direct camera angle."], ["🚫", "No filters", "Raw camera only — no beauty modes."]].map(([ic, t, d]) => (
                    <div key={t} style={{ display: "flex", gap: "0.6rem", alignItems: "center", padding: "0 0.65rem", background: "var(--surface2)", borderRadius: 10, flex: 1 }}>
                      <span style={{ fontSize: "0.9rem", flexShrink: 0, width: 22, textAlign: "center" }}>{ic}</span>
                      <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.4 }}><strong style={{ color: "var(--text)" }}>{t}</strong> — {d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analyze button */}
              {image && (
                <div>
                  <button
                    onClick={doAnalyze}
                    disabled={analyzing}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "13px 28px", background: analyzing ? "var(--surface3)" : "var(--grad1)", border: analyzing ? "1px solid var(--border2)" : "none", borderRadius: "var(--radius)", color: analyzing ? "var(--text-muted)" : "#05080f", fontFamily: "Outfit,sans-serif", fontWeight: 800, fontSize: "1rem", cursor: analyzing ? "wait" : "pointer", boxShadow: analyzing ? "none" : "0 0 32px var(--teal-glow)", transition: "all 0.25s", opacity: analyzing ? 0.8 : 1 }}
                    onMouseEnter={e => { if (!analyzing) e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
                  >
                    {analyzing
                      ? <><div style={{ width: 18, height: 18, border: "2.5px solid rgba(200,200,200,0.2)", borderTopColor: "var(--teal)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Analyzing Skin...</>
                      : <>✦ {result ? "Re-Analyze" : "Analyze Hydration"}</>}
                  </button>
                  {result && !analyzing && (
                    <div style={{ marginTop: "0.6rem", fontSize: "0.8rem", color: "var(--good)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span>✓</span> Analysis complete — upload a new photo to re-analyze
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
        <style>{`@media(max-width:700px){.step1-grid{flex-direction:column!important;}}`}</style>

        {/* ── Step 2: Results — always visible below ── */}
        <section>
          <StepHeader num="2" label="Results" title="Your Hydration Report" desc="Your skin hydration score, dehydration map, and personalized recommendations." active={!!result || analyzing} />

          {result && !analyzing ? (
            /* Actual results */
            <div style={{ animation: "slideUp 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
              <ResultCard result={result} image={image} onAskChatbot={askChatbot} onSave={null} />
              
              {/* Automatically show chatbot below results */}
              <div style={{ marginTop: "3rem", animation: "slideUp 0.6s 0.2s backwards" }}>
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--teal)", marginBottom: "0.6rem" }}>
                    <div style={{ width: 20, height: 20, background: "var(--teal-dim)", border: "1px solid rgba(45,212,191,0.3)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 800 }}>◈</div>
                    AI Follow-up
                  </div>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>Ask about your results</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: 500 }}>Our AI expert has your results in context and is ready to provide deeper insights or product recommendations.</p>
                </div>
                <ChatbotPanel hydrationResult={result} />
              </div>
            </div>

          ) : analyzing ? (
            /* Scanning skeleton */
            <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
              <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--border)", background: "var(--surface2)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid var(--teal)", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
                <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Analyzing your skin...</span>
              </div>
              {/* Shimmer skeleton mimicking the result layout */}
              <style>{`@keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}`}</style>
              {(() => {
                const shimmer = { background: "linear-gradient(90deg,var(--surface2) 25%,var(--surface3) 50%,var(--surface2) 75%)", backgroundSize: "400% 100%", animation: "shimmer 1.6s ease-in-out infinite", borderRadius: 8 };
                return (
                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {/* Top 3-col row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr", gap: "1rem" }}>
                      {[0,1,2].map(i => (
                        <div key={i} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                          <div style={{ ...shimmer, height: 12, width: "50%" }} />
                          <div style={{ ...shimmer, height: 80 }} />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                            <div style={{ ...shimmer, height: 52 }} />
                            <div style={{ ...shimmer, height: 52 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Heatmap row */}
                    <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div style={{ ...shimmer, height: 14, width: 220, margin: "0 auto" }} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "1.5rem", alignItems: "start" }}>
                        <div style={{ ...shimmer, height: 200, borderRadius: 10 }} />
                        <div style={{ ...shimmer, height: 200, borderRadius: 10 }} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingTop: 8 }}>
                          {[0,1,2,3,4,5].map(i => <div key={i} style={{ ...shimmer, width: 40, height: 16 }} />)}
                        </div>
                      </div>
                    </div>
                    {/* Tips row */}
                    <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      <div style={{ ...shimmer, height: 10, width: 140 }} />
                      {[0,1,2].map(i => (
                        <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                          <div style={{ ...shimmer, width: 20, height: 20, borderRadius: 6, flexShrink: 0 }} />
                          <div style={{ ...shimmer, flex: 1, height: 12 }} />
                        </div>
                      ))}
                      <div style={{ ...shimmer, height: 42, width: 150, borderRadius: "var(--radius)", marginTop: 4 }} />
                    </div>
                    {/* Scanning tags */}
                    <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", paddingBottom: "0.5rem" }}>
                      {["Surface texture", "Light reflection", "Moisture markers"].map((s, i) => (
                        <span key={i} style={{ fontSize: "0.7rem", padding: "4px 12px", borderRadius: 100, background: "var(--teal-dim)", color: "var(--teal)", border: "1px solid rgba(45,212,191,0.2)", animation: `pulseGlow 1.5s ${i * 0.3}s infinite` }}>{s}</span>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

          ) : (
            /* Idle skeleton — always show so user knows Step 2 exists */
            <ResultSkeleton />
          )}
        </section>

      </div>
    </div>
  );
}