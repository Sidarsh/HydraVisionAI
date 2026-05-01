import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { id: "home",         label: "Home",        icon: "⌂" },
  { id: "how-it-works", label: "How It Works", icon: "◎" },
  { id: "science",      label: "Science",      icon: "⬡" },
  { id: "analyze",      label: "Analyze",      icon: "✦", cta: true },
];

export default function Navbar({ currentPage, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

 const go = (id) => {
  onNavigate(id);
  setMobileOpen(false);
  setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
};
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(5,8,15,0.9)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "none",
      transition: "all 0.3s"
    }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 2rem", height: 68, display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Logo */}
        <div onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--grad1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", color: "#05080f", fontWeight: 900, boxShadow: "0 0 20px var(--teal-glow)" }}>◈</div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>DermaSense</div>
            <div style={{ fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase" }}>AI · Skin Intelligence</div>
          </div>
        </div>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", marginLeft: "auto" }} className="desk-nav">
          {NAV_ITEMS.map(it => (
            <button key={it.id} onClick={() => go(it.id)} style={{
              padding: it.cta ? "8px 20px" : "7px 15px",
              borderRadius: "var(--radius-sm)", border: "none",
              background: it.cta ? "var(--grad1)" : currentPage === it.id ? "var(--teal-dim)" : "transparent",
              color: it.cta ? "#05080f" : currentPage === it.id ? "var(--teal)" : "var(--text-muted)",
              fontSize: "0.875rem", fontWeight: it.cta ? 800 : 500,
              marginLeft: it.cta ? "0.5rem" : 0,
              boxShadow: it.cta ? "0 0 24px var(--teal-glow)" : "none",
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: "0.35rem",
            }}>
              <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>{it.icon}</span>
              {it.label}
            </button>
          ))}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          style={{ display: "none", flexDirection: "column", gap: 5, padding: 8, background: "none", border: "none", marginLeft: "auto" }}
          className="hamburger"
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              width: 22, height: 2, background: "var(--text)", borderRadius: 2, display: "block", transition: "all 0.3s",
              transform: mobileOpen ? (i === 0 ? "rotate(45deg) translate(5px,5px)" : i === 2 ? "rotate(-45deg) translate(5px,-5px)" : "none") : "none",
              opacity: mobileOpen && i === 1 ? 0 : 1
            }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: "rgba(5,8,15,0.97)", backdropFilter: "blur(24px)", borderBottom: "1px solid var(--border)", padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {NAV_ITEMS.map(it => (
            <button key={it.id} onClick={() => go(it.id)} style={{
              padding: "12px 16px", borderRadius: "var(--radius-sm)", border: "none",
              background: it.cta ? "var(--grad1)" : currentPage === it.id ? "var(--teal-dim)" : "transparent",
              color: it.cta ? "#05080f" : currentPage === it.id ? "var(--teal)" : "var(--text-muted)",
              fontSize: "1rem", fontWeight: it.cta ? 800 : 500, textAlign: "left",
              display: "flex", alignItems: "center", gap: "0.5rem"
            }}>
              {it.icon} {it.label}
            </button>
          ))}
        </div>
      )}

      <style>{`.desk-nav{display:flex!important;}.hamburger{display:none!important;}@media(max-width:768px){.desk-nav{display:none!important;}.hamburger{display:flex!important;}}`}</style>
    </nav>
  );
}
