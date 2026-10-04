// Azonosítók és tokenek: a Web Crypto API Node 20+ alatt és böngészőben is elérhető.
export function randomHex(bytes) {
  const a = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, '0')).join('');
}

export const newId = (prefix) => `${prefix}_${randomHex(6)}`;
