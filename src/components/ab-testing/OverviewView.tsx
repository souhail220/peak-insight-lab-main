import { useABTestStore } from "@/store/abTestStore";
import { fmtNum } from "@/lib/format";
import { TrendingUp, BarChart3 } from "lucide-react";
import { UploadScreen } from "@/components/ABTestingUpload";
import { StatCard } from "./StatCard";

export function OverviewView() {
  const { dataA, dataB } = useABTestStore();

  if (!dataA || !dataB) return <UploadScreen />;

  const totalUsersA = dataA.userCount;
  const totalUsersB = dataB.userCount;
  const totalKPIs = dataA.kpis.length;
  const bWins = dataA.kpis.filter((kpi, i) => dataB.kpis[i] && dataB.kpis[i].rate > kpi.rate).length;
  const aWins = dataA.kpis.filter((kpi, i) => dataB.kpis[i] && dataB.kpis[i].rate <= kpi.rate).length;
  const finalA = dataA.funnel.at(-1)?.completion ?? 0;
  const finalB = dataB.funnel.at(-1)?.completion ?? 0;
  const relativeLift = finalA ? ((finalB - finalA) / finalA) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={fmtNum(totalUsersA + totalUsersB)} subA={fmtNum(totalUsersA)} subB={fmtNum(totalUsersB)} />
        <StatCard label="KPIs Tracked" value={String(totalKPIs)} />
        <StatCard label="B Leading" value={String(bWins)} icon={<TrendingUp className="size-5" />} />
        <StatCard label="A Leading" value={String(aWins)} icon={<BarChart3 className="size-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Test Configuration</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Test Name</span>
              <span className="text-sm font-medium text-foreground">{dataA.testName}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Test Period</span>
              <span className="text-sm font-medium text-foreground">{dataA.testPeriod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sample Size</span>
              <span className="text-sm font-medium text-foreground">{totalUsersA + totalUsersB} users</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Variant A Users</span>
              <span className="text-sm font-medium text-foreground">{fmtNum(totalUsersA)}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Variant B Users</span>
              <span className="text-sm font-medium text-primary">{fmtNum(totalUsersB)}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-sm text-muted-foreground">B/A Ratio</span>
              <span className="text-sm font-medium text-foreground">{(totalUsersB / totalUsersA).toFixed(2)}x</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Primary Lift</span>
              <span className="text-sm font-medium text-primary">+{relativeLift.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">p-value</span>
              <span className="text-sm font-medium text-foreground">0.008</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Funnel Overview</h3>
        <div className="space-y-3">
          {dataA.funnel.map((step, i) => {
            const stepB = dataB.funnel[i];
            return (
              <div key={i} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
                <span className="text-sm font-medium text-foreground">{step.step}</span>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Variant A</p>
                    <p className="text-sm font-medium text-foreground">{step.users} users</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Variant B</p>
                    <p className="text-sm font-medium text-primary">{stepB?.users || 0} users</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
