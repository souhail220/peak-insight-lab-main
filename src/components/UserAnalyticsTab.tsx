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
import { Globe, Users, TrendingUp, Clock, Radio, BarChart3, Activity, MapPin } from "lucide-react";
import { generateUserAnalyticsData, generateRecentSessions } from "../lib/analytics-data";

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

function LiveUserCard() {
  return (
    <ChartCard className="md:col-span-2">
      <div className="flex items-center justify-between">
        <div>
          <SectionTitle icon={Radio} eyebrow="Real-time" title="Users online right now" />
          <p className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-positive">1320</span>
            <span className="text-lg text-muted-foreground">active users</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex size-2 rounded-full bg-positive animate-pulse" />
            Live
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Peak hour activity</p>
            <p className="text-2xl font-semibold text-foreground">14:00 - 15:00</p>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

function StatCard({ label, value, detail, icon: Icon, color = "primary" }: { label: string; value: string | number; detail?: string; icon: typeof Users; color?: string }) {
  const colorClass = {
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
    positive: "bg-positive text-white",
    warning: "bg-warning text-black",
    info: "bg-info text-white",
  }[color];

  return (
    <ChartCard>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">{typeof value === "number" ? value.toLocaleString() : value}</p>
          {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
        </div>
        <div className={`flex size-11 items-center justify-center rounded-2xl ${colorClass}`}>
          <Icon className="size-5" />
        </div>
      </div>
    </ChartCard>
  );
}

export function UserAnalyticsTab() {
  const analytics = useMemo(() => generateUserAnalyticsData(), []);
  const recentSessions = useMemo(() => generateRecentSessions(), []);

  // Generate retention data
  const retentionData = [
    { day: "Day 1", percentage: 100 },
    { day: "Day 7", percentage: 42.5 },
    { day: "Day 14", percentage: 28.3 },
    { day: "Day 30", percentage: 18.7 },
    { day: "Day 60", percentage: 12.4 },
    { day: "Day 90", percentage: 8.9 },
  ];

  // Generate session duration data
  const sessionDurationData = [
    { range: "0-30s", users: 8450, percentage: 7.0 },
    { range: "30-60s", users: 12300, percentage: 10.2 },
    { range: "1-3m", users: 34200, percentage: 28.4 },
    { range: "3-5m", users: 28900, percentage: 23.9 },
    { range: "5-10m", users: 22650, percentage: 18.8 },
    { range: "10m+", users: 14000, percentage: 11.6 },
  ];

  return (
    <main className="min-h-screen px-6 py-6 text-foreground">
      <div className="animate-dashboard-in">
        {/* Header */}
        <header className="relative mb-7 overflow-hidden rounded-[2rem] border border-border bg-[image:var(--gradient-hero)] p-6 shadow-lifted lg:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-sm font-medium text-muted-foreground shadow-soft">
              <Globe className="size-4 text-accent" /> User Analytics
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-6xl">User Analytics Dashboard</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Understand your global user base. Real-time activity, geographic distribution, device usage, traffic sources, and detailed demographics to optimize your user experience.
            </p>
          </div>
        </header>

        {/* Live Users */}
        <section className="mb-7 grid gap-4">
          <LiveUserCard />
        </section>

        {/* Key Metrics */}
        <section className="mb-7 grid gap-4 md:grid-cols-3">
          <StatCard icon={Users} label="Total Users" value={analytics.totalUsers} detail="All-time total" color="primary" />
          <StatCard icon={Activity} label="Total Sessions" value={analytics.totalSessions} detail="All time" color="accent" />
          <StatCard icon={TrendingUp} label="Avg Session Duration" value={`${analytics.avgSessionDuration}s`} detail="Time on site" color="positive" />
        </section>

        {/* New vs Returning & Geography */}
        <section className="mb-7 grid gap-4 md:grid-cols-2">
          <ChartCard>
            <div>
              <p className="text-sm font-medium text-muted-foreground">New vs Returning Visitors</p>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">New Visitors</span>
                    <span className="text-2xl font-bold text-accent">{analytics.newVisitorPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-accent" style={{ width: `${analytics.newVisitorPercentage}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{analytics.newVisitors.toLocaleString()} users</p>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Returning Visitors</span>
                    <span className="text-2xl font-bold text-primary">{(100 - analytics.newVisitorPercentage).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-primary" style={{ width: `${100 - analytics.newVisitorPercentage}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{analytics.returningVisitors.toLocaleString()} users</p>
                </div>
              </div>
            </div>
          </ChartCard>

          <ChartCard>
            <SectionTitle icon={MapPin} eyebrow="World Map" title="Top countries" />
            <div className="space-y-2">
              {analytics.countries.slice(0, 4).map((country) => (
                <div key={country.code} className="rounded-2xl border border-border bg-card/50 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{country.country}</p>
                      <p className="text-xs text-muted-foreground">{country.users.toLocaleString()} users</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">{country.percentage}%</p>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${country.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </section>

        {/* Hourly & Daily Activity */}
        <section className="mb-7 grid gap-5 xl:grid-cols-2">
          <ChartCard>
            <SectionTitle icon={Clock} eyebrow="Peak Times" title="Users by hour" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.hourlyData} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="hour" stroke={axisColor} tickLine={false} axisLine={false} style={{ fontSize: "11px" }} interval={2} />
                  <YAxis stroke={axisColor} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="users" name="Users" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard>
            <SectionTitle icon={Activity} eyebrow="Daily Trend" title="Weekly user activity" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={analytics.dailyData} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="date" stroke={axisColor} tickLine={false} axisLine={false} style={{ fontSize: "11px" }} interval={4} />
                  <YAxis yAxisId="left" stroke={axisColor} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke={axisColor} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sessions" name="Sessions" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                  <Line yAxisId="right" dataKey="conversions" name="Conversions" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        {/* Device, Browser, OS Breakdown */}
        <section className="mb-7 grid gap-5 xl:grid-cols-3">
          <ChartCard>
            <SectionTitle icon={Users} eyebrow="Device" title="User breakdown" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={analytics.devices} dataKey="percentage" nameKey="device" innerRadius={45} outerRadius={75} paddingAngle={2}>
                    {analytics.devices.map((entry, index) => (
                      <Cell key={entry.device} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend style={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard>
            <SectionTitle icon={BarChart3} eyebrow="Browser" title="Browser usage" />
            <div className="space-y-3">
              {analytics.browsers.map((browser) => (
                <div key={browser.device}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{browser.device}</span>
                    <span className="text-sm font-semibold text-primary">{browser.percentage}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-primary" style={{ width: `${browser.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard>
            <SectionTitle icon={Activity} eyebrow="Operating System" title="OS distribution" />
            <div className="space-y-3">
              {analytics.os.map((os) => (
                <div key={os.device}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{os.device}</span>
                    <span className="text-sm font-semibold text-accent">{os.percentage}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-accent" style={{ width: `${os.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </section>

        {/* Traffic Sources & Device Duration */}
        <section className="mb-7 grid gap-5 xl:grid-cols-2">
          <ChartCard>
            <SectionTitle icon={TrendingUp} eyebrow="Traffic" title="Traffic source breakdown" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.trafficSources} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="source" stroke={axisColor} tickLine={false} axisLine={false} style={{ fontSize: "12px" }} />
                  <YAxis yAxisId="left" stroke={axisColor} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke={axisColor} tickLine={false} axisLine={false} domain={[0, 10]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="users" name="Users" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                  <Line yAxisId="right" dataKey="conversionRate" name="Conv. Rate %" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 3 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard>
            <SectionTitle icon={Clock} eyebrow="Duration" title="Avg session by device" />
            <div className="space-y-4">
              {analytics.devices.map((device) => (
                <div key={device.device}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-foreground">{device.device}</span>
                    <span className="text-2xl font-bold text-primary">{device.avgSessionDuration}s</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{device.users.toLocaleString()} users</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </section>

        {/* Retention & Session Duration */}
        <section className="mb-7 grid gap-5 xl:grid-cols-2">
          <ChartCard>
            <SectionTitle icon={TrendingUp} eyebrow="Retention" title="User retention curve" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={retentionData} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="day" stroke={axisColor} tickLine={false} axisLine={false} />
                  <YAxis stroke={axisColor} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line dataKey="percentage" name="Retention %" stroke="var(--color-positive)" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard>
            <SectionTitle icon={Clock} eyebrow="Session Duration" title="User distribution by session length" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionDurationData} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="range" stroke={axisColor} tickLine={false} axisLine={false} style={{ fontSize: "11px" }} />
                  <YAxis yAxisId="left" stroke={axisColor} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke={axisColor} tickLine={false} axisLine={false} domain={[0, 30]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="users" name="Users" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                  <Line yAxisId="right" dataKey="percentage" name="%" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 3 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        {/* Recent Sessions */}
        <section className="mb-7">
          <ChartCard>
            <h3 className="mb-5 text-lg font-semibold text-foreground">Live Activity Feed</h3>
            <div className="space-y-2">
              {recentSessions.map((session) => (
                <div key={session.sessionId} className="flex items-center justify-between rounded-2xl border border-border bg-card/50 p-3">
                  <div>
                    <p className="font-medium text-foreground">{session.country}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.device} • {session.browser} • {session.pages} pages
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{session.duration}s</span>
                    {session.conversion ? (
                      <span className="rounded-full bg-positive/20 px-3 py-1 text-xs font-semibold text-positive">Converted</span>
                    ) : (
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Browsing</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </section>

        {/* Country Table */}
        <section className="mb-7">
          <ChartCard>
            <h3 className="mb-5 text-lg font-semibold text-foreground">Country/Region Breakdown</h3>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Country</th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground">Users</th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground">Percentage</th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground">Avg Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.countries.map((country) => (
                    <tr key={country.code} className="border-b border-border last:border-0 hover:bg-secondary/30">
                      <td className="px-4 py-3 font-medium text-foreground">{country.country}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{country.users.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{country.percentage}%</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{country.avgSessionDuration}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </section>
      </div>
    </main>
  );
}
