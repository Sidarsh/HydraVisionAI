const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');

:root {
  --bg:        #05080f;
  --bg2:       #080d18;
  --surface:   #0d1424;
  --surface2:  #121b2e;
  --surface3:  #172035;
  --border:    rgba(255,255,255,0.06);
  --border2:   rgba(255,255,255,0.10);
  --text:      #dde6f5;
  --text-muted:#7a8aaa;
  --text-dim:  rgba(221,230,245,0.35);
  --teal:      #2dd4bf;
  --teal-dim:  rgba(45,212,191,0.12);
  --teal-glow: rgba(45,212,191,0.25);
  --blue:      #60a5fa;
  --blue-dim:  rgba(96,165,250,0.12);
  --rose:      #fb7185;
  --amber:     #fbbf24;
  --green:     #4ade80;
  --good:      #4ade80;
  --moderate:  #fbbf24;
  --low:       #fb7185;
  --grad1:     linear-gradient(135deg, #2dd4bf, #60a5fa);
  --grad2:     linear-gradient(135deg, #60a5fa, #818cf8);
  --grad3:     linear-gradient(135deg, #2dd4bf 0%, #60a5fa 50%, #818cf8 100%);
  --radius-sm: 10px;
  --radius:    16px;
  --radius-lg: 24px;
  --radius-xl: 32px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: 'Outfit', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--surface3); border-radius: 10px; }
::selection { background: rgba(45,212,191,0.2); }
button { cursor: pointer; font-family: inherit; }
img { max-width: 100%; }

.gradient-text { background: var(--grad1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.slide-up { animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }

@keyframes slideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
@keyframes spin    { to { transform:rotate(360deg); } }
@keyframes pulseGlow { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
@keyframes scan    { 0%{top:-2px;opacity:.8;} 100%{top:100%;opacity:0;} }
@keyframes float   { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
@keyframes blink   { 0%,100%{opacity:.2;transform:scale(.8);} 50%{opacity:1;transform:scale(1.2);} }
`;

export default GLOBAL_CSS;
