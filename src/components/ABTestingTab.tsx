import { useEffect } from "react";
import { useABTestStore } from "@/store/abTestStore";
import { generateDemoABTestData } from "@/lib/demoData";
import { Lightbulb, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewView } from "@/components/ab-testing/OverviewView";
import { KPIView } from "@/components/ab-testing/KPIView";
import { FunnelView } from "@/components/ab-testing/FunnelView";
import { SegmentsView } from "@/components/ab-testing/SegmentsView";
import { HeatmapView } from "@/components/ab-testing/HeatmapView";
import { RawDataView } from "@/components/ab-testing/RawDataView";

export function ABTestingTab({
  activeSubTab = "kpi",
  onSubTabChange,
}: {
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}) {
  const { dataA, dataB, setData } = useABTestStore();

  useEffect(() => {
    if (!dataA || !dataB || dataA.userCount !== 490 || dataB.userCount !== 490) {
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
              <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary/10">
                Overview
              </TabsTrigger>
              <TabsTrigger value="kpi" className="rounded-lg data-[state=active]:bg-primary/10">
                KPI Analysis
              </TabsTrigger>
              <TabsTrigger value="funnel" className="rounded-lg data-[state=active]:bg-primary/10">
                Funnel
              </TabsTrigger>
              <TabsTrigger value="segments" className="rounded-lg data-[state=active]:bg-primary/10">
                Segments
              </TabsTrigger>
              <TabsTrigger value="heatmap" className="rounded-lg data-[state=active]:bg-primary/10">
                Heatmaps
              </TabsTrigger>
              <TabsTrigger value="raw" className="rounded-lg data-[state=active]:bg-primary/10">
                Raw Data
              </TabsTrigger>
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

        <section className="mt-7">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Lightbulb className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Research hypothesis</p>
                <h2 className="text-xl font-semibold text-foreground">
                  Visual hierarchy prioritizes imagery over action
                </h2>
              </div>
            </div>
            <div className="space-y-4 text-sm leading-7 text-muted-foreground">
              <p>
                Users don't act on CTAs because the visual hierarchy prioritizes imagery over action. Bringing CTAs higher,
                making them contrast more, and adding micro-copy explaining features will increase conversion.
              </p>
              <p>We also have wasted engagement on the map.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
