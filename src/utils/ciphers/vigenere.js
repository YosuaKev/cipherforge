/**
 * VIGENERE CIPHER — Pure Logic
 * Polyalphabetic substitution cipher (26-letter alphabet A–Z)
 */

/** Clean input: uppercase letters only */
const clean = (str) => str.toUpperCase().replace(/[^A-Z]/g, "");

/**
 * Encrypt plaintext with a keyword using Vigenère cipher.
 * @param {string} plaintext
 * @param {string} key
 * @returns {{ result: string, steps: string[], error: string|null }}
 */
export function vigenereEncrypt(plaintext, key) {
  const t = clean(plaintext);
  const k = clean(key);

  if (!t) return { result: "", steps: [], error: "Plaintext cannot be empty." };
  if (!k) return { result: "", steps: [], error: "Key must contain at least one letter (A–Z)." };

  let result = "";
  const steps = [];

  for (let i = 0; i < t.length; i++) {
    const p  = t.charCodeAt(i) - 65;
    const ki = k.charCodeAt(i % k.length) - 65;
    const c  = (p + ki) % 26;
    const outChar = String.fromCharCode(c + 65);
    result += outChar;
    steps.push(
      `[${String(i + 1).padStart(2, "0")}]  ${t[i]}(${p}) + ${k[i % k.length]}(${ki}) = ${outChar}(${c})`
    );
  }

  return { result, steps, error: null };
}

/**
 * Decrypt ciphertext with a keyword using Vigenère cipher.
 * @param {string} ciphertext
 * @param {string} key
 * @returns {{ result: string, steps: string[], error: string|null }}
 */
export function vigenereDecrypt(ciphertext, key) {
  const t = clean(ciphertext);
  const k = clean(key);

  if (!t) return { result: "", steps: [], error: "Ciphertext cannot be empty." };
  if (!k) return { result: "", steps: [], error: "Key must contain at least one letter (A–Z)." };

  let result = "";
  const steps = [];

  for (let i = 0; i < t.length; i++) {
    const c  = t.charCodeAt(i) - 65;
    const ki = k.charCodeAt(i % k.length) - 65;
    const p  = ((c - ki) + 26) % 26;
    const outChar = String.fromCharCode(p + 65);
    result += outChar;
    steps.push(
      `[${String(i + 1).padStart(2, "0")}]  ${t[i]}(${c}) − ${k[i % k.length]}(${ki}) = ${outChar}(${p})`
    );
  }

  return { result, steps, error: null };
}

/**
 * Build Vigenère tableau rows for a given key (for UI preview).
 * @param {string} key
 * @param {number} maxRows
 * @returns {{ letter: string, row: string }[]}
 */
export function buildTableau(key, maxRows = 6) {
  return clean(key)
    .split("")
    .slice(0, maxRows)
    .map((letter) => {
      const shift = letter.charCodeAt(0) - 65;
      const row = Array.from({ length: 26 }, (_, i) =>
        String.fromCharCode(65 + (i + shift) % 26)
      ).join(" ");
      return { letter, row };
    });
}
