import * as XLSX from "xlsx";

export type KpiRow = {
  kpi: string;
  rate: number | null;
  raw: number | null;
  target: string | null;
  vsA?: string | null;
};

export type FunnelStep = {
  step: string;
  users: number;
  dropoff: number;
  completion: number;
};

export type RawUserRow = Record<string, string | number | null>;

export type HeatmapClick = {
  x: number;
  y: number;
  count: number;
};

export type HeatmapScreen = {
  screenName: string;
  screenWidth: number;
  screenHeight: number;
  clicks: HeatmapClick[];
  avgTimeSpent: number;
  userCount: number;
  variant: string;
};

export type InterfaceData = {
  fileName: string;
  title: string;
  testName: string;
  testPeriod: string;
  userCount: number;
  kpis: KpiRow[];
  funnel: FunnelStep[];
  rawColumns: string[];
  rawData: RawUserRow[];
  heatmaps?: HeatmapScreen[];
};

function readSheetAOA(wb: XLSX.WorkBook, name: string): any[][] {
  const sheet = wb.Sheets[name];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null }) as any[][];
}

function findSheet(wb: XLSX.WorkBook, fragment: string): string | undefined {
  return wb.SheetNames.find((n) => n.toLowerCase().includes(fragment.toLowerCase()));
}

function parseTitle(title: string) {
  const parts = title.split("|").map((p) => p.trim());
  const usersMatch = title.match(/(\d+)\s*Users?/i);
  const userCount = usersMatch ? parseInt(usersMatch[1]) : 0;
  const periodMatch = parts.find((p) => /\d{4}/.test(p) && !/users?/i.test(p));
  const testPeriod = periodMatch?.replace(/^Test Period:\s*/i, "") ?? "";
  const testName = parts[0]?.split("—")[1]?.trim() ?? parts[0] ?? "";
  return { userCount, testPeriod, testName };
}

export async function parseInterfaceFile(file: File): Promise<InterfaceData> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });

  const rawSheetName = findSheet(wb, "raw") ?? wb.SheetNames[0];
  const kpiSheetName = findSheet(wb, "kpi summary") ?? findSheet(wb, "summary") ?? wb.SheetNames[1];
  const funnelSheetName = findSheet(wb, "funnel") ?? wb.SheetNames[2];

  const rawAOA = readSheetAOA(wb, rawSheetName);
  const title = (rawAOA[0]?.[0] as string) ?? "";
  const meta = parseTitle(title);
  let headerIdx = rawAOA.findIndex((r) => r?.some((c) => typeof c === "string" && /user id/i.test(c)));
  if (headerIdx < 0) headerIdx = 2;
  const headers = (rawAOA[headerIdx] || []).map((h, i) => (h ? String(h) : `col${i}`));
  const rawData: RawUserRow[] = [];
  for (let i = headerIdx + 1; i < rawAOA.length; i++) {
    const row = rawAOA[i];
    if (!row || row.every((v) => v == null || v === "")) continue;
    const obj: RawUserRow = {};
    headers.forEach((h, j) => (obj[h] = row[j] ?? null));
    rawData.push(obj);
  }

  const kpiAOA = readSheetAOA(wb, kpiSheetName);
  let khIdx = kpiAOA.findIndex((r) => r?.some((c) => typeof c === "string" && /^kpi$/i.test(String(c).trim())));
  if (khIdx < 0) khIdx = 1;
  const khHeaders = (kpiAOA[khIdx] || []).map((c) => (c ? String(c) : ""));
  const colIdx = (frag: string) =>
    khHeaders.findIndex((h) => h.toLowerCase().includes(frag.toLowerCase()));
  const iKpi = colIdx("kpi");
  const iRaw = colIdx("raw");
  const iRate = colIdx("rate");
  const iTarget = colIdx("target");
  const iVs = khHeaders.findIndex((h) => /vs\s*interface/i.test(h));

  const kpis: KpiRow[] = [];
  for (let i = khIdx + 1; i < kpiAOA.length; i++) {
    const r = kpiAOA[i];
    if (!r || r[iKpi] == null) continue;
    kpis.push({
      kpi: String(r[iKpi]).trim(),
      raw: typeof r[iRaw] === "number" ? r[iRaw] : null,
      rate: typeof r[iRate] === "number" ? r[iRate] : null,
      target: r[iTarget] != null ? String(r[iTarget]) : null,
      vsA: iVs >= 0 && r[iVs] != null ? String(r[iVs]) : null,
    });
  }

  const funAOA = readSheetAOA(wb, funnelSheetName);
  let fhIdx = funAOA.findIndex((r) => r?.some((c) => typeof c === "string" && /funnel step/i.test(c)));
  if (fhIdx < 0) fhIdx = 1;
  const funnel: FunnelStep[] = [];
  for (let i = fhIdx + 1; i < funAOA.length; i++) {
    const r = funAOA[i];
    if (!r || r[0] == null) continue;
    funnel.push({
      step: String(r[0]),
      users: Number(r[1]) || 0,
      dropoff: Number(r[2]) || 0,
      completion: Number(r[3]) || 0,
    });
  }

  return {
    fileName: file.name,
    title,
    testName: meta.testName,
    testPeriod: meta.testPeriod,
    userCount: meta.userCount || rawData.length,
    kpis,
    funnel,
    rawColumns: headers.filter((h) => !/^col\d+$/.test(h)),
    rawData,
  };
}

export function normalizeKpiName(name: string): string {
  return name
    .toLowerCase()
    .replace(/["""]/g, "")
    .replace(/\s*\(s\)\s*/g, "")
    .replace(/screen|rate/g, (m) => m)
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export type JoinedKpi = {
  name: string;
  rateA: number | null;
  rateB: number | null;
  diff: number | null;
  winner: "A" | "B" | "Tie" | "B only";
  isNew: boolean;
};

export function joinKpis(a: InterfaceData, b: InterfaceData): JoinedKpi[] {
  const aMap = new Map<string, KpiRow>();
  a.kpis.forEach((k) => aMap.set(normalizeKpiName(k.kpi), k));
  const usedA = new Set<string>();
  const result: JoinedKpi[] = [];

  for (const k of b.kpis) {
    const key = normalizeKpiName(k.kpi);
    const aMatch = aMap.get(key);
    const isNew = !aMatch || /new kpi/i.test(k.vsA || "");
    if (aMatch) usedA.add(key);
    const rateA = aMatch?.rate ?? null;
    const rateB = k.rate ?? null;
    const diff = rateA != null && rateB != null ? rateB - rateA : null;
    let winner: JoinedKpi["winner"] = "Tie";
    if (isNew) winner = "B only";
    else if (diff != null) {
      if (Math.abs(diff) < 0.02) winner = "Tie";
      else if (diff > 0) winner = "B";
      else winner = "A";
    }
    result.push({ name: k.kpi, rateA, rateB, diff, winner, isNew });
  }
  for (const k of a.kpis) {
    const key = normalizeKpiName(k.kpi);
    if (usedA.has(key)) continue;
    result.push({
      name: k.kpi,
      rateA: k.rate,
      rateB: null,
      diff: null,
      winner: "A",
      isNew: false,
    });
  }
  return result;
}
