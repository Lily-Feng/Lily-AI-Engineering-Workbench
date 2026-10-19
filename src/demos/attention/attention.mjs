export const tokens = ['The', 'cat', 'sat', 'on', 'the', 'mat'];
export const keys = [[1, 0], [0, 1], [1, 1], [-1, 1], [0.5, -0.5], [1, -1]];
export const values = [[1, 0], [0, 2], [1, 1], [-1, 0], [0, -1], [2, 1]];

export function canAttend(mode, query, key, prefixLength = 3) {
  if (mode === 'bidirectional') return true;
  if (mode === 'prefix' && query < prefixLength) return key < prefixLength;
  return key <= query;
}

export function attentionRow(mode, queryIndex, queryX) {
  const scores = keys.map(([x, y], key) => canAttend(mode, queryIndex, key) ? (queryX * x + y) / Math.sqrt(2) : -Infinity);
  const max = Math.max(...scores);
  const exps = scores.map((score) => Math.exp(score - max));
  const sum = exps.reduce((total, value) => total + value, 0);
  const weights = exps.map((value) => value / sum);
  const output = [0, 1].map((dimension) => weights.reduce((total, weight, index) => total + weight * values[index][dimension], 0));
  return { scores, weights, output };
}

export function kvCacheBytes(batch, sequence, kvHeads, layers = 32, headDim = 128, bytesPerElement = 2) {
  return 2 * batch * sequence * layers * kvHeads * headDim * bytesPerElement;
}
