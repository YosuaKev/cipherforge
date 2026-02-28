/**
 * VIGENERE CIPHER — UI Component
 * Calls logic from: src/utils/ciphers/vigenere.js
 */

import { useState } from "react";
import { CipherPanel } from "../ui/CipherPanel";
import { Label, Input, Textarea, Panel } from "../ui/Primitives";
import { vigenereEncrypt, vigenereDecrypt, buildTableau } from "../../utils/ciphers/vigenere.js";

export default function VigenereCipher() {
  const [text, setText]     = useState("");
  const [key, setKey]       = useState("");
  const [result, setResult] = useState("");
  const [error, setError]   = useState("");
  const [steps, setSteps]   = useState([]);

  const reset = () => { setResult(""); setError(""); setSteps([]); };

  const handleEncrypt = () => {
    reset();
    const r = vigenereEncrypt(text, key);
    if (r.error) setError(r.error);
    else { setResult(r.result); setSteps(r.steps); }
  };

  const handleDecrypt = () => {
    reset();
    const r = vigenereDecrypt(text, key);
    if (r.error) setError(r.error);
    else { setResult(r.result); setSteps(r.steps); }
  };

  const tableau = buildTableau(key, 5);

  const controls = (
    <>
      <div>
        <Label htmlFor="vig-text">Plaintext / Ciphertext</Label>
        <Textarea
          id="vig-text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter your message here…"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="vig-key">Keyword (letters only)</Label>
        <Input
          id="vig-key"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="e.g.  SECRET"
        />
      </div>

      {tableau.length > 0 && (
        <Panel>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: "var(--charcoal)",
            marginBottom: 8,
          }}>
            TABLEAU PREVIEW
          </div>
          {tableau.map(({ letter, row }) => (
            <div key={letter} style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              lineHeight: 2,
              color: "var(--charcoal)",
            }}>
              <span style={{ color: "var(--red)", fontWeight: 700, marginRight: 10 }}>{letter}</span>
              {row}
            </div>
          ))}
        </Panel>
      )}
    </>
  );

  return (
    <CipherPanel
      title="Vigenère Cipher"
      cipherKey="MODULE I"
      badgeLabel="Polyalphabetic"
      description="Encrypts each letter by shifting it by the corresponding letter of a repeating keyword. Named after Blaise de Vigenère (1523–1596), it was called 'le chiffre indéchiffrable' for three centuries."
      note="Non-alphabetic characters are stripped. Output is always uppercase A–Z. Use identical keyword to decrypt."
      controls={controls}
      onEncrypt={handleEncrypt}
      onDecrypt={handleDecrypt}
      result={result}
      error={error}
      steps={steps}
    />
  );
}
