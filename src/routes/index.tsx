import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AATestingTab } from "@/components/AATestingTab";
import { ABTestingTab } from "@/components/ABTestingTab";
import { BilanTab } from "@/components/BilanTab";
import { UserAnalyticsTab } from "@/components/UserAnalyticsTab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Analytics Dashboard - Peak Insight Lab" },
      {
        name: "description",
        content: "Comprehensive analytics platform with A/A Testing, A/B Testing, Reports, and User Analytics.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [activeTab, setActiveTab] = useState("aa-testing");
  const [activeABSubTab, setActiveABSubTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex w-full">
        {/* Sidebar Navigation */}
        <div className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-background/95 backdrop-blur-md flex flex-col p-6 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-foreground">Analytics Suite</h1>
            <p className="mt-1 text-xs text-muted-foreground">Peak Insight Lab</p>
          </div>

          <TabsList className="flex flex-col bg-transparent p-0 h-auto gap-2 space-y-0">
            <TabsTrigger
              value="aa-testing"
              className="justify-start rounded-xl border border-transparent px-4 py-3 text-sm font-semibold transition-all hover:bg-secondary/50 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-foreground"
            >
              <div className="mr-3 size-2 rounded-full bg-current opacity-0 data-[state=active]:opacity-100" />
              A/A Testing
            </TabsTrigger>

            {/* A/B Testing with nested items */}
            <div>
              <TabsTrigger
                value="ab-testing"
                className="w-full justify-start rounded-xl border border-transparent px-4 py-3 text-sm font-semibold transition-all hover:bg-secondary/50 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-foreground"
              >
                <div className="mr-3 size-2 rounded-full bg-current opacity-0 data-[state=active]:opacity-100" />
                A/B Testing
              </TabsTrigger>
              
              {/* Sub-items shown when A/B Testing is active */}
              {activeTab === "ab-testing" && (
                <div className="mt-2 ml-6 space-y-1 border-l border-border/50 pl-4">
                  <button
                    onClick={() => setActiveABSubTab("overview")}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      activeABSubTab === "overview"
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveABSubTab("kpi")}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      activeABSubTab === "kpi"
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`}
                  >
                    KPI Analysis
                  </button>
                  <button
                    onClick={() => setActiveABSubTab("funnel")}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      activeABSubTab === "funnel"
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`}
                  >
                    Funnel
                  </button>
                  <button
                    onClick={() => setActiveABSubTab("segments")}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      activeABSubTab === "segments"
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`}
                  >
                    Segments
                  </button>
                  <button
                    onClick={() => setActiveABSubTab("raw")}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      activeABSubTab === "raw"
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`}
                  >
                    Raw Data
                  </button>
                  <button
                    onClick={() => setActiveABSubTab("heatmap")}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      activeABSubTab === "heatmap"
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`}
                  >
                    Heatmaps
                  </button>
                </div>
              )}
            </div>

            <TabsTrigger
              value="bilan"
              className="justify-start rounded-xl border border-transparent px-4 py-3 text-sm font-semibold transition-all hover:bg-secondary/50 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-foreground"
            >
              <div className="mr-3 size-2 rounded-full bg-current opacity-0 data-[state=active]:opacity-100" />
              Bilan / Report
            </TabsTrigger>
            <TabsTrigger
              value="user-analytics"
              className="justify-start rounded-xl border border-transparent px-4 py-3 text-sm font-semibold transition-all hover:bg-secondary/50 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-foreground"
            >
              <div className="mr-3 size-2 rounded-full bg-current opacity-0 data-[state=active]:opacity-100" />
              User Analytics
            </TabsTrigger>
          </TabsList>

          <div className="mt-auto pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground">Dashboard v1.0</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 ml-64">
          <TabsContent value="aa-testing" className="m-0">
            <AATestingTab />
          </TabsContent>

          <TabsContent value="ab-testing" className="m-0">
            <ABTestingTab activeSubTab={activeABSubTab} onSubTabChange={setActiveABSubTab} />
          </TabsContent>

          <TabsContent value="bilan" className="m-0">
            <BilanTab />
          </TabsContent>

          <TabsContent value="user-analytics" className="m-0">
            <UserAnalyticsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
