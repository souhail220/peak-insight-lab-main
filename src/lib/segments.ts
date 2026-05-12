import type { InterfaceData, RawUserRow, FunnelStep, KpiRow } from "@/lib/parseExcel";
import type { Filters } from "@/store/abTestStore";

export const PERSONAS = [
  "Weekend Hiker",
  "Trail Runner",
  "Family Explorer",
  "Backpacker",
  "Casual Walker",
] as const;

export const CITIES = ["Tunis", "Sousse", "Sfax", "Bizerte", "Tabarka"] as const;

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function personaFor(userId: string): string {
  return PERSONAS[hash(userId + "p") % PERSONAS.length];
}

export function cityFor(userId: string): string {
  return CITIES[hash(userId + "c") % CITIES.length];
}

export function decorateRows(rows: RawUserRow[], iface: "A" | "B"): RawUserRow[] {
  return rows.map((r) => {
    const id = String(r["User ID"] ?? "");
    return { ...r, Interface: iface, Persona: personaFor(id), City: cityFor(id) };
  });
}

export function filterRows(rows: RawUserRow[], f: Filters): RawUserRow[] {
  return rows.filter((r) => {
    if (f.group !== "all" && r["Interface"] !== f.group) return false;
    if (f.persona !== "all" && r["Persona"] !== f.persona) return false;
    if (f.city !== "all" && r["City"] !== f.city) return false;
    return true;
  });
}

function yesNoRate(rows: RawUserRow[], col: string): { rate: number | null; raw: number; total: number } {
  let yes = 0, total = 0;
  for (const r of rows) {
    const v = String(r[col] ?? "").trim().toLowerCase();
    if (v === "yes" || v === "no") { total++; if (v === "yes") yes++; }
  }
  return { rate: total ? yes / total : null, raw: yes, total };
}

function avg(rows: RawUserRow[], col: string): number | null {
  const nums = rows.map((r) => Number(r[col])).filter((n) => !isNaN(n));
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function recomputeKpis(orig: KpiRow[], rows: RawUserRow[], cols: string[]): KpiRow[] {
  const findCol = (frags: string[]) =>
    cols.find((c) => frags.every((f) => c.toLowerCase().includes(f.toLowerCase())));

  return orig.map((k) => {
    const name = k.kpi.toLowerCase();
    let col: string | undefined;
    let kind: "yesno" | "avg" | null = null;
    if (/filter chip|filter used/.test(name)) { col = findCol(["filter"]); kind = "yesno"; }
    else if (/ai banner|ai companion/.test(name)) {
      col = findCol(name.includes("companion") ? ["ai companion"] : ["ai banner"]);
      kind = "yesno";
    }
    else if (/saved trail|save rate/.test(name)) { col = findCol(["saved trail"]); kind = "yesno"; }
    else if (/start hike/.test(name)) { col = findCol(["start hike"]); kind = "yesno"; }
    else if (/trip planning success|trip planned/.test(name)) { col = findCol(["trip planned"]); kind = "yesno"; }
    else if (/plan trip/.test(name)) { col = findCol(["plan trip"]); kind = "yesno"; }
    else if (/reserve now/.test(name)) { col = findCol(["reserve"]); kind = "yesno"; }
    else if (/route removed/.test(name)) { col = findCol(["route removed"]); kind = "yesno"; }
    else if (/guide profile/.test(name)) { col = findCol(["guide profile"]); kind = "yesno"; }
    else if (/avg.*detail|time on detail/.test(name)) { col = findCol(["time on detail"]); kind = "avg"; }
    else if (/session duration/.test(name)) { col = findCol(["session duration"]); kind = "avg"; }
    else if (/screens visited/.test(name)) { col = findCol(["screens visited"]); kind = "avg"; }
    else if (/detail views/.test(name)) { col = findCol(["detail views"]); kind = "avg"; }
    else if (/routes tab/.test(name)) { col = findCol(["routes tab"]); kind = "avg"; }

    if (!col || !kind) return k;
    if (kind === "yesno") {
      const r = yesNoRate(rows, col);
      return { ...k, rate: r.rate, raw: r.raw };
    }
    const a = avg(rows, col);
    return { ...k, rate: a, raw: a };
  });
}

export function scaleFunnel(funnel: FunnelStep[], originalUsers: number, filteredUsers: number): FunnelStep[] {
  if (!originalUsers || originalUsers === filteredUsers) return funnel;
  const ratio = filteredUsers / originalUsers;
  return funnel.map((f) => ({
    ...f,
    users: Math.round(f.users * ratio),
    dropoff: Math.round(f.dropoff * ratio),
  }));
}

export function getFilteredData(
  dataA: InterfaceData,
  dataB: InterfaceData,
  filters: Filters
): { dataA: InterfaceData; dataB: InterfaceData } {
  const decoratedA = { ...dataA, rawData: decorateRows(dataA.rawData, "A") };
  const decoratedB = { ...dataB, rawData: decorateRows(dataB.rawData, "B") };
  const subF = { ...filters, group: "all" as const };
  const fA = filters.group === "B" ? [] : filterRows(decoratedA.rawData, subF);
  const fB = filters.group === "A" ? [] : filterRows(decoratedB.rawData, subF);
  return {
    dataA: {
      ...decoratedA,
      userCount: fA.length,
      kpis: recomputeKpis(dataA.kpis, fA, dataA.rawColumns),
      funnel: scaleFunnel(dataA.funnel, dataA.userCount, fA.length),
      rawColumns: Array.from(new Set([...dataA.rawColumns, "Persona", "City", "Interface"])),
      rawData: fA,
    },
    dataB: {
      ...decoratedB,
      userCount: fB.length,
      kpis: recomputeKpis(dataB.kpis, fB, dataB.rawColumns),
      funnel: scaleFunnel(dataB.funnel, dataB.userCount, fB.length),
      rawColumns: Array.from(new Set([...dataB.rawColumns, "Persona", "City", "Interface"])),
      rawData: fB,
    },
  };
}
