/**
 * ENIGMA MACHINE — Pure Logic (+ Ringstellung)
 * Simulates the Wehrmacht/Luftwaffe Enigma I machine
 * Rotors I–V, Reflectors B & C, 13-pair Plugboard
 * Includes: Double-stepping + Ringstellung (ring settings)
 */

/** Historical rotor wirings (forward alphabet → scrambled alphabet) */
export const ROTOR_DEFINITIONS = {
  I:   { wiring: "EKMFLGDQVZNTOWYHXUSPAIBRCJ", notch: "Q", name: "Rotor I" },
  II:  { wiring: "AJDKSIRUXBLHWTMCQGZNPYFVOE", notch: "E", name: "Rotor II" },
  III: { wiring: "BDFHJLCPRTXVZNYEIWGAKMUSQO", notch: "V", name: "Rotor III" },
  IV:  { wiring: "ESOVPZJAYQUIRHXLNFTGKDCMWB", notch: "J", name: "Rotor IV" },
  V:   { wiring: "VZBRGITYUPSDNHLXAWMJQOFECK", notch: "Z", name: "Rotor V" },
};

/** Historical reflector wirings */
export const REFLECTOR_DEFINITIONS = {
  B: { wiring: "YRUHQSLDPXNGOKMIEBFZCWVJAT", name: "UKW-B" },
  C: { wiring: "FVPJIAOYEDRZXWGCTKUQSBNMHL", name: "UKW-C" },
};

export const ROTOR_KEYS = Object.keys(ROTOR_DEFINITIONS);
export const REFLECTOR_KEYS = Object.keys(REFLECTOR_DEFINITIONS);

/**
 * Parse plugboard string (e.g. "AB CD EF") into a swap map.
 * @param {string} plugboardStr
 * @returns {{ map: Record<string,string>, error: string|null }}
 */
export function parsePlugboard(plugboardStr) {
  const map = {};
  const pairs = (plugboardStr || "")
    .toUpperCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const used = new Set();

  for (const pair of pairs) {
    if (pair.length !== 2 || !/^[A-Z]{2}$/.test(pair))
      return { map: {}, error: `Invalid plugboard pair: "${pair}". Use letter pairs like "AB CD".` };
    if (pair[0] === pair[1])
      return { map: {}, error: `Cannot plug a letter to itself: "${pair}".` };
    if (used.has(pair[0]) || used.has(pair[1]))
      return { map: {}, error: `Letter used more than once in plugboard: "${pair}".` };

    used.add(pair[0]);
    used.add(pair[1]);
    map[pair[0]] = pair[1];
    map[pair[1]] = pair[0];
  }

  return { map, error: null };
}

function isAZ(ch) {
  return typeof ch === "string" && /^[A-Z]$/.test(ch);
}

function toIndexAZ(ch) {
  return ch.charCodeAt(0) - 65;
}

function mod26(n) {
  return (n % 26 + 26) % 26;
}

/**
 * Ring-aware forward pass through a rotor.
 * Formula (historical):
 *  in'  = (n + pos - ring) mod 26
 *  out' = wiring[in'] (as index)
 *  out  = (out' - pos + ring) mod 26
 */
function rotorForward(wiring, pos, ring, n) {
  const shiftedIn = mod26(n + pos - ring);
  const wiredOut = wiring.charCodeAt(shiftedIn) - 65;
  return mod26(wiredOut - pos + ring);
}

/**
 * Ring-aware backward pass through a rotor (inverse wiring).
 *  in'  = (n + pos - ring) mod 26
 *  find index in wiring where letter == in'
 *  out  = (foundIndex - pos + ring) mod 26
 */
function rotorBackward(wiring, pos, ring, n) {
  const shiftedIn = mod26(n + pos - ring);
  const letter = String.fromCharCode(65 + shiftedIn);
  const foundIndex = wiring.indexOf(letter); // 0..25
  return mod26(foundIndex - pos + ring);
}

/**
 * Ring-aware notch check.
 * Notch is fixed on rotor core; when you change ring, the visible turnover letter shifts.
 * atNotch = pos == (notchIndex - ring) mod 26
 */
function isAtNotch(pos, ring, notchLetter) {
  const notchIndex = toIndexAZ(notchLetter);
  const turnoverPos = mod26(notchIndex - ring);
  return pos === turnoverPos;
}

/**
 * Encrypt/decrypt a message through the Enigma machine.
 * (Enigma is symmetric — same function for both operations)
 *
 * @param {string} message
 * @param {string} r1Key   — left rotor key   ("I"–"V")
 * @param {string} r2Key   — middle rotor key
 * @param {string} r3Key   — right rotor key
 * @param {string} pos1    — left start position   (A–Z)
 * @param {string} pos2    — middle start position
 * @param {string} pos3    — right start position
 * @param {string} ring1   — left ring setting (A–Z)  (default "A")
 * @param {string} ring2   — middle ring setting (A–Z) (default "A")
 * @param {string} ring3   — right ring setting (A–Z)  (default "A")
 * @param {string} refKey  — reflector key ("B" | "C")
 * @param {string} plugboardStr — plugboard pairs, e.g. "AB CD"
 * @returns {{ result: string, steps: string[], error: string|null }}
 */
export function enigmaProcess(
  message,
  r1Key, r2Key, r3Key,
  pos1, pos2, pos3,
  ring1 = "A", ring2 = "A", ring3 = "A",
  refKey,
  plugboardStr
) {
  const r1def = ROTOR_DEFINITIONS[r1Key];
  const r2def = ROTOR_DEFINITIONS[r2Key];
  const r3def = ROTOR_DEFINITIONS[r3Key];
  const refDef = REFLECTOR_DEFINITIONS[refKey];

  if (!r1def || !r2def || !r3def) return { result: "", steps: [], error: "Invalid rotor selection." };
  if (!refDef) return { result: "", steps: [], error: "Invalid reflector selection." };

  const P1 = (pos1 || "").toUpperCase();
  const P2 = (pos2 || "").toUpperCase();
  const P3 = (pos3 || "").toUpperCase();
  if (!isAZ(P1) || !isAZ(P2) || !isAZ(P3)) {
    return { result: "", steps: [], error: "Invalid start positions. Use letters A–Z for pos1/pos2/pos3." };
  }

  const R1 = (ring1 || "A").toUpperCase();
  const R2 = (ring2 || "A").toUpperCase();
  const R3 = (ring3 || "A").toUpperCase();
  if (!isAZ(R1) || !isAZ(R2) || !isAZ(R3)) {
    return { result: "", steps: [], error: "Invalid ring settings. Use letters A–Z for ring1/ring2/ring3." };
  }

  const ring = [toIndexAZ(R1), toIndexAZ(R2), toIndexAZ(R3)];

  const { map: plugMap, error: plugError } = parsePlugboard(plugboardStr || "");
  if (plugError) return { result: "", steps: [], error: plugError };

  // Mutable rotor positions: [left, middle, right]
  let rp = [toIndexAZ(P1), toIndexAZ(P2), toIndexAZ(P3)];

  const t = (message || "").toUpperCase().replace(/[^A-Z]/g, "");
  if (!t) return { result: "", steps: [], error: "Message cannot be empty." };

  let result = "";
  const steps = [];

  for (let i = 0; i < t.length; i++) {
    const ch = t[i];

    // ── Step rotors (canonical Enigma I + ring-correct notch) ──
    const atNotchMiddle = isAtNotch(rp[1], ring[1], r2def.notch);
    const atNotchRight  = isAtNotch(rp[2], ring[2], r3def.notch);

    // Left steps if middle at notch
    if (atNotchMiddle) rp[0] = mod26(rp[0] + 1);

    // Middle steps if right at notch OR middle at notch
    if (atNotchRight || atNotchMiddle) rp[1] = mod26(rp[1] + 1);

    // Right always steps
    rp[2] = mod26(rp[2] + 1);

    // ── Signal path ──
    let n = toIndexAZ(ch);

    // Plugboard in
    if (plugMap[ch]) n = toIndexAZ(plugMap[ch]);

    // Forward: right → middle → left
    n = rotorForward(r3def.wiring, rp[2], ring[2], n);
    n = rotorForward(r2def.wiring, rp[1], ring[1], n);
    n = rotorForward(r1def.wiring, rp[0], ring[0], n);

    // Reflector
    n = refDef.wiring.charCodeAt(n) - 65;

    // Backward: left → middle → right
    n = rotorBackward(r1def.wiring, rp[0], ring[0], n);
    n = rotorBackward(r2def.wiring, rp[1], ring[1], n);
    n = rotorBackward(r3def.wiring, rp[2], ring[2], n);

    // Plugboard out
    let outChar = String.fromCharCode(65 + n);
    if (plugMap[outChar]) outChar = plugMap[outChar];

    result += outChar;

    steps.push(
      `[${String(i + 1).padStart(2, "0")}] ${ch} → plugboard → ` +
      `${r3Key}[${String.fromCharCode(65 + rp[2])} R:${R3}]/` +
      `${r2Key}[${String.fromCharCode(65 + rp[1])} R:${R2}]/` +
      `${r1Key}[${String.fromCharCode(65 + rp[0])} R:${R1}] → ` +
      `reflector ${refKey} → ${outChar}`
    );
  }

  return { result, steps, error: null };
}