/**
 * HILL CIPHER — UI Component
 * Supports 2×2, 3×3, 4×4, 5×5 key matrices
 * Logic: src/utils/ciphers/hill.js
 */

import { useState, useMemo } from "react";
import { CipherPanel } from "../ui/CipherPanel";
import { Label, Input, Textarea, Panel } from "../ui/Primitives";
import {
  hillEncrypt, hillDecrypt,
  validateMatrix, invertMatrix, buildMatrix,
  MATRIX_SIZES, DEFAULT_MATRIX_VALUES,
} from "../../utils/ciphers/hill.js";
import { useBreakpoint } from "../../hooks/useBreakpoint";

// ── Matrix size selector ──────────────────────
function SizeSelector({ size, onChange }) {
  return (
    <div style={{ display: "flex", gap: 0, border: "var(--border)" }}>
      {MATRIX_SIZES.map((s) => {
        const active = size === s;
        return (
          <button key={s} onClick={() => onChange(s)}
            style={{
              flex: 1, padding: "9px 4px",
              background: active ? "var(--black)" : "var(--white)",
              color: active ? "var(--yellow)" : "var(--charcoal)",
              border: "none",
              borderRight: s < 5 ? "1px solid var(--gray-pale)" : "none",
              fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12,
              cursor: "pointer", transition: "all 0.12s",
              letterSpacing: "0.06em",
            }}>
            {s}×{s}
          </button>
        );
      })}
    </div>
  );
}

// ── n×n grid of number inputs ────────────────
function MatrixInputGrid({ n, values, onChange }) {
  const cellSize = n <= 2 ? 56 : n === 3 ? 48 : n === 4 ? 42 : 38;
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${n}, 1fr)`,
      gap: 5,
      maxWidth: n * (cellSize + 5),
    }}>
      {values.map((v, idx) => {
        const row = Math.floor(idx / n);
        const col = idx % n;
        return (
          <div key={idx}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 8,
              color: "var(--gray)", textAlign: "center", marginBottom: 2,
              letterSpacing: "0.04em",
            }}>
              {row},{col}
            </div>
            <input
              type="number" min={0} max={25}
              value={v}
              onChange={e => onChange(idx, e.target.value)}
              style={{
                width: "100%",
                background: "var(--white)",
                border: "var(--border)",
                padding: "6px 2px",
                fontFamily: "var(--font-mono)",
                fontSize: n <= 3 ? 16 : 13,
                fontWeight: 700,
                color: "var(--black)",
                textAlign: "center",
                outline: "none",
                boxShadow: "var(--shadow)",
                boxSizing: "border-box",
              }}
              onFocus={e => { e.target.style.borderColor = "var(--red)"; e.target.style.boxShadow = "var(--shadow-red)"; }}
              onBlur={e => { e.target.style.borderColor = ""; e.target.style.boxShadow = "var(--shadow)"; }}
            />
          </div>
        );
      })}
    </div>
  );
}

// ── Read-only matrix display ──────────────────
function MatrixReadOnly({ n, values, highlight = false }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${n}, 1fr)`,
      gap: 4,
      border: "var(--border)",
      padding: 6,
      background: highlight ? "var(--black)" : "var(--paper)",
      boxShadow: "var(--shadow)",
    }}>
      {values.map((v, i) => (
        <div key={i} style={{
          textAlign: "center", padding: n <= 3 ? "8px 4px" : "5px 2px",
          border: "1px solid var(--gray-pale)",
          background: highlight ? "var(--charcoal)" : "var(--white)",
          fontFamily: "var(--font-mono)", fontWeight: 700,
          fontSize: n <= 3 ? 15 : 12,
          color: highlight ? "var(--yellow)" : "var(--black)",
        }}>
          {v}
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────
export default function HillCipher() {
  const [text, setText]     = useState("");
  const [size, setSize]     = useState(2);
  const [mv, setMv]         = useState(DEFAULT_MATRIX_VALUES[2]);
  const [result, setResult] = useState("");
  const [error, setError]   = useState("");
  const [steps, setSteps]   = useState([]);
  const { isMobile }        = useBreakpoint();

  const reset = () => { setResult(""); setError(""); setSteps([]); };

  // Change matrix size — load default values
  const handleSizeChange = (n) => {
    setSize(n);
    setMv([...DEFAULT_MATRIX_VALUES[n]]);
    reset();
  };

  // Update single cell
  const handleCellChange = (idx, val) => {
    setMv(prev => prev.map((x, i) => i === idx ? (Number(val) || 0) : x));
  };

  const matrix    = useMemo(() => buildMatrix(mv, size), [mv, size]);
  const { valid, det, message } = useMemo(() => validateMatrix(matrix), [matrix]);
  const invMatrix = useMemo(() => valid ? invertMatrix(matrix) : null, [matrix, valid]);

  const handleEncrypt = () => {
    reset();
    const r = hillEncrypt(text, matrix);
    if (r.error) setError(r.error); else { setResult(r.result); setSteps(r.steps); }
  };
  const handleDecrypt = () => {
    reset();
    const r = hillDecrypt(text, matrix);
    if (r.error) setError(r.error); else { setResult(r.result); setSteps(r.steps); }
  };

  const controls = (
    <>
      {/* Text input */}
      <div>
        <Label htmlFor="hill-text">Plaintext / Ciphertext</Label>
        <Textarea id="hill-text" value={text} onChange={e => setText(e.target.value)}
          placeholder={`Enter your message… (padded to multiple of ${size} with X)`}
          rows={4} />
      </div>

      {/* Matrix size selector */}
      <div>
        <Label>Matrix Size</Label>
        <SizeSelector size={size} onChange={handleSizeChange} />
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          color: "var(--gray)", marginTop: 5, letterSpacing: "0.08em",
        }}>
          Block size = {size} letters · Padding char = X
        </div>
      </div>

      {/* Matrix input grid */}
      <div>
        <Label>Key Matrix  {size}×{size}  (values 0–25)</Label>
        <div style={{ overflowX: "auto" }}>
          <MatrixInputGrid n={size} values={mv} onChange={handleCellChange} />
        </div>
      </div>

      {/* Validation status */}
      <Panel accent={!valid} yellow={valid}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: valid ? "var(--black)" : "var(--red)", lineHeight: 1.8,
        }}>
          {message}
        </div>
      </Panel>

      {/* Key + Inverse matrix display */}
      {invMatrix && (
        <Panel>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700,
            letterSpacing: "0.16em", color: "var(--charcoal)", marginBottom: 10,
          }}>
            KEY MATRIX K  vs  INVERSE K⁻¹
          </div>
          <div style={{
            display: "flex", gap: 16, alignItems: "flex-start",
            flexWrap: "wrap",
          }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--gray)", marginBottom: 4, letterSpacing: "0.1em" }}>K (encrypt)</div>
              <MatrixReadOnly n={size} values={mv} />
            </div>
            <div style={{
              display: "flex", alignItems: "center",
              paddingTop: size <= 2 ? 22 : size === 3 ? 32 : 40,
              fontFamily: "var(--font-mono)", fontSize: 18, color: "var(--charcoal)",
            }}>→</div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--gray)", marginBottom: 4, letterSpacing: "0.1em" }}>K⁻¹ (decrypt)</div>
              <MatrixReadOnly n={size} values={invMatrix.flat()} highlight />
            </div>
          </div>
        </Panel>
      )}
    </>
  );

  return (
    <CipherPanel
      title="Hill Cipher"
      cipherKey="MODULE IV"
      badgeLabel="Matrix Algebra"
      description={`Uses linear algebra to encrypt ${size}-letter blocks via ${size}×${size} matrix multiplication modulo 26. Invented by Lester S. Hill in 1929. Supports 2×2 to 5×5 key matrices.`}
      note={`The ${size}×${size} key matrix must be invertible mod 26. Plaintext is padded to a multiple of ${size} with X. Decryption uses the matrix inverse mod 26.`}
      controls={controls}
      onEncrypt={handleEncrypt}
      onDecrypt={handleDecrypt}
      result={result} error={error} steps={steps}
    />
  );
}
