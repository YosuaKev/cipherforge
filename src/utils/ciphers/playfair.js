// playfair.js
/**
 * PLAYFAIR CIPHER — Pure Logic
 * Digraph substitution cipher using a 5×5 key matrix (J = I)
 */

/**
 * Build a 5×5 matrix (25 letters) from keyword.
 * J merged with I.
 */
export function buildPlayfairMatrix(keyword) {
  const seen = new Set();

  const source = ((keyword || "").toUpperCase() + "ABCDEFGHIKLMNOPQRSTUVWXYZ")
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");

  const matrix = [];

  for (const ch of source) {
    if (!seen.has(ch)) {
      seen.add(ch);
      matrix.push(ch);
    }
  }

  return matrix; // length = 25
}

/**
 * Prepare plaintext:
 * - Uppercase
 * - J → I
 * - Remove non-letters
 * - Insert X between double letters
 * - Pad odd length with X
 */
export function preparePlayfairPlaintext(text) {
  let t = (text || "")
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");

  let result = "";
  let i = 0;

  while (i < t.length) {
    const a = t[i];
    const b = t[i + 1];

    result += a;

    if (!b) {
      result += "X";
      i += 1;
    } else if (a === b) {
      result += "X";
      i += 1;
    } else {
      result += b;
      i += 2;
    }
  }

  return result;
}

/**
 * Prepare ciphertext (NO filler insertion here!)
 */
export function preparePlayfairCiphertext(text) {
  return (text || "")
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");
}

/**
 * Get row and column of character in matrix
 */
function getPosition(matrix, ch) {
  const index = matrix.indexOf(ch);
  return [Math.floor(index / 5), index % 5];
}

/**
 * Process one digraph (encrypt/decrypt)
 */
function processDigraph(matrix, a, b, encrypt) {
  const [ra, ca] = getPosition(matrix, a);
  const [rb, cb] = getPosition(matrix, b);

  let ea, eb, rule;

  if (ra === rb) {
    // Same row
    ea = matrix[ra * 5 + (encrypt ? (ca + 1) % 5 : (ca + 4) % 5)];
    eb = matrix[rb * 5 + (encrypt ? (cb + 1) % 5 : (cb + 4) % 5)];
    rule = "same-row";
  } else if (ca === cb) {
    // Same column
    ea = matrix[(encrypt ? (ra + 1) % 5 : (ra + 4) % 5) * 5 + ca];
    eb = matrix[(encrypt ? (rb + 1) % 5 : (rb + 4) % 5) * 5 + cb];
    rule = "same-column";
  } else {
    // Rectangle rule
    ea = matrix[ra * 5 + cb];
    eb = matrix[rb * 5 + ca];
    rule = "rectangle";
  }

  return { ea, eb, rule };
}

/**
 * Encrypt Playfair
 */
export function playfairEncrypt(plaintext, keyword) {
  if (!keyword || !keyword.trim())
    return { result: "", steps: [], preparedText: "", error: "A keyword is required." };

  const matrix = buildPlayfairMatrix(keyword);
  const prepared = preparePlayfairPlaintext(plaintext);

  if (!prepared)
    return { result: "", steps: [], preparedText: "", error: "Plaintext cannot be empty." };

  let result = "";
  const steps = [];

  for (let i = 0; i < prepared.length; i += 2) {
    const a = prepared[i];
    const b = prepared[i + 1];

    const { ea, eb, rule } = processDigraph(matrix, a, b, true);

    result += ea + eb;
    steps.push(`[${a}${b}] → ${rule} → [${ea}${eb}]`);
  }

  return { result, steps, preparedText: prepared, error: null };
}

/**
 * Decrypt Playfair
 */
export function playfairDecrypt(ciphertext, keyword) {
  if (!keyword || !keyword.trim())
    return { result: "", steps: [], preparedText: "", error: "A keyword is required." };

  const matrix = buildPlayfairMatrix(keyword);
  const prepared = preparePlayfairCiphertext(ciphertext);

  if (!prepared)
    return { result: "", steps: [], preparedText: "", error: "Ciphertext cannot be empty." };

  if (prepared.length % 2 !== 0)
    return { result: "", steps: [], preparedText: prepared, error: "Ciphertext length must be even." };

  let result = "";
  const steps = [];

  for (let i = 0; i < prepared.length; i += 2) {
    const a = prepared[i];
    const b = prepared[i + 1];

    const { ea, eb, rule } = processDigraph(matrix, a, b, false);

    result += ea + eb;
    steps.push(`[${a}${b}] → ${rule} → [${ea}${eb}]`);
  }

  return { result, steps, preparedText: prepared, error: null };
}