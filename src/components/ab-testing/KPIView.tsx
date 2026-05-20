import { useMemo } from "react";
import { useABTestStore } from "@/store/abTestStore";
import { joinKpis } from "@/lib/parseExcel";
import { getFilteredData } from "@/lib/segments";
import { fmtPct, fmtDelta } from "@/lib/format";
import { UploadScreen } from "@/components/ABTestingUpload";
import { StatCard } from "./StatCard";
import { WinnerPill } from "./WinnerPill";

export function KPIView() {
  const { dataA: rawA, dataB: rawB, filters } = useABTestStore();
  const filtered = useMemo(
    () => (rawA && rawB ? getFilteredData(rawA, rawB, filters) : null),
    [rawA, rawB, filters]
  );
  const dataA = filtered?.dataA;
  const dataB = filtered?.dataB;
  const joined = useMemo(() => (dataA && dataB ? joinKpis(dataA, dataB) : []), [dataA, dataB]);

  if (!dataA || !dataB) return <UploadScreen />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="KPIs Analyzed" value={String(joined.length)} />
        <StatCard label="B Wins" value={String(joined.filter((j) => j.winner === "B").length)} />
        <StatCard label="A Wins" value={String(joined.filter((j) => j.winner === "A").length)} />
        <StatCard label="Ties" value={String(joined.filter((j) => j.winner === "Tie").length)} />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">KPI</th>
              <th className="px-4 py-3 text-right font-semibold">A Rate</th>
              <th className="px-4 py-3 text-right font-semibold">B Rate</th>
              <th className="px-4 py-3 text-right font-semibold">Difference</th>
              <th className="px-4 py-3 text-center font-semibold">Winner</th>
            </tr>
          </thead>
          <tbody>
            {joined.map((j, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/30">
                <td className="px-4 py-3 font-medium text-foreground">{j.name}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">{fmtPct(j.rateA)}</td>
                <td className="px-4 py-3 text-right text-primary font-medium">{fmtPct(j.rateB)}</td>
                <td className="px-4 py-3 text-right text-foreground font-semibold">{fmtDelta(j.diff)}</td>
                <td className="px-4 py-3 text-center">
                  <WinnerPill w={j.winner} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
