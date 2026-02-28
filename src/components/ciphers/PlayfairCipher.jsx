/**
 * PLAYFAIR CIPHER — UI Component
 * Calls logic from: src/utils/ciphers/playfair.js
 */

import { useState } from "react";
import { CipherPanel } from "../ui/CipherPanel";
import { Label, Input, Textarea, Panel } from "../ui/Primitives";
import { playfairEncrypt, playfairDecrypt, buildPlayfairMatrix } from "../../utils/ciphers/playfair.js";

/* ── 5×5 Matrix visual ── */
function MatrixGrid({ matrix, keyword }) {
  const keyChars = new Set(
    keyword.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "").split("")
  );
  return (
    <div>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.18em",
        color: "var(--charcoal)",
        marginBottom: 8,
      }}>
        5 × 5 KEY MATRIX
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 4,
        border: "var(--border)",
        padding: 8,
        background: "var(--white)",
        boxShadow: "var(--shadow)",
      }}>
        {matrix.map((ch, i) => {
          const isKey = keyChars.has(ch);
          return (
            <div key={i} style={{
              textAlign: "center",
              padding: "8px 4px",
              background: isKey ? "var(--black)" : "var(--paper)",
              color: isKey ? "var(--yellow)" : "var(--black)",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: 14,
              border: "var(--border-sm)",
            }}>
              {ch}
            </div>
          );
        })}
      </div>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        color: "var(--gray)",
        marginTop: 5,
      }}>
        Black = keyword letters · Gray = alphabet fill
      </div>
    </div>
  );
}

export default function PlayfairCipher() {
  const [text, setText]     = useState("");
  const [key, setKey]       = useState("");
  const [result, setResult] = useState("");
  const [error, setError]   = useState("");
  const [steps, setSteps]   = useState([]);

  const reset = () => { setResult(""); setError(""); setSteps([]); };
  const matrix = key.trim() ? buildPlayfairMatrix(key) : null;

  const handleEncrypt = () => {
    reset();
    const r = playfairEncrypt(text, key);
    if (r.error) setError(r.error);
    else { setResult(r.result); setSteps(r.steps); }
  };

  const handleDecrypt = () => {
    reset();
    const r = playfairDecrypt(text, key);
    if (r.error) setError(r.error);
    else { setResult(r.result); setSteps(r.steps); }
  };

  const controls = (
    <>
      <div>
        <Label htmlFor="pf-text">Plaintext / Ciphertext (J = I)</Label>
        <Textarea
          id="pf-text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter message… (J will be treated as I)"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="pf-key">Keyword</Label>
        <Input
          id="pf-key"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="e.g.  MONARCHY"
        />
      </div>

      {matrix && (
        <Panel>
          <MatrixGrid matrix={matrix} keyword={key} />
        </Panel>
      )}
    </>
  );

  return (
    <CipherPanel
      title="Playfair Cipher"
      cipherKey="MODULE III"
      badgeLabel="Digraph Substitution"
      description="Encrypts pairs of letters using a 5×5 grid derived from a keyword. Invented by Charles Wheatstone in 1854 and promoted by Lord Playfair. Used by British forces in WWI and WWII."
      note="J is merged with I. Text is split into digraphs; a trailing X is added for odd-length messages. Use identical keyword to decrypt."
      controls={controls}
      onEncrypt={handleEncrypt}
      onDecrypt={handleDecrypt}
      result={result}
      error={error}
      steps={steps}
    />
  );
}
