// affine.js
/**
 * AFFINE CIPHER — Pure Logic
 * Monoalphabetic linear function cipher E(x) = (a*x + b) mod 26
 */

/** Values of 'a' that are coprime with 26 */
export const VALID_A_VALUES = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

/** Clean input: uppercase letters only */
const clean = (str) => (str || "").toUpperCase().replace(/[^A-Z]/g, "");

/**
 * Compute modular inverse of a mod m.
 * Returns null if no inverse exists.
 */
export function modularInverse(a, m) {
  const normalized = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) {
    if ((normalized * x) % m === 1) return x;
  }
  return null;
}

/**
 * Encrypt plaintext with Affine cipher: E(x) = (a*x + b) mod 26.
 * @param {string} plaintext
 * @param {number} a  — must be coprime with 26
 * @param {number} b  — shift value (0–25)
 * @returns {{ result: string, steps: string[], error: string|null }}
 */
export function affineEncrypt(plaintext, a, b) {
  const aNum = Number(a);
  const bNum = Number(b);

  if (!VALID_A_VALUES.includes(aNum))
    return {
      result: "",
      steps: [],
      error: `'a' must be coprime with 26. Valid values: ${VALID_A_VALUES.join(", ")}.`,
    };

  if (!Number.isFinite(bNum) || bNum < 0 || bNum > 25)
    return { result: "", steps: [], error: "'b' must be between 0 and 25." };

  const t = clean(plaintext);
  if (!t) return { result: "", steps: [], error: "Plaintext cannot be empty." };

  let result = "";
  const steps = [];

  for (const ch of t) {
    const x = ch.charCodeAt(0) - 65;
    const c = (aNum * x + bNum) % 26;
    const outChar = String.fromCharCode(c + 65);
    result += outChar;
    steps.push(`E(${ch}) = (${aNum}×${x} + ${bNum}) mod 26 = ${c}  →  ${outChar}`);
  }

  return { result, steps, error: null };
}

/**
 * Decrypt ciphertext with Affine cipher: D(y) = a⁻¹(y - b) mod 26.
 * @param {string} ciphertext
 * @param {number} a
 * @param {number} b
 * @returns {{ result: string, steps: string[], error: string|null }}
 */
export function affineDecrypt(ciphertext, a, b) {
  const aNum = Number(a);
  const bNum = Number(b);

  if (!VALID_A_VALUES.includes(aNum))
    return {
      result: "",
      steps: [],
      error: `'a' must be coprime with 26. Valid values: ${VALID_A_VALUES.join(", ")}.`,
    };

  if (!Number.isFinite(bNum) || bNum < 0 || bNum > 25)
    return { result: "", steps: [], error: "'b' must be between 0 and 25." };

  const inv = modularInverse(aNum, 26);
  if (inv === null)
    return { result: "", steps: [], error: `No modular inverse exists for a=${aNum} mod 26.` };

  const t = clean(ciphertext);
  if (!t) return { result: "", steps: [], error: "Ciphertext cannot be empty." };

  let result = "";
  const steps = [];

  for (const ch of t) {
    const y = ch.charCodeAt(0) - 65;
    const p = (inv * ((y - bNum + 26) % 26)) % 26;
    const outChar = String.fromCharCode(p + 65);
    result += outChar;
    steps.push(`D(${ch}) = ${inv}×(${y} − ${bNum}) mod 26 = ${p}  →  ${outChar}`);
  }

  return { result, steps, error: null };
}