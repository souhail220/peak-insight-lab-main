export const fmtPct = (n: number | null | undefined, digits = 1) =>
  n == null || isNaN(n) ? "—" : `${(n * 100).toFixed(digits)}%`;

export const fmtNum = (n: number | null | undefined, digits = 1) =>
  n == null || isNaN(n) ? "—" : Number.isInteger(n) ? String(n) : n.toFixed(digits);

export const fmtDelta = (d: number | null | undefined) => {
  if (d == null) return "—";
  const sign = d > 0 ? "+" : "";
  return `${sign}${(d * 100).toFixed(1)}pp`;
};
