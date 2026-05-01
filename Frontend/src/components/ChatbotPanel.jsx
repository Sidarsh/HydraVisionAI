import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const QUICK_PROMPTS = [
  "What causes skin dehydration?",
  "Best moisturizer ingredients?",
  "Daily water intake for skin?",
  "Skincare routine for dry skin?",
  "How to rebuild skin barrier?",
];

const SYSTEM_BASE = `You are DermaSense AI, a friendly expert dermatologist AI assistant specializing in skin hydration and skincare. Provide concise, evidence-based advice with a warm, professional tone. Keep answers focused and actionable.`;

export default function ChatbotPanel({ hydrationResult, prefillRef }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your DermaSense AI skin expert. Ask me anything about skin hydration — or analyze your selfie and I'll personalize my advice to your results!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef(null);

  useEffect(() => { 
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);
  useEffect(() => { if (prefillRef) prefillRef.current = (txt) => sendMsg(txt); }, [messages, hydrationResult]);

  useEffect(() => {
    if (hydrationResult && messages.length === 1 && !loading) {
      sendMsg("I've just completed my skin scan. Can you analyze the results for me?");
    }
  }, [hydrationResult]);

  const sendMsg = async (override) => {
    const text = (override ?? input).trim();
    if (!text || loading) return;
    setInput("");
    const newMsgs = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: messages.slice(1).map(m => ({ role: m.role, content: m.content })),
          user_message: text,
          skin_status: hydrationResult ? {
            status: hydrationResult.status,
            hydrationPercent: hydrationResult.hydrationPercent,
            moistureLevel: hydrationResult.moistureLevel,
            skinType: hydrationResult.skinType
          } : null
        })
      });
      const data = await res.json();
      if (res.ok && data.history) {
        setMessages([messages[0], ...data.history]);
      } else {
        setMessages(p => [...p, { role: "assistant", content: "Sorry, try again." }]);
      }
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "Connection issue. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "var(--radius-xl)", overflow: "hidden", display: "flex", flexDirection: "column", height: 600 }}>
      {/* Header */}
      <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ width: 8, height: 8, background: "var(--good)", borderRadius: "50%", boxShadow: "0 0 6px var(--good)", animation: "pulseGlow 2s infinite" }} />
          <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>DermaSense AI Expert</span>
        </div>
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", padding: "3px 10px", border: "1px solid var(--border)", borderRadius: 100 }}>Powered by Groq</span>
      </div>

      {hydrationResult && (
        <div style={{ padding: "0.75rem 1.5rem", background: "var(--teal-dim)", borderBottom: "1px solid rgba(45,212,191,0.15)", fontSize: "0.8rem", color: "var(--teal)" }}>
          ✦ Analysis loaded — I have your results in context
        </div>
      )}

      {/* Messages */}
      <div ref={messagesContainerRef} style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", scrollbarWidth: "thin" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", flexDirection: m.role === "user" ? "row-reverse" : "row", animation: "slideUp 0.3s ease" }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: m.role === "assistant" ? "var(--teal-dim)" : "var(--blue-dim)", border: `1px solid ${m.role === "assistant" ? "rgba(45,212,191,0.25)" : "rgba(96,165,250,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: m.role === "assistant" ? "0.9rem" : "0.75rem", fontWeight: 700, color: m.role === "assistant" ? "var(--teal)" : "var(--blue)", flexShrink: 0 }}>
              {m.role === "assistant" ? "◈" : "U"}
            </div>
            <div style={{ 
              maxWidth: "72%", 
              padding: "12px 16px", 
              borderRadius: m.role === "assistant" ? "4px 16px 16px 16px" : "16px 4px 16px 16px", 
              fontSize: "0.9rem", 
              lineHeight: 1.6, 
              border: "1px solid var(--border)", 
              background: m.role === "assistant" ? "var(--surface2)" : "rgba(96,165,250,0.1)", 
              borderColor: m.role === "assistant" ? "var(--border)" : "rgba(96,165,250,0.2)",
              color: "var(--text)"
            }}>
              <ReactMarkdown components={{
                p: ({node, ...props}) => <p style={{ margin: "0 0 0.5rem 0" }} {...props} />,
                ul: ({node, ...props}) => <ul style={{ margin: "0.5rem 0", paddingLeft: "1.2rem" }} {...props} />,
                li: ({node, ...props}) => <li style={{ marginBottom: "0.25rem" }} {...props} />,
                strong: ({node, ...props}) => <strong style={{ color: "var(--teal)", fontWeight: 600 }} {...props} />,
              }}>
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: "var(--teal-dim)", border: "1px solid rgba(45,212,191,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--teal)", flexShrink: 0 }}>◈</div>
            <div style={{ padding: "14px 18px", borderRadius: "4px 16px 16px 16px", border: "1px solid var(--border)", background: "var(--surface2)", display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 0.2, 0.4].map((d, i) => <div key={i} style={{ width: 7, height: 7, background: "var(--teal)", borderRadius: "50%", animation: `blink 1.2s ${d}s infinite` }} />)}
            </div>
          </div>
        )}

      </div>

      {/* Quick prompts */}
      <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid var(--border)", display: "flex", gap: "0.5rem", flexWrap: "wrap", background: "var(--surface2)", flexShrink: 0 }}>
        {QUICK_PROMPTS.map((q, i) => (
          <button
            key={i}
            onClick={() => setInput(q)}
            style={{ padding: "5px 13px", borderRadius: 100, fontSize: "0.75rem", fontWeight: 500, background: "transparent", border: "1px solid var(--border2)", color: "var(--text-muted)", transition: "all 0.2s" }}
            onMouseEnter={e => { e.target.style.borderColor = "var(--teal)"; e.target.style.color = "var(--teal)"; e.target.style.background = "var(--teal-dim)"; }}
            onMouseLeave={e => { e.target.style.borderColor = "var(--border2)"; e.target.style.color = "var(--text-muted)"; e.target.style.background = "transparent"; }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid var(--border)", display: "flex", gap: "0.75rem", alignItems: "flex-end", background: "var(--surface)", flexShrink: 0 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
          placeholder="Ask anything about your skin health..."
          rows={1}
          style={{ flex: 1, background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: "var(--radius)", padding: "11px 15px", color: "var(--text)", fontFamily: "Outfit,sans-serif", fontSize: "0.9rem", resize: "none", minHeight: 46, maxHeight: 130, outline: "none" }}
        />
        <button
          onClick={() => sendMsg()}
          disabled={loading || !input.trim()}
          style={{ width: 46, height: 46, borderRadius: "var(--radius-sm)", background: loading || !input.trim() ? "var(--surface3)" : "var(--grad1)", border: "none", color: loading || !input.trim() ? "var(--text-dim)" : "#05080f", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", opacity: loading || !input.trim() ? 0.35 : 1 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
