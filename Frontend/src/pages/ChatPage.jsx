import ChatbotPanel from "../components/ChatbotPanel";
import { useApp } from "../context/AppContext";

export default function ChatPage() {
  const { analysisResult } = useApp();

  return (
    <div style={{ paddingTop: 68, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--teal)", marginBottom: "0.6rem" }}>
            <div style={{ width: 20, height: 20, background: "var(--teal-dim)", border: "1px solid rgba(45,212,191,0.3)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 800 }}>◈</div>
            AI Expert
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "0.5rem", lineHeight: 1.1 }}>
            Ask the Skin Expert
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: 560 }}>
            Get personalized skincare advice, product recommendations, and science-backed answers — all powered by Claude AI.
          </p>
        </div>

        {/* Quick topic chips */}
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
          {[["💧", "Hydration tips"], ["🌿", "Natural remedies"], ["🧴", "Product advice"], ["☀️", "Sun protection"], ["🔬", "Skin science"], ["😴", "Sleep & skin"]].map(([ic, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "6px 14px", background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 100, fontSize: "0.8rem", color: "var(--text-muted)" }}>
              <span>{ic}</span><span>{label}</span>
            </div>
          ))}
        </div>

        {/* Chatbot */}
        <ChatbotPanel hydrationResult={analysisResult} prefillRef={null} />

        {/* Tip note */}
        <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
          <span style={{ color: "var(--teal)", fontSize: "1rem", flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: "var(--text)" }}>Pro tip:</strong> For personalized advice based on your skin scan, head to the{" "}
            <strong style={{ color: "var(--teal)" }}>Analyze</strong> page first — the AI will automatically load your results into context.
          </p>
        </div>

      </div>
    </div>
  );
}