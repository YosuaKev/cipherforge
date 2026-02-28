# ⚿ CipherForge v3 — Encryption Laboratory
### Theme: Neo-Brutalist / Bauhaus Industrial
### Architecture: Logic separated from UI

---

## 🚀 Instalasi & Menjalankan

### Syarat
- **Node.js** v18+ → https://nodejs.org
- **npm** v9+ (included with Node.js)

### Langkah

```bash
cd cipherforge-v3
npm install
npm run dev
```

Buka browser → **http://localhost:5173**

```bash
npm run build    # production build → /dist
npm run preview  # preview build
```

---

## 📁 Struktur Folder (Logic Dipisah dari UI)

```
cipherforge-v3/
├── index.html                            # Entry + Google Fonts (IBM Plex)
├── package.json
├── vite.config.js
├── README.md
│
└── src/
    ├── main.jsx                          # React entry
    ├── App.jsx                           # Root: wires Header + Sidebar + Ciphers
    │
    ├── styles/
    │   └── global.css                    # CSS variables, animations, noise texture
    │
    ├── utils/                            ← ── LOGIC LAYER (pure JS, no React) ──
    │   └── ciphers/
    │       ├── index.js                  # Barrel export
    │       ├── vigenere.js               # vigenereEncrypt / vigenereDecrypt / buildTableau
    │       ├── affine.js                 # affineEncrypt / affineDecrypt / modularInverse
    │       ├── playfair.js               # playfairEncrypt / playfairDecrypt / buildMatrix
    │       ├── hill.js                   # hillEncrypt / hillDecrypt / validateMatrix
    │       └── enigma.js                 # enigmaProcess / parsePlugboard / rotor defs
    │
    └── components/                       ← ── UI LAYER (React, no cipher logic) ──
        ├── layout/
        │   ├── Header.jsx                # Sticky header + red ticker tape marquee
        │   └── Sidebar.jsx               # Vertical cipher navigation rail
        │
        ├── ui/
        │   ├── Primitives.jsx            # Label, Input, Textarea, Select, Button, Panel, Badge...
        │   └── CipherPanel.jsx           # Shared cipher wrapper: output, steps log, mode toggle
        │
        └── ciphers/
            ├── VigenereCipher.jsx        # UI for (a) Vigenere + tableau preview
            ├── AffineCipher.jsx          # UI for (b) Affine + live formula
            ├── PlayfairCipher.jsx        # UI for (c) Playfair + 5×5 matrix visual
            ├── HillCipher.jsx            # UI for (d) Hill + key/inverse matrix display
            └── EnigmaCipher.jsx          # UI for (e) Enigma + rotor window + state summary
```

---

## 🎨 Desain — Neo-Brutalist / Bauhaus

| Elemen | Pilihan |
|--------|---------|
| **Tema** | Neo-Brutalist Bauhaus — putih bersih, hitam tebal, merah menyala |
| **Font** | IBM Plex Sans + IBM Plex Mono + IBM Plex Serif |
| **Warna Primer** | `#111111` — hitam Bauhaus |
| **Warna Aksen** | `#e8201c` — merah menyala |
| **Warna Highlight** | `#f5c800` — kuning industri (output results) |
| **Background** | `#f5f0eb` — putih kertas + noise texture overlay |
| **Border** | `2px solid #111` — sharp, no border-radius |
| **Shadow** | `4px 4px 0px #111` — hard offset shadow |
| **Navigation** | Sidebar vertikal (bukan tabs horizontal) |
| **Ticker** | Marquee merah di bagian atas header |
| **Animasi** | Slide-up stagger, border transition on focus |

---

## 🏗 Arsitektur: Logic vs UI

### Prinsip Pemisahan

```
Logic (utils/ciphers/*.js)          UI (components/**/*.jsx)
──────────────────────────          ─────────────────────────
• Pure JavaScript functions         • React components only
• Zero React imports                • Calls logic via imports
• Zero JSX                          • No cipher math here
• Fully testable independently      • Purely presentational
• Re-usable in any framework        • Uses design system atoms
```

### Contoh Penggunaan Logic Langsung

```js
import { vigenereEncrypt } from './utils/ciphers/vigenere.js';

const { result, steps, error } = vigenereEncrypt("HELLO WORLD", "SECRET");
// result: "ZINCS LORPH"
// steps: ["[01]  H(7) + S(18) = Z(25)", ...]
// error: null
```

---

## ✅ Fitur

- 5 cipher lengkap dengan encrypt & decrypt
- Step-by-step process log (collapsible)
- Copy to clipboard + karakter count
- Live key preview (Vigenere tableau, Playfair 5×5, Hill matrix + inverse)
- Enigma: rotor window display, historical rotors I–V, plugboard
- Form validation + error messages deskriptif
- Sidebar navigation dengan active state
- Red ticker marquee di header
- Responsive 2-column layout
- IBM Plex font family (sangat mudah dibaca)
- Noise texture + hard shadow Neo-Brutalist

---

*CipherForge v3.0 · Neo-Brutalist Edition · 2026*
