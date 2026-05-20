import { useMemo } from "react";
import { useABTestStore } from "@/store/abTestStore";
import { getFilteredData, PERSONAS, CITIES } from "@/lib/segments";
import { fmtNum } from "@/lib/format";
import { UploadScreen } from "@/components/ABTestingUpload";
import { StatCard } from "./StatCard";

export function SegmentsView() {
  const { dataA: rawA, dataB: rawB, filters, updateFilters } = useABTestStore();
  const filtered = useMemo(
    () => (rawA && rawB ? getFilteredData(rawA, rawB, filters) : null),
    [rawA, rawB, filters]
  );
  const dataA = filtered?.dataA;
  const dataB = filtered?.dataB;

  if (!dataA || !dataB) return <UploadScreen />;

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Filter Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Variant</label>
            <select
              value={filters.group}
              onChange={(e) => updateFilters({ group: e.target.value as "all" | "A" | "B" })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option value="all">All</option>
              <option value="A">Variant A Only</option>
              <option value="B">Variant B Only</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Persona</label>
            <select
              value={filters.persona}
              onChange={(e) => updateFilters({ persona: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option value="all">All</option>
              {PERSONAS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">City</label>
            <select
              value={filters.city}
              onChange={(e) => updateFilters({ city: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option value="all">All</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard label="Variant A Users" value={fmtNum(dataA.userCount)} />
        <StatCard label="Variant B Users" value={fmtNum(dataB.userCount)} />
      </div>
    </div>
  );
}
