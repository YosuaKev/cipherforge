/**
 * AFFINE CIPHER — UI Component
 * Calls logic from: src/utils/ciphers/affine.js
 */

import { useState } from "react";
import { CipherPanel } from "../ui/CipherPanel";
import { Label, Input, Textarea, Select, Panel } from "../ui/Primitives";
import { affineEncrypt, affineDecrypt, modularInverse, VALID_A_VALUES } from "../../utils/ciphers/affine.js";
import { useBreakpoint } from "../../hooks/useBreakpoint";

export default function AffineCipher() {
  const [text, setText]     = useState("");
  const [a, setA]           = useState(5);
  const [b, setB]           = useState(8);
  const [result, setResult] = useState("");
  const [error, setError]   = useState("");
  const [steps, setSteps]   = useState([]);

  const reset = () => { setResult(""); setError(""); setSteps([]); };

  const handleEncrypt = () => {
    reset();
    const r = affineEncrypt(text, a, b);
    if (r.error) setError(r.error);
    else { setResult(r.result); setSteps(r.steps); }
  };

  const handleDecrypt = () => {
    reset();
    const r = affineDecrypt(text, a, b);
    if (r.error) setError(r.error);
    else { setResult(r.result); setSteps(r.steps); }
  };

  const inv = modularInverse(Number(a), 26);

  const { isMobile } = useBreakpoint();

  const controls = (
    <>
      <div>
        <Label htmlFor="aff-text">Plaintext / Ciphertext</Label>
        <Textarea
          id="aff-text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter your message here…"
          rows={4}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        <div>
          <Label htmlFor="aff-a">Key 'a' (coprime with 26)</Label>
          <Select id="aff-a" value={a} onChange={e => setA(e.target.value)}>
            {VALID_A_VALUES.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="aff-b">Key 'b' (shift 0–25)</Label>
          <Input
            id="aff-b"
            type="number"
            min={0}
            max={25}
            value={b}
            onChange={e => setB(e.target.value)}
          />
        </div>
      </div>

      <Panel yellow>
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.18em",
          marginBottom: 8,
          color: "var(--black)",
        }}>
          FORMULA
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 2, color: "var(--black)" }}>
          <div>Encrypt: <strong>E(x) = ({a}·x + {b}) mod 26</strong></div>
          <div>Decrypt: <strong>D(y) = {inv ?? "?"} · (y − {b}) mod 26</strong></div>
          <div style={{ fontSize: 11, color: inv ? "var(--charcoal)" : "var(--red)", marginTop: 2 }}>
            a⁻¹ mod 26 = {inv ? `${inv} ✓` : "INVALID — no inverse exists"}
          </div>
        </div>
      </Panel>
    </>
  );

  return (
    <CipherPanel
      title="Affine Cipher"
      cipherKey="MODULE II"
      badgeLabel="Linear Function"
      description="A monoalphabetic cipher that uses the formula E(x) = (ax + b) mod 26 where 'a' must be coprime to 26. It generalizes the Caesar cipher (a=1) and Atbash cipher (a=25, b=25)."
      note="'a' must be coprime with 26 to ensure reversibility. 'b' acts as an additive shift on top of the multiplication."
      controls={controls}
      onEncrypt={handleEncrypt}
      onDecrypt={handleDecrypt}
      result={result}
      error={error}
      steps={steps}
    />
  );
}
