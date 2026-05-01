import { useRef, useState } from "react";

export default function ImageUploader({ onImageSelect, image, scanning }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = e => onImageSelect(e.target.result);
    r.readAsDataURL(f);
  };

  return (
    <div>
      {!image ? (
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          style={{
            border: `1.5px dashed ${dragging ? "var(--teal)" : "rgba(45,212,191,0.25)"}`,
            borderRadius: "var(--radius-xl)", padding: "3.5rem 2rem", textAlign: "center",
            cursor: "pointer",
            background: dragging ? "rgba(45,212,191,0.05)" : "rgba(45,212,191,0.02)",
            transition: "all 0.3s", transform: dragging ? "translateY(-3px)" : "none", maxWidth: 480
          }}
        >
          <div style={{ width: 72, height: 72, margin: "0 auto 1.5rem", borderRadius: 20, background: "var(--teal-dim)", border: "1px solid rgba(45,212,191,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--teal)", animation: "float 3s ease-in-out infinite" }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 22V12M16 12L11 17M16 12L21 17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 26h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
              <rect x="1.5" y="1.5" width="29" height="29" rx="8" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.4" />
            </svg>
          </div>
          <p style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.4rem" }}>Drop your selfie here</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            or <span style={{ color: "var(--teal)", fontWeight: 600 }}>browse files</span>
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            {["📸 JPG, PNG, WEBP", "💡 Good lighting", "🚫 No glasses"].map(t => (
              <span key={t} style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "var(--surface2)", padding: "4px 12px", borderRadius: 100, border: "1px solid var(--border)" }}>{t}</span>
            ))}
          </div>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1rem" }}>
          <div style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", maxWidth: 320, border: "1px solid var(--border2)", boxShadow: "0 0 60px rgba(45,212,191,0.08)" }}>
            <img src={image} alt="Selfie" style={{ width: "100%", display: "block", maxHeight: 360, objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              {scanning && (
                <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--teal),transparent)", animation: "scan 2.5s linear infinite", opacity: 0.7 }} />
              )}
              {[
                { top: 12, left: 12, bw: "2px 0 0 2px", br: "5px 0 0 0" },
                { top: 12, right: 12, bw: "2px 2px 0 0", br: "0 5px 0 0" },
                { bottom: 12, left: 12, bw: "0 0 2px 2px", br: "0 0 0 5px" },
                { bottom: 12, right: 12, bw: "0 2px 2px 0", br: "0 0 5px 0" }
              ].map((c, i) => (
                <div key={i} style={{ position: "absolute", ...c, width: 22, height: 22, borderColor: "var(--teal)", borderStyle: "solid", borderWidth: c.bw, borderRadius: c.br, opacity: 0.8 }} />
              ))}
            </div>
          </div>
          <button
            onClick={() => { onImageSelect(null); setTimeout(() => inputRef.current?.click(), 50); }}
            style={{ padding: "8px 18px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border2)", background: "transparent", color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 600, transition: "all 0.2s" }}
            onMouseEnter={e => { e.target.style.borderColor = "var(--teal)"; e.target.style.color = "var(--teal)"; }}
            onMouseLeave={e => { e.target.style.borderColor = "var(--border2)"; e.target.style.color = "var(--text-muted)"; }}
          >
            ↺ Change Photo
          </button>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
        </div>
      )}
    </div>
  );
}
