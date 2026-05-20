import { useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, Download, Eye, Users, BarChart3, TrendingDown, Clock, Zap } from "lucide-react";
import { generateReportSummary } from "../lib/analytics-data";

const chartColors = ["var(--color-primary)", "var(--color-accent)", "var(--color-warning)", "var(--color-info)", "var(--color-positive)"];
const axisColor = "var(--color-muted-foreground)";
const gridColor = "var(--color-border)";

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
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
}

function SectionTitle({ icon: Icon, eyebrow, title }: { icon: typeof BarChart3; eyebrow: string; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
    </div>
  );
}

function ChartCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`dashboard-card lift-on-hover rounded-3xl p-5 ${className}`}>{children}</section>;
}

function StatCard({ label, value, unit, icon: Icon, color = "primary" }: { label: string; value: number | string; unit?: string; icon: typeof Users; color?: string }) {
  const colorClass = {
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
    positive: "bg-positive text-white",
    warning: "bg-warning text-black",
    info: "bg-info text-white",
  }[color];

  return (
    <article className="dashboard-card lift-on-hover rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className={`flex size-11 items-center justify-center rounded-2xl ${colorClass}`}>
          <Icon className="size-5" />
        </div>
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-foreground">
        {typeof value === "number" ? value.toLocaleString() : value}
        {unit && <span className="ml-1 text-base text-muted-foreground">{unit}</span>}
      </p>
    </article>
  );
}

export function BilanTab() {
  const report = useMemo(() => generateReportSummary(), []);

  // Generate daily chart data
  const dailySessions = [72, 88, 134, 142, 70, 64, 76, 84, 91, 148, 156, 73, 69, 82, 86, 94, 152, 164, 78, 71, 85, 92, 98, 158, 172, 80, 74, 88, 96, 110];
  const dailyActivations = [56, 67, 106, 112, 52, 47, 58, 64, 69, 118, 126, 54, 51, 62, 66, 72, 123, 133, 58, 52, 65, 70, 75, 128, 140, 60, 55, 67, 73, 84];
  const dailyBounce = [19, 18, 17, 16, 21, 22, 20, 19, 18, 17, 16, 21, 22, 19, 18, 18, 16, 15, 20, 21, 19, 18, 18, 16, 15, 20, 21, 19, 18, 17];
  const dailyData = dailySessions.map((sessions, i) => ({
    date: new Date(2026, 0, i + 1).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    sessions,
    conversions: dailyActivations[i],
    bounceRate: dailyBounce[i],
  }));

  const weeklyData = [
    { week: "Week 1", sessions: 697, conversions: 540, bounceRate: 19.4 },
    { week: "Week 2", sessions: 742, conversions: 574, bounceRate: 18.9 },
    { week: "Week 3", sessions: 766, conversions: 596, bounceRate: 18.2 },
    { week: "Week 4", sessions: 842, conversions: 653, bounceRate: 17.6 },
  ];

  const monthlyData = [
    { month: "Nov", sessions: 2280, conversions: 1694, bounceRate: 21.4 },
    { month: "Dec", sessions: 2610, conversions: 1989, bounceRate: 19.8 },
    { month: "Jan", sessions: 3047, conversions: 2363, bounceRate: 18.6 },
  ];

  const deviceBreakdown = [
    { name: "iOS", value: 58, conversions: 1371 },
    { name: "Android", value: 42, conversions: 992 },
  ];

  const visitorTypeBreakdown = [
    { name: "New Users", value: 40, users: 392 },
    { name: "Returning", value: 60, users: 588 },
  ];

  return (
    <main className="min-h-screen px-6 py-6 text-foreground">
      <div className="animate-dashboard-in">
        {/* Header */}
        <header className="relative mb-7 overflow-hidden rounded-[2rem] border border-border bg-[image:var(--gradient-hero)] p-6 shadow-lifted lg:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-sm font-medium text-muted-foreground shadow-soft">
              <Calendar className="size-4 text-primary" /> {report.dateRange}
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-6xl">Performance Report</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Comprehensive mobile app analytics overview for {report.dateRange}. Session activity, feature activations, user behavior, and engagement metrics across iOS and Android.
            </p>
            <div className="mt-6 flex gap-3">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                <Download className="size-4" /> Export Report
              </button>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card/75 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/50">
                <Calendar className="size-4" /> Date Range
              </button>
            </div>
          </div>
        </header>

        {/* Key Metrics */}
        <section className="mb-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Users} label="Total Sessions" value={report.totalSessions} color="primary" />
          <StatCard icon={Zap} label="Feature Activations" value={report.totalConversions} color="accent" />
          <StatCard icon={Eye} label="Engagement Rate" value={report.conversionRate.toFixed(2)} unit="%" color="positive" />
          <StatCard icon={Clock} label="Avg Duration" value={report.avgSessionDuration} unit="s" color="info" />
        </section>

        {/* Secondary Metrics */}
        <section className="mb-7 grid gap-4 md:grid-cols-3">
          <ChartCard>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
              <p className="mt-2 text-4xl font-semibold text-foreground">{report.bounceRate}%</p>
              <p className="mt-2 text-xs text-muted-foreground">↓ 2.1% from last month</p>
            </div>
          </ChartCard>
          <ChartCard>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Screens/Session</p>
              <p className="mt-2 text-4xl font-semibold text-foreground">{report.avgPagesPerSession}</p>
              <p className="mt-2 text-xs text-muted-foreground">↑ 0.3 from last month</p>
            </div>
          </ChartCard>
          <ChartCard>
            <div>
              <p className="text-sm font-medium text-muted-foreground">New Users</p>
              <p className="mt-2 text-4xl font-semibold text-foreground">{report.newVisitors.toLocaleString()}</p>
              <p className="mt-2 text-xs text-muted-foreground">{report.newVisitors > report.returningVisitors ? "↑ More new traffic" : "↓ Returning strong"}</p>
            </div>
          </ChartCard>
        </section>

        {/* Daily & Weekly Trends */}
        <section className="mb-7 grid gap-5 xl:grid-cols-2">
          <ChartCard>
            <SectionTitle icon={BarChart3} eyebrow="Daily Metrics" title="Sessions & feature activations" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={dailyData} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="date" stroke={axisColor} tickLine={false} axisLine={false} style={{ fontSize: "12px" }} interval={4} />
                  <YAxis yAxisId="left" stroke={axisColor} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke={axisColor} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sessions" name="Sessions" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                  <Line yAxisId="right" dataKey="conversions" name="Feature Activations" stroke="var(--color-accent)" strokeWidth={3} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard>
            <SectionTitle icon={TrendingDown} eyebrow="Weekly Performance" title="Performance by week" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={weeklyData} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="week" stroke={axisColor} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke={axisColor} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke={axisColor} tickLine={false} axisLine={false} domain={[25, 35]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sessions" name="Sessions" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                  <Line yAxisId="right" dataKey="bounceRate" name="Bounce Rate %" stroke="var(--color-warning)" strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        {/* Top Features & Drop-off */}
        <section className="mb-7 grid gap-5 xl:grid-cols-2">
          <ChartCard>
            <SectionTitle icon={Eye} eyebrow="Features" title="Top feature activations" />
            <div className="space-y-3">
              {report.topPages.map((page, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card/50 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{page.page}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{page.views.toLocaleString()} opens</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-positive">{page.conversionRate.toFixed(2)}%</p>
                      <p className="text-xs text-muted-foreground">{page.conversions} activations</p>
                    </div>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${page.conversionRate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard>
            <SectionTitle icon={TrendingDown} eyebrow="Drop-off Points" title="Where users pause setup" />
            <div className="space-y-3">
              {report.dropOffPoints.map((point, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card/50 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{point.page}</p>
                    <p className="font-semibold text-warning">{point.dropOffRate.toFixed(1)}%</p>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-gradient-to-r from-warning to-accent" style={{ width: `${point.dropOffRate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </section>

        {/* Top Screens */}
        <section className="mb-7">
          <ChartCard>
            <SectionTitle icon={BarChart3} eyebrow="Screen Analytics" title="Top performing screens" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={report.topScreens}
                  margin={{ left: 0, right: 12, top: 8, bottom: 0 }}
                >
                  <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="screen" stroke={axisColor} tickLine={false} axisLine={false} style={{ fontSize: "12px" }} />
                  <YAxis yAxisId="left" stroke={axisColor} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke={axisColor} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="interactions" name="Interactions" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                  <Line yAxisId="right" dataKey="avgTime" name="Avg Time (s)" stroke="var(--color-accent)" strokeWidth={3} dot={{ r: 4 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        {/* Device & Visitor Breakdown */}
        <section className="mb-7 grid gap-5 xl:grid-cols-2">
          <ChartCard>
            <SectionTitle icon={Users} eyebrow="Device Breakdown" title="Sessions by device" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deviceBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                    {deviceBreakdown.map((entry, index) => (
                      <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard>
            <SectionTitle icon={Users} eyebrow="User Type" title="New vs returning users" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={visitorTypeBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                    {visitorTypeBreakdown.map((entry, index) => (
                      <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        {/* Monthly Trend */}
        <section className="mb-7">
          <ChartCard>
            <SectionTitle icon={BarChart3} eyebrow="Monthly Trend" title="Performance over three months" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="month" stroke={axisColor} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke={axisColor} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke={axisColor} tickLine={false} axisLine={false} domain={[25, 40]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sessions" name="Sessions" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                  <Line yAxisId="right" dataKey="bounceRate" name="Bounce Rate %" stroke="var(--color-warning)" strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        {/* Report Summary */}
        <section className="mb-7">
          <ChartCard>
            <h3 className="mb-4 text-lg font-semibold text-foreground">Report Summary</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Peak Activity:</span> Saturdays at 8-10 AM
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Top Source:</span> 42% from app icon launch, 17% push safety alerts
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Top Platform:</span> iOS (58% of users)
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Trending Up:</span> Feature activation rate (+1.8pp vs previous month)
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Areas to Improve:</span> Offline map sync and AR navigation permission setup
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Recommendation:</span> Simplify safety setup and pre-cache emergency guidance before trail start
                </p>
              </div>
            </div>
          </ChartCard>
        </section>
      </div>
    </main>
  );
}
