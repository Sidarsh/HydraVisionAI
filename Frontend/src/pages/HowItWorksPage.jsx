import { useState } from "react";

const STEPS_DATA = [
  { e: "📸", n: "STEP 01", h: "Capture Your Selfie",     p: "Take a clear, front-facing photo in good lighting, or upload an existing photo. No special equipment needed — just your smartphone.",                                                                                                     tag: "< 10 seconds" },
  { e: "🤖", n: "STEP 02", h: "AI Image Processing",      p: "Our convolutional neural network analyzes thousands of facial regions examining pixel-level data including skin texture, light reflection patterns, and color temperature to assess moisture levels.",                                          tag: "< 3 seconds" },
  { e: "📊", n: "STEP 03", h: "Hydration Scoring",        p: "The model assigns a hydration percentage based on 14 skin biomarkers, cross-referencing against our database of validated dermatological readings.",                                                                                           tag: "Patented algorithm" },
  { e: "💡", n: "STEP 04", h: "Personalized Report",      p: "You receive a detailed report including your hydration score, skin type classification, moisture level grade, and confidence interval.",                                                                                                      tag: "Instant" },
  { e: "💬", n: "STEP 05", h: "AI Expert Guidance",       p: "Chat with our Claude-powered dermatology AI. It has your results in full context and provides specific product recommendations, routines, and explanations.",                                                                                 tag: "Unlimited questions" },
];

const FAQS_DATA = [
  ["How accurate is the AI analysis?",        "Our model achieves 94% accuracy compared to professional corneometer readings across 8,200 validation cases spanning 12 skin types and 6 ethnicities."],
  ["Are my photos stored anywhere?",           "No. Images are processed in-memory during analysis and immediately discarded. We store only numeric results with your permission for your personal dashboard."],
  ["What lighting works best?",               "Natural daylight is ideal. Avoid harsh direct sunlight or flash photography. Indoor fluorescent lighting works well with our adaptive preprocessing."],
  ["How often should I analyze?",             "We recommend weekly analyses to track trends meaningfully. Daily variations are often due to lighting differences rather than actual skin changes."],
  ["Can it detect other conditions?",         "Currently DermaSense focuses exclusively on hydration and dehydration levels. Detecting conditions like eczema requires clinical validation we are actively undergoing."],
];

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ paddingTop: 68 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "6rem" }} className="slide-up">
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--teal)", marginBottom: "1rem" }}>Process</div>
          <h1 style={{ fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 900, letterSpacing: "-0.05em", marginBottom: "1rem", lineHeight: 1.05 }}>
            How <span className="gradient-text">DermaSense</span> Works
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 540, margin: "0 auto" }}>Five steps from selfie to personalized skincare insight. Powered by dermatology-grade AI.</p>
        </div>

        {/* Steps */}
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto 6rem" }}>
          <div style={{ position: "absolute", left: 35, top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom,var(--teal),rgba(45,212,191,0.05))" }} />
          {STEPS_DATA.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "2rem", marginBottom: "3.5rem" }}>
              <div style={{ width: 70, height: 70, borderRadius: "50%", border: `2px solid ${i < 2 ? "var(--teal)" : "rgba(45,212,191,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", flexShrink: 0, zIndex: 1, boxShadow: i < 2 ? "0 0 24px var(--teal-glow)" : "none", background: i < 2 ? "var(--teal-dim)" : "var(--surface)" }}>{s.e}</div>
              <div style={{ paddingTop: "0.75rem" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--teal)", marginBottom: "0.5rem" }}>{s.n}</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.6rem", letterSpacing: "-0.02em" }}>{s.h}</div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: 480, marginBottom: "0.75rem" }}>{s.p}</p>
                <span style={{ display: "inline-block", padding: "4px 12px", background: "var(--teal-dim)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 100, fontSize: "0.72rem", fontWeight: 600, color: "var(--teal)" }}>⚡ {s.tag}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tech */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "3rem", marginBottom: "5rem" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.03em" }}>The Technology Inside</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "2rem", maxWidth: 600 }}>DermaSense combines computer vision, spectral analysis simulation, and large language models into a seamless skin intelligence platform.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }} className="tech-g">
            {[
              ["🧠", "CNN Architecture",        "Custom ResNet-50 variant fine-tuned on 50,000+ labeled dermatological images with multi-scale feature extraction."],
              ["🌈", "Spectral Mapping",         "Simulates near-infrared spectroscopy by analyzing skin reflection patterns across RGB and luminance channels."],
              ["💬", "Claude AI",               "Anthropic's Claude powers our expert chatbot, providing medically-grounded personalized skincare conversations."],
              ["🔐", "Edge Processing",          "All image analysis occurs in-browser using WebAssembly for speed and privacy — no raw photos leave your device."],
              ["📈", "Continuous Learning",      "Model performance is tracked via A/B testing against lab benchmarks. Updates deployed monthly."],
              ["🩺", "Dermatologist Validated",  "Methodology reviewed by 8 board-certified dermatologists across North America and Europe."],
            ].map(([ic, t, d]) => (
              <div key={t} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem" }}>
                <div style={{ fontSize: "1.3rem", marginBottom: "0.6rem" }}>{ic}</div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.3rem" }}>{t}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{d}</div>
              </div>
            ))}
          </div>
          <style>{`@media(max-width:600px){.tech-g{grid-template-columns:1fr!important;}}`}</style>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 700 }}>
          <h3 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "2rem" }}>Frequently Asked Questions</h3>
          {FAQS_DATA.map(([q, a], i) => (
            <div key={i} style={{ borderBottom: "1px solid var(--border)", padding: "1.25rem 0" }}>
              <div onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {q} <span style={{ color: "var(--teal)", fontSize: "1.2rem" }}>{openFaq === i ? "−" : "+"}</span>
              </div>
              {openFaq === i && <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.7, marginTop: "0.75rem" }}>{a}</div>}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
