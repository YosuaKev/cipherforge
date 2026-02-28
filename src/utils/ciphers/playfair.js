/**
 * PLAYFAIR CIPHER — Final Clean Version
 * 5x5 Matrix (J merged into I)
 */

/* ===============================
   MATRIX GENERATION
=================================*/
export function buildPlayfairMatrix(keyword) {
  const seen = new Set();

  const source = (keyword.toUpperCase() + "ABCDEFGHIKLMNOPQRSTUVWXYZ")
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");

  const matrix = [];

  for (const ch of source) {
    if (!seen.has(ch)) {
      seen.add(ch);
      matrix.push(ch);
    }
  }

  return matrix; // 25 letters
}

/* ===============================
   PREPARE PLAINTEXT
=================================*/
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

    if (!b) {
      result += a + "X";
      break;
    }

    if (a === b) {
      result += a + "X";
      i += 1;
    } else {
      result += a + b;
      i += 2;
    }
  }

  return result;
}

/* ===============================
   PREPARE CIPHERTEXT
=================================*/
function prepareCiphertext(text) {
  return (text || "")
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");
}

/* ===============================
   POSITION HELPER
=================================*/
function getPosition(matrix, ch) {
  const index = matrix.indexOf(ch);
  return [Math.floor(index / 5), index % 5];
}

/* ===============================
   DIGRAPH PROCESSOR
=================================*/
function processDigraph(matrix, a, b, encrypt = true) {
  const [ra, ca] = getPosition(matrix, a);
  const [rb, cb] = getPosition(matrix, b);

  if (ra === rb) {
    // Same row
    return [
      matrix[ra * 5 + (encrypt ? (ca + 1) % 5 : (ca + 4) % 5)],
      matrix[rb * 5 + (encrypt ? (cb + 1) % 5 : (cb + 4) % 5)]
    ];
  }

  if (ca === cb) {
    // Same column
    return [
      matrix[(encrypt ? (ra + 1) % 5 : (ra + 4) % 5) * 5 + ca],
      matrix[(encrypt ? (rb + 1) % 5 : (rb + 4) % 5) * 5 + cb]
    ];
  }

  // Rectangle rule
  return [
    matrix[ra * 5 + cb],
    matrix[rb * 5 + ca]
  ];
}

/* ===============================
   CLEANUP (REMOVE FILLER X)
=================================*/
function cleanupDecrypted(text) {
  let result = "";

  for (let i = 0; i < text.length; i++) {
    const prev = text[i - 1];
    const cur = text[i];
    const next = text[i + 1];

    // Remove X between same letters (G X G → G G)
    if (cur === "X" && prev && next && prev === next) continue;

    result += cur;
  }

  // Remove trailing X padding
  if (result.endsWith("X")) {
    result = result.slice(0, -1);
  }

  return result;
}

/* ===============================
   ENCRYPT
=================================*/
export function playfairEncrypt(plaintext, keyword) {
  if (!keyword || !keyword.trim()) {
    return { result: "", error: "Keyword is required." };
  }

  const matrix = buildPlayfairMatrix(keyword);
  const prepared = preparePlayfairPlaintext(plaintext);

  let result = "";

  for (let i = 0; i < prepared.length; i += 2) {
    const [ea, eb] = processDigraph(
      matrix,
      prepared[i],
      prepared[i + 1],
      true
    );
    result += ea + eb;
  }

  return { result, preparedText: prepared, error: null };
}

/* ===============================
   DECRYPT
=================================*/
export function playfairDecrypt(ciphertext, keyword) {
  if (!keyword || !keyword.trim()) {
    return { result: "", error: "Keyword is required." };
  }

  const matrix = buildPlayfairMatrix(keyword);
  const prepared = prepareCiphertext(ciphertext);

  if (prepared.length % 2 !== 0) {
    return { result: "", error: "Ciphertext length must be even." };
  }

  let result = "";

  for (let i = 0; i < prepared.length; i += 2) {
    const [da, db] = processDigraph(
      matrix,
      prepared[i],
      prepared[i + 1],
      false
    );
    result += da + db;
  }

  const cleaned = cleanupDecrypted(result);

  return {
    result: cleaned,          // hasil final bersih
    rawResult: result,        // hasil asli sebelum cleanup
    error: null
  };
}