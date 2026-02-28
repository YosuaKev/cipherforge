// hill.js
/**
 * HILL CIPHER — Pure Logic
 * Supports n×n key matrices: 2×2, 3×3, 4×4, 5×5 (mod 26)
 *
 * Matrix inversion uses Gauss-Jordan elimination mod 26.
 */

const clean = (str) => (str || "").toUpperCase().replace(/[^A-Z]/g, "");

export const MATRIX_SIZES = [2, 3, 4, 5];

// ── Modular helpers ──────────────────────────
const mod26 = (x) => ((x % 26) + 26) % 26;

export function modularInverse(a, m = 26) {
  const n = mod26(a);
  for (let x = 1; x < m; x++) if ((n * x) % m === 1) return x;
  return null;
}

// ── Matrix helpers ───────────────────────────
function identity(n) {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );
}

export function matVecMul(M, v) {
  return M.map((row) =>
    mod26(row.reduce((sum, val, j) => sum + mod26(val) * v[j], 0))
  );
}

export function invertMatrix(M) {
  const n = M.length;

  // normalize + build augmented matrix [M | I]
  const aug = M.map((row, i) => [...row.map(mod26), ...identity(n)[i]]);

  for (let col = 0; col < n; col++) {
    // find pivot row with invertible pivot (gcd(pivot,26)=1)
    let pivotRow = -1;
    for (let row = col; row < n; row++) {
      if (modularInverse(aug[row][col]) !== null) {
        pivotRow = row;
        break;
      }
    }
    if (pivotRow === -1) return null;

    // swap into place
    if (pivotRow !== col) [aug[col], aug[pivotRow]] = [aug[pivotRow], aug[col]];

    // scale pivot row to make pivot = 1
    const inv = modularInverse(aug[col][col]);
    if (inv === null) return null;
    aug[col] = aug[col].map((v) => mod26(v * inv));

    // eliminate other rows
    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = aug[row][col];
      if (factor === 0) continue;
      aug[row] = aug[row].map((v, j) => mod26(v - factor * aug[col][j]));
    }
  }

  // right half is inverse
  return aug.map((row) => row.slice(n));
}

// Determinant (safe only for small n due to JS integer precision)
function determinant(M) {
  const n = M.length;
  if (n === 1) return M[0][0];
  if (n === 2) return M[0][0] * M[1][1] - M[0][1] * M[1][0];

  let det = 0;
  for (let j = 0; j < n; j++) {
    const minor = M.slice(1).map((row) => row.filter((_, c) => c !== j));
    det += (j % 2 === 0 ? 1 : -1) * M[0][j] * determinant(minor);
  }
  return det;
}

/**
 * Validate matrix for Hill cipher (invertible mod 26).
 * Uses invertMatrix() as the source of truth.
 * For n ≤ 3, also reports det mod 26 (safe).
 */
export function validateMatrix(M) {
  const n = M.length;
  const inv = invertMatrix(M);
  const valid = inv !== null;

  // For UI: det is reliable for 2x2 and 3x3; for bigger it can overflow precision in JS
  if (n <= 3) {
    const det = mod26(determinant(M.map((row) => row.map(mod26))));
    const detInv = modularInverse(det);
    const message = valid
      ? `det mod 26 = ${det}  →  invertible ✓  (det⁻¹ = ${detInv})`
      : `det mod 26 = ${det}  →  NOT invertible ✗ — choose different values`;
    return { valid, det, message };
  }

  const message = valid
    ? `invertible ✓ (validated by Gauss-Jordan mod 26)`
    : `NOT invertible ✗ — choose different values`;
  return { valid, det: null, message };
}

export function buildMatrix(values, n) {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => Number(values[i * n + j]) || 0)
  );
}

export function hillEncrypt(plaintext, keyMatrix) {
  const n = keyMatrix.length;
  const { valid, message } = validateMatrix(keyMatrix);
  if (!valid) return { result: "", steps: [], error: message };

  let t = clean(plaintext);
  if (!t) return { result: "", steps: [], error: "Plaintext cannot be empty." };

  while (t.length % n !== 0) t += "X";

  let result = "";
  const steps = [];

  for (let i = 0; i < t.length; i += n) {
    const block = t.slice(i, i + n);
    const v = block.split("").map((c) => c.charCodeAt(0) - 65);
    const r = matVecMul(keyMatrix, v);
    const out = r.map((x) => String.fromCharCode(x + 65)).join("");
    result += out;
    steps.push(
      `[${block.split("").join(",")}]=[${v.join(",")}]  ×  M  =  [${r.join(",")}]  →  ${out}`
    );
  }

  return { result, steps, error: null };
}

export function hillDecrypt(ciphertext, keyMatrix) {
  const n = keyMatrix.length;
  const invMatrix = invertMatrix(keyMatrix);

  if (!invMatrix)
    return { result: "", steps: [], error: "Matrix is not invertible mod 26. Choose different key values." };

  let t = clean(ciphertext);
  if (!t) return { result: "", steps: [], error: "Ciphertext cannot be empty." };

  while (t.length % n !== 0) t += "X";

  let result = "";
  const steps = [];

  for (let i = 0; i < t.length; i += n) {
    const block = t.slice(i, i + n);
    const v = block.split("").map((c) => c.charCodeAt(0) - 65);
    const r = matVecMul(invMatrix, v);
    const out = r.map((x) => String.fromCharCode(x + 65)).join("");
    result += out;
    steps.push(
      `[${block.split("").join(",")}]=[${v.join(",")}]  ×  M⁻¹  =  [${r.join(",")}]  →  ${out}`
    );
  }

  return { result, steps, error: null };
}

export const DEFAULT_MATRIX_VALUES = {
  2: [3, 3, 2, 5],
  3: [6, 24, 1, 13, 16, 10, 20, 17, 15],
  4: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3],
  5: [2, 4, 5, 0, 1, 9, 2, 1, 0, 6, 3, 5, 8, 1, 11, 1, 0, 3, 21, 2, 4, 7, 2, 1, 6],
};