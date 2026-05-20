import { useMemo } from "react";
import { useABTestStore } from "@/store/abTestStore";
import { getFilteredData } from "@/lib/segments";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { UploadScreen } from "@/components/ABTestingUpload";
import { ChartTooltip } from "./ChartTooltip";

export function FunnelView() {
  const { dataA: rawA, dataB: rawB, filters } = useABTestStore();
  const filtered = useMemo(
    () => (rawA && rawB ? getFilteredData(rawA, rawB, filters) : null),
    [rawA, rawB, filters]
  );
  const dataA = filtered?.dataA;
  const dataB = filtered?.dataB;

  if (!dataA || !dataB) return <UploadScreen />;

  const funnelData = dataA.funnel.map((f, i) => ({
    step: f.step,
    "A Users": f.users,
    "B Users": dataB.funnel[i]?.users || 0,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Funnel Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="step" stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend />
              <Bar dataKey="A Users" fill="var(--color-secondary)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="B Users" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h4 className="font-semibold text-foreground mb-4">Variant A Funnel</h4>
          <div className="space-y-2">
            {dataA.funnel.map((f, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{f.step}</span>
                <span className="font-medium text-foreground">{f.users} users</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h4 className="font-semibold text-foreground mb-4">Variant B Funnel</h4>
          <div className="space-y-2">
            {dataB.funnel.map((f, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{f.step}</span>
                <span className="font-medium text-primary">{f.users} users</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
