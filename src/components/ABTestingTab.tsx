import { useState, useMemo, useEffect } from "react";
import { useABTestStore } from "@/store/abTestStore";
import { joinKpis } from "@/lib/parseExcel";
import { getFilteredData, PERSONAS, CITIES } from "@/lib/segments";
import { fmtPct, fmtDelta, fmtNum } from "@/lib/format";
import { Trophy, BarChart3, TrendingUp, Users, Upload, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadScreen } from "./ABTestingUpload";
import { generateDemoABTestData } from "@/lib/demoData";
import * as XLSX from "xlsx";

const ChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 text-sm shadow-soft">
      {label && <p className="mb-1 font-semibold text-popover-foreground">{label}</p>}
      {payload.map((item) => (
        <p key={`${item.name}-${item.value}`} className="text-muted-foreground">
          <span className="font-medium text-foreground">{item.name}:</span> {item.value}
        </p>
      ))}
    </div>
  );
};

function WinnerPill({ w }: { w: string }) {
  const map: Record<string, string> = {
    B: "bg-primary/20 text-primary",
    A: "bg-secondary/20 text-secondary-foreground",
    Tie: "bg-muted text-muted-foreground",
    "B only": "bg-primary/20 text-primary",
  };
  const label = w === "B" ? "B wins" : w === "A" ? "A wins" : w === "Tie" ? "Tie" : "New metric";
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[w] || "bg-muted"}`}>{label}</span>;
}

function StatCard({
  label,
  value,
  subA,
  subB,
  icon,
}: {
  label: string;
  value: string;
  subA?: string;
  subB?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
        {icon && <div className="text-primary opacity-70">{icon}</div>}
      </div>
      <div className="text-2xl font-semibold text-foreground mt-2">{value}</div>
      {(subA || subB) && (
        <div className="mt-3 flex gap-4 text-xs">
          {subA && <span className="text-muted-foreground">A: <span className="text-foreground font-medium">{subA}</span></span>}
          {subB && <span className="text-muted-foreground">B: <span className="text-primary font-medium">{subB}</span></span>}
        </div>
      )}
    </div>
  );
}

function OverviewView() {
  const { dataA: rawA, dataB: rawB } = useABTestStore();
  const dataA = rawA;
  const dataB = rawB;

  if (!dataA || !dataB) return <UploadScreen />;

  const totalUsersA = dataA.userCount;
  const totalUsersB = dataB.userCount;
  const totalKPIs = dataA.kpis.length;
  const bWins = dataA.kpis.filter((kpi, i) => dataB.kpis[i] && dataB.kpis[i].rate > kpi.rate).length;
  const aWins = dataA.kpis.filter((kpi, i) => dataB.kpis[i] && dataB.kpis[i].rate <= kpi.rate).length;

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
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">B/A Ratio</span>
              <span className="text-sm font-medium text-foreground">{(totalUsersB / totalUsersA).toFixed(2)}x</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Funnel Overview</h3>
        <div className="space-y-3">
          {dataA.funnel.map((step, i) => {
            const stepB = dataB.funnel[i];
            const dropoffPct = step.users > 0 ? ((step.dropoff / step.users) * 100).toFixed(1) : "0";
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

function KPIView() {
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
                <td className="px-4 py-3 text-center"><WinnerPill w={j.winner} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FunnelView() {
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

function SegmentsView() {
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
              onChange={(e) => updateFilters({ group: e.target.value as any })}
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

function RawDataView() {
  const { dataA: rawA, dataB: rawB, filters } = useABTestStore();
  const filtered = useMemo(
    () => (rawA && rawB ? getFilteredData(rawA, rawB, filters) : null),
    [rawA, rawB, filters]
  );
  const dataA = filtered?.dataA;
  const dataB = filtered?.dataB;

  if (!dataA || !dataB) return <UploadScreen />;

  const allData = [
    ...dataA.rawData.slice(0, 10),
    ...dataB.rawData.slice(0, 10),
  ];

  const handleExportExcel = () => {
    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Prepare data with all columns
    const fullDataA = dataA.rawData.map(row => {
      const newRow: Record<string, any> = {};
      dataA.rawColumns.forEach(col => {
        newRow[col] = row[col] ?? "";
      });
      return newRow;
    });

    const fullDataB = dataB.rawData.map(row => {
      const newRow: Record<string, any> = {};
      dataB.rawColumns.forEach(col => {
        newRow[col] = row[col] ?? "";
      });
      return newRow;
    });

    // Create worksheets
    const wsA = XLSX.utils.json_to_sheet(fullDataA);
    const wsB = XLSX.utils.json_to_sheet(fullDataB);

    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(workbook, wsA, "Variant A");
    XLSX.utils.book_append_sheet(workbook, wsB, "Variant B");

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `AB_Test_Raw_Data_${timestamp}.xlsx`;

    // Write file
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Raw Data</h3>
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Download className="size-4" />
          Export to Excel
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              {dataA.rawColumns.slice(0, 6).map((col) => (
                <th key={col} className="px-3 py-2 text-left font-semibold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allData.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/30">
                {dataA.rawColumns.slice(0, 6).map((col) => (
                  <td key={col} className="px-3 py-2 text-muted-foreground">
                    {row[col] != null ? String(row[col]).slice(0, 20) : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HeatmapView() {
  const { dataA, dataB } = useABTestStore();
  const [selectedScreen, setSelectedScreen] = useState(0);

  // Sample heatmap images - reference from src folder
  const heatmapImages = [
    {
      screenName: "Routes & Discovery",
      variantA: "/src/images/heatmap_aoi_image-2026-05-05-102349351-png (2).jpg",
      variantB: "/src/images/heatmap_aoi_image-2026-05-05-102359184-png (2).jpg",
    }
  ];

  const currentScreen = heatmapImages[selectedScreen];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Heatmap Analysis</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">Select Screen:</label>
          <select 
            value={selectedScreen} 
            onChange={(e) => setSelectedScreen(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
          >
            {heatmapImages.map((img, idx) => (
              <option key={idx} value={idx}>{img.screenName}</option>
            ))}
          </select>
        </div>

        {currentScreen && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Variant A */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Variant A</h3>
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={currentScreen.variantA} 
                  alt={`${currentScreen.screenName} - Variant A`}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>

            {/* Variant B */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Variant B</h3>
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={currentScreen.variantB} 
                  alt={`${currentScreen.screenName} - Variant B`}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 rounded-lg bg-muted/20 border border-border">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Note:</strong> These heatmaps show click intensity and user interaction patterns across the two variants. Warmer colors (red/orange) indicate higher user engagement.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ABTestingTab({ activeSubTab = "kpi", onSubTabChange }: { activeSubTab?: string; onSubTabChange?: (tab: string) => void }) {
  const { dataA, dataB, setData } = useABTestStore();

  // Load demo data on first mount if no data exists
  useEffect(() => {
    if (!dataA || !dataB) {
      const { dataA: demoA, dataB: demoB } = generateDemoABTestData();
      setData(demoA, demoB);
    }
  }, [dataA, dataB, setData]);

  if (!dataA || !dataB) {
    return (
      <main className="min-h-screen px-6 py-6 text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full" />
          </div>
          <p className="mt-4 text-muted-foreground">Loading demo data...</p>
        </div>
      </main>
    );
  }

  const handleSubTabChange = (tab: string) => {
    onSubTabChange?.(tab);
  };

  return (
    <main className="min-h-screen px-6 py-6 text-foreground">
      <div className="animate-dashboard-in">
        <header className="relative mb-7 overflow-hidden rounded-[2rem] border border-border bg-(image:--gradient-hero) p-6 shadow-lifted lg:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-sm font-medium text-muted-foreground shadow-soft">
              <Trophy className="size-4 text-primary" /> A/B Testing Platform
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">A/B Testing Analytics</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Comparing TrailMate hiking app interfaces. Analyze performance across KPIs, funnels, and user segments.
            </p>
          </div>
        </header>

        <div className="mb-7">
          <Tabs value={activeSubTab} onValueChange={handleSubTabChange} className="w-full">
            <TabsList className="bg-card border border-border rounded-xl p-1">
              <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary/10">Overview</TabsTrigger>
              <TabsTrigger value="kpi" className="rounded-lg data-[state=active]:bg-primary/10">KPI Analysis</TabsTrigger>
              <TabsTrigger value="funnel" className="rounded-lg data-[state=active]:bg-primary/10">Funnel</TabsTrigger>
              <TabsTrigger value="segments" className="rounded-lg data-[state=active]:bg-primary/10">Segments</TabsTrigger>
              <TabsTrigger value="heatmap" className="rounded-lg data-[state=active]:bg-primary/10">Heatmaps</TabsTrigger>
              <TabsTrigger value="raw" className="rounded-lg data-[state=active]:bg-primary/10">Raw Data</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="overview">
                <OverviewView />
              </TabsContent>
              <TabsContent value="kpi">
                <KPIView />
              </TabsContent>
              <TabsContent value="funnel">
                <FunnelView />
              </TabsContent>
              <TabsContent value="segments">
                <SegmentsView />
              </TabsContent>
              <TabsContent value="heatmap">
                <HeatmapView />
              </TabsContent>
              <TabsContent value="raw">
                <RawDataView />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
