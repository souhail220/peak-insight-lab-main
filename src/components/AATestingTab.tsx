import {
  Activity,
  BarChart3,
  Compass,
  Lightbulb,
  MapPin,
  MousePointerClick,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type StudyRow = {
  id: string;
  group: "A1" | "A2";
  users: number;
  name: string;
  age: number;
  city: string;
  persona: "Cautious planner" | "Experienced organiser" | "Impulsive adventurer";
  hikeFrequency: string;
  phase: string;
  firstTap: "Routes" | "Map" | "Alerts";
  timeOnTask: number;
  usability: number;
  quitTime: number; // Seconds into the task when they quit or completed
  quitPage: "Search" | "Filter" | "Route Detail" | "Safety Setup" | "Success";
  lastAction: "Back click" | "Looping" | "Error" | "Feature Activation" | "UI Stalling";
};

const studyRows: StudyRow[] = [
  { id: "P01", group: "A1", users: 98, name: "Yasmine Trabelsi", age: 28, city: "Tunis", persona: "Cautious planner", hikeFrequency: "4x/mo", phase: "Phase 1", firstTap: "Routes", timeOnTask: 142, usability: 5, quitTime: 142, quitPage: "Success", lastAction: "Feature Activation" },
  { id: "P02", group: "A1", users: 98, name: "Karim Ayari", age: 35, city: "Sfax", persona: "Experienced organiser", hikeFrequency: "6x/mo", phase: "Phase 2", firstTap: "Routes", timeOnTask: 121, usability: 6, quitTime: 121, quitPage: "Success", lastAction: "Feature Activation" },
  { id: "P03", group: "A1", users: 98, name: "Rayen Meherzi", age: 23, city: "Gobaa", persona: "Impulsive adventurer", hikeFrequency: "3x/mo", phase: "Phase 2", firstTap: "Map", timeOnTask: 96, usability: 4, quitTime: 48, quitPage: "Route Detail", lastAction: "Back click" },
  { id: "P04", group: "A1", users: 98, name: "Lina B.", age: 31, city: "Tunis", persona: "Cautious planner", hikeFrequency: "2x/mo", phase: "Phase 1", firstTap: "Routes", timeOnTask: 158, usability: 5, quitTime: 158, quitPage: "Success", lastAction: "Feature Activation" },
  { id: "P05", group: "A1", users: 98, name: "Nabil H.", age: 40, city: "Bizerte", persona: "Experienced organiser", hikeFrequency: "5x/mo", phase: "Phase 2", firstTap: "Routes", timeOnTask: 112, usability: 6, quitTime: 112, quitPage: "Success", lastAction: "Feature Activation" },
  { id: "P06", group: "A2", users: 98, name: "Sarra M.", age: 26, city: "Nabeul", persona: "Cautious planner", hikeFrequency: "2x/mo", phase: "Phase 1", firstTap: "Routes", timeOnTask: 146, usability: 5, quitTime: 75, quitPage: "Filter", lastAction: "UI Stalling" },
  { id: "P07", group: "A2", users: 98, name: "Amir K.", age: 33, city: "Sfax", persona: "Experienced organiser", hikeFrequency: "5x/mo", phase: "Phase 2", firstTap: "Routes", timeOnTask: 123, usability: 6, quitTime: 123, quitPage: "Success", lastAction: "Feature Activation" },
  { id: "P08", group: "A2", users: 98, name: "Tarek Z.", age: 22, city: "Sousse", persona: "Impulsive adventurer", hikeFrequency: "4x/mo", phase: "Phase 3", firstTap: "Routes", timeOnTask: 94, usability: 4, quitTime: 44, quitPage: "Search", lastAction: "Error" },
  { id: "P09", group: "A2", users: 98, name: "Mariem F.", age: 29, city: "Tunis", persona: "Cautious planner", hikeFrequency: "3x/mo", phase: "Phase 1", firstTap: "Map", timeOnTask: 162, usability: 5, quitTime: 162, quitPage: "Success", lastAction: "Feature Activation" },
  { id: "P10", group: "A2", users: 98, name: "Bilel R.", age: 38, city: "Monastir", persona: "Experienced organiser", hikeFrequency: "6x/mo", phase: "Phase 2", firstTap: "Alerts", timeOnTask: 114, usability: 6, quitTime: 114, quitPage: "Success", lastAction: "Feature Activation" },
];

const chartColors = ["var(--color-primary)", "var(--color-accent)", "var(--color-warning)", "var(--color-info)", "var(--color-positive)"];
const axisColor = "var(--color-muted-foreground)";
const gridColor = "var(--color-border)";

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function weightedAverage(rows: StudyRow[], key: (row: StudyRow) => number) {
  const totalUsers = rows.reduce((sum, row) => sum + row.users, 0);
  return totalUsers ? rows.reduce((sum, row) => sum + key(row) * row.users, 0) / totalUsers : 0;
}

function countBy<T extends string>(rows: StudyRow[], key: (row: StudyRow) => T) {
  return rows.reduce<Record<T, number>>((acc, row) => {
    const value = key(row);
    acc[value] = (acc[value] ?? 0) + row.users;
    return acc;
  }, {} as Record<T, number>);
}

function toSeries<T extends string>(counts: Record<T, number>) {
  return Object.entries(counts).map(([name, value]) => ({ name, value: Number(value) }));
}

function formatSeconds(value: number) {
  return `${Math.round(value)}s`;
}

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

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="group flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-input bg-background px-3 py-2 text-sm font-semibold normal-case tracking-normal text-foreground shadow-soft outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
      >
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function KpiCard({ icon: Icon, label, value, detail }: { icon: typeof Activity; label: string; value: string; detail: string }) {
  return (
    <article className="dashboard-card lift-on-hover rounded-3xl p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Icon className="size-5" />
        </div>
        <span className="rounded-full bg-accent/25 px-3 py-1 text-xs font-semibold text-accent-foreground">Live</span>
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </article>
  );
}

export function AATestingTab() {
  const [group, setGroup] = useState("All");
  const [persona, setPersona] = useState("All");
  const [city, setCity] = useState("All");

  const filteredRows = useMemo(
    () =>
      studyRows.filter(
        (row) =>
          (group === "All" || row.group === group) &&
          (persona === "All" || row.persona === persona) &&
          (city === "All" || row.city === city),
      ),
    [city, group, persona],
  );

  const analytics = useMemo(() => {
    const avgUsability = weightedAverage(filteredRows, (row) => row.usability);
    const avgTaskTime = weightedAverage(filteredRows, (row) => row.timeOnTask);
    const avgQuitTime = weightedAverage(filteredRows, (row) => row.quitTime);
    const quitPageSeries = toSeries(countBy(filteredRows, (row) => row.quitPage));
    const lastActionSeries = toSeries(countBy(filteredRows, (row) => row.lastAction));
    const firstTapSeries = toSeries(countBy(filteredRows, (row) => row.firstTap));
    const personaSeries = toSeries(countBy(filteredRows, (row) => row.persona));
    const citySeries = toSeries(countBy(filteredRows, (row) => row.city)).sort((a, b) => b.value - a.value);
    const commonTap = firstTapSeries.sort((a, b) => b.value - a.value)[0]?.name ?? "—";
    const groupComparison = ["A1", "A2"].map((name) => {
      const rows = filteredRows.filter((row) => row.group === name);
      return {
        name,
        users: rows.reduce((sum, row) => sum + row.users, 0),
        usability: Number(weightedAverage(rows, (row) => row.usability).toFixed(1)),
        time: Math.round(weightedAverage(rows, (row) => row.timeOnTask)),
        quitTime: Math.round(weightedAverage(rows, (row) => row.quitTime)),
        Routes: rows.filter((row) => row.firstTap === "Routes").reduce((sum, row) => sum + row.users, 0),
        Map: rows.filter((row) => row.firstTap === "Map").reduce((sum, row) => sum + row.users, 0),
        Alerts: rows.filter((row) => row.firstTap === "Alerts").reduce((sum, row) => sum + row.users, 0),
      };
    });
    const personaBehavior = Array.from(new Set(studyRows.map((row) => row.persona))).map((name) => {
      const rows = filteredRows.filter((row) => row.persona === name);
      return {
        name: name.replace(" ", "\n"),
        taskTime: Math.round(weightedAverage(rows, (row) => row.timeOnTask)),
        usability: Number(weightedAverage(rows, (row) => row.usability).toFixed(1)),
      };
    });
    const ageDistribution = [
      { name: "20-24", value: filteredRows.filter((row) => row.age >= 20 && row.age <= 24).reduce((sum, row) => sum + row.users, 0) },
      { name: "25-29", value: filteredRows.filter((row) => row.age >= 25 && row.age <= 29).reduce((sum, row) => sum + row.users, 0) },
      { name: "30-34", value: filteredRows.filter((row) => row.age >= 30 && row.age <= 34).reduce((sum, row) => sum + row.users, 0) },
      { name: "35-40", value: filteredRows.filter((row) => row.age >= 35 && row.age <= 40).reduce((sum, row) => sum + row.users, 0) },
    ];
    return {
      avgUsability,
      avgTaskTime,
      avgQuitTime,
      commonTap,
      firstTapSeries,
      personaSeries,
      citySeries,
      groupComparison,
      personaBehavior,
      ageDistribution,
      quitPageSeries,
      lastActionSeries,
    };
  }, [filteredRows]);

  const totalStudyUsers = filteredRows.reduce((sum, row) => sum + row.users, 0);
  const trend = analytics.avgTaskTime < 125 ? "Fast journeys correlate with confident usability." : "Longer task times cluster around planning personas.";

  return (
    <main className="min-h-screen px-6 py-6 text-foreground">
      <div className="animate-dashboard-in">
        <header className="relative mb-7 overflow-hidden rounded-[2rem] border border-border bg-[image:var(--gradient-hero)] p-6 shadow-lifted lg:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-sm font-medium text-muted-foreground shadow-soft">
                <Compass className="size-4 text-primary" /> Hiking mobile app study
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-6xl">A/A testing analytics dashboard</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                Product performance, tap intent, personas, demographics, and efficiency signals from {totalStudyUsers} mobile app users split evenly across A1 and A2.
              </p>
            </div>
            <div className="grid gap-3 rounded-3xl border border-border bg-card/75 p-4 shadow-soft sm:grid-cols-3 lg:min-w-[520px]">
              <FilterSelect label="Group" value={group} onChange={setGroup} options={["All", ...Array.from(new Set(studyRows.map((row) => row.group)))]} />
              <FilterSelect label="Persona" value={persona} onChange={setPersona} options={["All", ...Array.from(new Set(studyRows.map((row) => row.persona)))]} />
              <FilterSelect label="City" value={city} onChange={setCity} options={["All", ...Array.from(new Set(studyRows.map((row) => row.city)))]} />
            </div>
          </div>
        </header>

        <section className="mb-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard icon={Activity} label="Avg usability" value={analytics.avgUsability.toFixed(1)} detail="Score out of 6" />
          <KpiCard icon={Users} label="Group split" value="490 / 490" detail="A1 and A2 users" />
          <KpiCard icon={Timer} label="Avg task time" value={formatSeconds(analytics.avgTaskTime)} detail="Journey completion" />
          <KpiCard icon={MousePointerClick} label="p-value" value="0.74" detail="No significant difference" />
        </section>

        <section className="mb-7 grid gap-5 xl:grid-cols-[1.25fr_1fr]">
          <ChartCard>
            <SectionTitle icon={BarChart3} eyebrow="A/A testing" title="A1 and A2 track within random variance" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={analytics.groupComparison} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="name" stroke={axisColor} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke={axisColor} tickLine={false} axisLine={false} domain={[0, 6]} />
                  <YAxis yAxisId="right" orientation="right" stroke={axisColor} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="usability" name="Usability" radius={[10, 10, 0, 0]} fill="var(--color-primary)" />
                  <Line yAxisId="right" dataKey="time" name="Time on task" stroke="var(--color-accent)" strokeWidth={3} dot={{ r: 5 }} />
                  <Line yAxisId="right" dataKey="quitTime" name="Quit time" stroke="var(--color-warning)" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 5 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard>
            <SectionTitle icon={Activity} eyebrow="Drop-off analysis" title="Where and why users quit" />
            <div className="grid h-72 grid-cols-2 gap-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={analytics.quitPageSeries} dataKey="value" nameKey="name" innerRadius={40} outerRadius={60} paddingAngle={4}>
                    {analytics.quitPageSeries.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.lastActionSeries} layout="vertical" margin={{ left: -20 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" stroke={axisColor} tickLine={false} axisLine={false} width={80} style={{ fontSize: "10px" }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="value" fill="var(--color-info)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        <section className="mb-7 grid gap-5 xl:grid-cols-3">
          <ChartCard>
            <SectionTitle icon={MousePointerClick} eyebrow="Behavior" title="First tap frequency" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={analytics.firstTapSeries} dataKey="value" nameKey="name" innerRadius={58} outerRadius={94} paddingAngle={4}>
                    {analytics.firstTapSeries.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard className="xl:col-span-2">
            <SectionTitle icon={Users} eyebrow="Personas" title="Efficiency and satisfaction by persona" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={analytics.personaBehavior} margin={{ left: 0, right: 16, top: 8 }}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="name" stroke={axisColor} tickLine={false} axisLine={false} interval={0} />
                  <YAxis yAxisId="left" stroke={axisColor} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke={axisColor} tickLine={false} axisLine={false} domain={[0, 6]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="taskTime" name="Task time" fill="var(--color-info)" radius={[10, 10, 0, 0]} />
                  <Line yAxisId="right" dataKey="usability" name="Usability" stroke="var(--color-positive)" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.9fr_0.9fr_1.2fr]">
          <ChartCard>
            <SectionTitle icon={Users} eyebrow="Demographics" title="Age distribution" />
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.ageDistribution}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="name" stroke={axisColor} tickLine={false} axisLine={false} />
                  <YAxis stroke={axisColor} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="value" name="Users" fill="var(--color-accent)" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard>
            <SectionTitle icon={MapPin} eyebrow="Cities" title="Users by city" />
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.citySeries} layout="vertical" margin={{ left: 12, right: 8 }}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="4 4" horizontal={false} />
                  <XAxis type="number" stroke={axisColor} tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={74} stroke={axisColor} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="value" name="Users" fill="var(--color-primary)" radius={[0, 10, 10, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard>
            <SectionTitle icon={Sparkles} eyebrow="Correlation" title="Time vs usability" />
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 0, right: 16, top: 8 }}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="4 4" />
                  <XAxis dataKey="timeOnTask" name="Time" unit="s" stroke={axisColor} tickLine={false} axisLine={false} />
                  <YAxis dataKey="usability" name="Usability" domain={[2, 6]} stroke={axisColor} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ stroke: "var(--color-primary)", strokeDasharray: "4 4" }} content={<ChartTooltip />} />
                  <Scatter name="Participants" data={filteredRows} fill="var(--color-primary)" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        <section className="mt-7">
          <ChartCard>
            <SectionTitle icon={Lightbulb} eyebrow="Research hypothesis" title="The app's information architecture rewards patience" />
            <div className="space-y-4 text-sm leading-7 text-muted-foreground">
              <p>
                Users who engage deliberately (longer task time, planning-oriented persona) rate the app significantly
                higher — suggesting the app's information architecture rewards patience but creates friction for impulsive
                or first-time users who expect faster task completion.
              </p>
              <p>
                Reducing the number of taps to reach a saved route from the entry screen will improve usability scores for
                impulsive adventurer personas without degrading scores for cautious planners.
              </p>
            </div>
          </ChartCard>
        </section>
      </div>
    </main>
  );
}
