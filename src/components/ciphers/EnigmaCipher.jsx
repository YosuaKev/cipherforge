/**
 * ENIGMA MACHINE — UI Component
 * Calls logic from: src/utils/ciphers/enigma.js
 */

import { useState } from "react";
import { CipherPanel } from "../ui/CipherPanel";
import { Label, Input, Textarea, Select, Panel, Divider } from "../ui/Primitives";
import {
  enigmaProcess,
  ROTOR_DEFINITIONS,
  REFLECTOR_DEFINITIONS,
  ROTOR_KEYS,
  REFLECTOR_KEYS,
} from "../../utils/ciphers/enigma.js";
import { useBreakpoint } from "../../hooks/useBreakpoint";

/* ── Rotor display pill ── */
function RotorStatus({ label, rotorKey, pos }) {
  return (
    <div style={{
      flex: 1,
      border: "var(--border)",
      background: "var(--black)",
      padding: "10px 12px",
      textAlign: "center",
      boxShadow: "var(--shadow)",
    }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--gray)", letterSpacing: "0.12em", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: "var(--yellow)", letterSpacing: "0.1em" }}>
        {pos}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--gray-light)", marginTop: 2 }}>
        Rotor {rotorKey}
      </div>
    </div>
  );
}

export default function EnigmaCipher() {
  const [text, setText]       = useState("");
  const [rotors, setRotors]   = useState(["I", "II", "III"]);
  const [pos, setPos]         = useState(["A", "A", "A"]);
  const [ref, setRef]         = useState("B");
  const [pb, setPb]           = useState("");
  const [result, setResult]   = useState("");
  const [error, setError]     = useState("");
  const [steps, setSteps]     = useState([]);

  const reset = () => { setResult(""); setError(""); setSteps([]); };
  const { isMobile } = useBreakpoint();
  const POSITIONS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  const handleProcess = () => {
    reset();
    const r = enigmaProcess(text, ...rotors, ...pos, ref, pb);
    if (r.error) setError(r.error);
    else { setResult(r.result); setSteps(r.steps.slice(0, 40)); }
  };

  const updateRotor = (i, val) => setRotors(p => p.map((x, j) => j === i ? val : x));
  const updatePos   = (i, val) => setPos(p => p.map((x, j) => j === i ? val : x));

  const controls = (
    <>
      <div>
        <Label htmlFor="enig-text">Message (Enigma is symmetric)</Label>
        <Textarea
          id="enig-text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter message — same settings decrypt it…"
          rows={4}
        />
      </div>

      {/* Rotor position display */}
      <Panel>
        <Label>Rotor Window</Label>
        <div style={{ display: "flex", gap: 8 }}>
          {["LEFT", "MIDDLE", "RIGHT"].map((lbl, i) => (
            <RotorStatus key={i} label={lbl} rotorKey={rotors[i]} pos={pos[i]} />
          ))}
        </div>
      </Panel>

      {/* Rotor selection */}
      <div>
        <Label>Rotor Selection & Starting Positions</Label>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
          {[0, 1, 2].map(i => (
            <div key={i}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "var(--gray)",
                marginBottom: 4,
                letterSpacing: "0.1em",
              }}>
                {["LEFT (slow)", "MIDDLE", "RIGHT (fast)"][i]}
              </div>
              <Select value={rotors[i]} onChange={e => updateRotor(i, e.target.value)}>
                {ROTOR_KEYS.map(k => (
                  <option key={k} value={k}>
                    Rotor {k}  (notch {ROTOR_DEFINITIONS[k].notch})
                  </option>
                ))}
              </Select>
              <div style={{ marginTop: 6 }}>
                <Select value={pos[i]} onChange={e => updatePos(i, e.target.value)}>
                  {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </Select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* Reflector + Plugboard */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        <div>
          <Label htmlFor="enig-ref">Reflector</Label>
          <Select id="enig-ref" value={ref} onChange={e => setRef(e.target.value)}>
            {REFLECTOR_KEYS.map(k => (
              <option key={k} value={k}>{REFLECTOR_DEFINITIONS[k].name}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="enig-pb">Plugboard (e.g. AB CD EF)</Label>
          <Input
            id="enig-pb"
            value={pb}
            onChange={e => setPb(e.target.value)}
            placeholder="AB CD EF GH…"
          />
        </div>
      </div>

      {/* State summary */}
      <Panel yellow>
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.15em",
          marginBottom: 6,
        }}>
          MACHINE STATE
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 2, color: "var(--black)" }}>
          Rotors:    <strong>{rotors.join(" — ")}</strong><br />
          Positions: <strong>{pos.join(" / ")}</strong><br />
          Reflector: <strong>{ref} ({REFLECTOR_DEFINITIONS[ref].name})</strong>
          {pb && <><br />Plugboard: <strong>{pb}</strong></>}
        </div>
      </Panel>
    </>
  );

  return (
    <CipherPanel
      title="Enigma Machine"
      cipherKey="MODULE V"
      badgeLabel="Rotor Simulation"
      description="Simulates the electro-mechanical Enigma I cipher machine used by the German military in WWII. Features 3 configurable rotors (I–V), a reflector (B or C), and a 13-pair plugboard. Cracked at Bletchley Park by Alan Turing's team."
      note="Enigma is self-reciprocal: encrypting ciphertext with identical settings recovers plaintext. No dedicated decrypt mode needed."
      controls={controls}
      onEncrypt={handleProcess}
      onDecrypt={handleProcess}
      result={result}
      error={error}
      steps={steps}
    />
  );
}
