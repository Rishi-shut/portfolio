export const MOODS = [
  { name: "Solaris", stops: [[0.10, 0.06, 0.19], [1.00, 0.47, 0.28], [1.00, 0.82, 0.40], [0.85, 0.31, 0.62]], tint: [1.00, 0.72, 0.45], veil: 0.36 },
  { name: "Abyss",   stops: [[0.02, 0.06, 0.11], [0.05, 0.28, 0.29], [0.10, 0.70, 0.65], [0.75, 0.93, 0.95]], tint: [0.45, 0.95, 1.00], veil: 0.34 },
  { name: "Reef",    stops: [[0.03, 0.10, 0.07], [0.06, 0.56, 0.44], [0.38, 0.88, 0.78], [0.91, 0.31, 0.82]], tint: [0.60, 1.00, 0.55], veil: 0.36 },
  { name: "Ember",   stops: [[0.09, 0.04, 0.03], [0.48, 0.12, 0.06], [0.95, 0.42, 0.11], [1.00, 0.79, 0.30]], tint: [1.00, 0.50, 0.28], veil: 0.34 },
  { name: "Orchid",  stops: [[0.08, 0.04, 0.14], [0.36, 0.16, 0.53], [0.78, 0.42, 0.85], [1.00, 0.83, 0.94]], tint: [0.88, 0.66, 1.00], veil: 0.38 },
  { name: "Ghost",   stops: [[0.04, 0.05, 0.06], [0.24, 0.26, 0.30], [0.60, 0.64, 0.68], [0.93, 0.95, 0.96]], tint: [0.92, 0.94, 1.00], veil: 0.52 },
];

export const MOOD_MS = 900;
export const DEFAULT_MOOD = 5;

export function blendCoeffs(engine) {
  const k = blendK(engine);
  const from = engine.from ?? MOODS[engine.to];
  const to = MOODS[engine.to];
  const mixN = (a, b) => a.map((v, j) => v + (b[j] - v) * k);
  return {
    stops: [0, 1, 2, 3].map((i) => mixN(from.stops[i], to.stops[i])),
    tint: mixN(from.tint, to.tint),
    veil: from.veil + (to.veil - from.veil) * k,
  };
}

function blendK(engine) {
  if (!engine.from) return 1;
  const e = (performance.now() - engine.t0) / MOOD_MS;
  if (e >= 1) {
    engine.from = null;
    return 1;
  }
  return e < 0.5 ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2;
}

export const gradAt = (m, x) => {
  const s = m.stops;
  const t = Math.min(Math.max(x, 0), 1) * 3;
  const i = Math.min(Math.floor(t), 2);
  const kk = t - i;
  return s[i].map((v, j) => v + (s[i + 1][j] - v) * kk);
};

export const hex = (rgb) =>
  "#" +
  rgb
    .map((v) => Math.round(Math.min(Math.max(v, 0), 1) * 255).toString(16).padStart(2, "0"))
    .join("");
