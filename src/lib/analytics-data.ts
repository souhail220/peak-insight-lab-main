// Shared analytics data generators and types

export interface ABTestMetrics {
  variantA: {
    conversionRate: number;
    visits: number;
    conversions: number;
    avgSessionDuration: number;
    bounceRate: number;
    ctr: number;
    confidence: number;
  };
  variantB: {
    conversionRate: number;
    visits: number;
    conversions: number;
    avgSessionDuration: number;
    bounceRate: number;
    ctr: number;
    confidence: number;
  };
  uplift: number;
  winner: "A" | "B" | null;
  winnerConfidence: number;
}

export interface CountryData {
  country: string;
  code: string;
  users: number;
  percentage: number;
  avgSessionDuration: number;
}

export interface DeviceData {
  device: string;
  users: number;
  percentage: number;
  avgSessionDuration: number;
}

export interface HourlyActivity {
  hour: string;
  users: number;
  sessions: number;
}

export interface DailyActivity {
  date: string;
  sessions: number;
  users: number;
  conversions: number;
}

export interface TrafficSource {
  source: string;
  users: number;
  sessions: number;
  conversionRate: number;
}

export interface UserSession {
  sessionId: string;
  userId: string;
  country: string;
  device: string;
  feature: string;
  duration: number;
  timestamp: Date;
  screens: number;
  conversion: boolean;
}

// A/B Testing data generator
export function generateABTestMetrics(): ABTestMetrics {
  const variantAVisits = 490;
  const variantAConversions = 348;
  const variantAConversionRate = (variantAConversions / variantAVisits) * 100;

  const variantBVisits = 490;
  const variantBConversions = 386;
  const variantBConversionRate = (variantBConversions / variantBVisits) * 100;

  const uplift = ((variantBConversionRate - variantAConversionRate) / variantAConversionRate) * 100;
  const winnerConfidence = Math.min(98.5, 75 + Math.abs(uplift) * 2.5);

  return {
    variantA: {
      conversionRate: parseFloat(variantAConversionRate.toFixed(2)),
      visits: variantAVisits,
      conversions: variantAConversions,
      avgSessionDuration: 318,
      bounceRate: 20.8,
      ctr: 71.0,
      confidence: 94.8,
    },
    variantB: {
      conversionRate: parseFloat(variantBConversionRate.toFixed(2)),
      visits: variantBVisits,
      conversions: variantBConversions,
      avgSessionDuration: 344,
      bounceRate: 17.4,
      ctr: 78.8,
      confidence: 96.1,
    },
    uplift: parseFloat(uplift.toFixed(2)),
    winner: variantBConversionRate > variantAConversionRate ? "B" : "A",
    winnerConfidence,
  };
}

// Report summary data
export function generateReportSummary() {
  return {
    dateRange: "Jan 1 - Jan 31, 2026",
    totalSessions: 3047,
    totalConversions: 2363,
    conversionRate: 77.55,
    avgSessionDuration: 326,
    bounceRate: 18.6,
    avgPagesPerSession: 5.4,
    newVisitors: 392,
    returningVisitors: 588,
    topPages: [
      { page: "AI Route Generator with AR Navigation", views: 742, conversions: 604, conversionRate: 81.4 },
      { page: "AI Safety Watch", views: 694, conversions: 552, conversionRate: 79.5 },
      { page: "Smart Gear Checklist", views: 612, conversions: 474, conversionRate: 77.5 },
      { page: "Offline AI Emergency Assistant", views: 486, conversions: 358, conversionRate: 73.7 },
    ],
    topScreens: [
      { screen: "AI Safety Watch", interactions: 552, avgTime: 118 },
      { screen: "Offline AI Emergency Assistant", interactions: 358, avgTime: 146 },
      { screen: "Mesh SOS Network", interactions: 276, avgTime: 92 },
      { screen: "AI Route Generator with AR Navigation", interactions: 604, avgTime: 164 },
      { screen: "RadioMode Walkie-Talkie", interactions: 318, avgTime: 136 },
      { screen: "Smart Gear Checklist", interactions: 474, avgTime: 108 },
      { screen: "AI Hiking Companion", interactions: 438, avgTime: 152 },
      { screen: "Enhanced Route Sharing", interactions: 286, avgTime: 86 },
      { screen: "GhostTrail Footprint System", interactions: 304, avgTime: 124 },
      { screen: "WildlifeID Lens", interactions: 334, avgTime: 74 },
      { screen: "StarPath Night Navigator", interactions: 218, avgTime: 132 },
      { screen: "ThermalRisk Scanner", interactions: 258, avgTime: 88 },
    ],
    dropOffPoints: [
      { page: "Trail difficulty review", dropOffRate: 10.8 },
      { page: "AR navigation permission", dropOffRate: 8.6 },
      { page: "Offline map sync", dropOffRate: 7.9 },
      { page: "Emergency contact setup", dropOffRate: 6.4 },
    ],
  };
}

// User analytics data
export function generateUserAnalyticsData() {
  const countries: CountryData[] = [
    { country: "Tunisia", code: "TN", users: 694, percentage: 70.8, avgSessionDuration: 336 },
    { country: "Algeria", code: "DZ", users: 154, percentage: 15.7, avgSessionDuration: 312 },
    { country: "Morocco", code: "MA", users: 83, percentage: 8.5, avgSessionDuration: 304 },
    { country: "Libya", code: "LY", users: 26, percentage: 2.7, avgSessionDuration: 282 },
    { country: "Egypt", code: "EG", users: 23, percentage: 2.3, avgSessionDuration: 296 },
  ];

  const devices: DeviceData[] = [
    { device: "iOS", users: 568, percentage: 58.0, avgSessionDuration: 338 },
    { device: "Android", users: 412, percentage: 42.0, avgSessionDuration: 310 },
  ];

  const os: DeviceData[] = [
    { device: "iOS 18", users: 392, percentage: 40.0, avgSessionDuration: 342 },
    { device: "iOS 17", users: 176, percentage: 18.0, avgSessionDuration: 329 },
    { device: "Android 15", users: 255, percentage: 26.0, avgSessionDuration: 316 },
    { device: "Android 14", users: 157, percentage: 16.0, avgSessionDuration: 301 },
  ];

  const trafficSources: TrafficSource[] = [
    { source: "App icon launch", users: 338, sessions: 1291, conversionRate: 82.1 },
    { source: "Push safety alert", users: 196, sessions: 514, conversionRate: 79.4 },
    { source: "Shared route invite", users: 142, sessions: 386, conversionRate: 75.9 },
    { source: "App Store search", users: 132, sessions: 318, conversionRate: 71.8 },
    { source: "Trail community post", users: 98, sessions: 296, conversionRate: 73.6 },
    { source: "Emergency contact invite", users: 74, sessions: 242, conversionRate: 80.2 },
  ];

  const hourlyUsers = [8, 5, 3, 3, 7, 24, 58, 92, 118, 103, 84, 71, 66, 62, 58, 64, 72, 86, 78, 52, 34, 22, 15, 10];
  const hourlyData: HourlyActivity[] = hourlyUsers.map((users, i) => ({
    hour: `${i.toString().padStart(2, "0")}:00`,
    users,
    sessions: Math.round(users * 1.35),
  }));

  const sessionsByDay = [72, 88, 134, 142, 70, 64, 76, 84, 91, 148, 156, 73, 69, 82, 86, 94, 152, 164, 78, 71, 85, 92, 98, 158, 172, 80, 74, 88, 96, 110];
  const activationsByDay = [56, 67, 106, 112, 52, 47, 58, 64, 69, 118, 126, 54, 51, 62, 66, 72, 123, 133, 58, 52, 65, 70, 75, 128, 140, 60, 55, 67, 73, 84];
  const dailyData: DailyActivity[] = sessionsByDay.map((sessions, i) => ({
    date: new Date(2026, 0, i + 1).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    sessions,
    users: Math.round(sessions * 0.64),
    conversions: activationsByDay[i],
  }));

  return {
    totalUsers: 980,
    activeUsers: 74,
    totalSessions: 3047,
    peakHour: "08:00 - 09:00",
    peakDay: "Saturday",
    newVisitors: 392,
    returningVisitors: 588,
    newVisitorPercentage: 40.0,
    countries,
    devices,
    os,
    trafficSources,
    hourlyData,
    dailyData,
    avgSessionDuration: 326,
    avgPagesPerSession: 5.4,
  };
}

// Generate recent sessions
export function generateRecentSessions(): UserSession[] {
  const devices = ["iPhone 15 Pro", "iPhone 14", "Samsung Galaxy S24", "Google Pixel 9", "Xiaomi 14"];
  const features = ["AI Safety Watch", "AI Route Generator", "Smart Gear Checklist", "WildlifeID Lens", "Mesh SOS Network"];

  return Array.from({ length: 15 }, (_, i) => ({
    sessionId: `session_${Date.now()}_${i}`,
    userId: `user_${String(Math.floor(Math.random() * 980) + 1).padStart(3, "0")}`,
    country: "from TN",
    device: devices[Math.floor(Math.random() * devices.length)],
    feature: features[Math.floor(Math.random() * features.length)],
    duration: Math.floor(Math.random() * 480 + 90),
    timestamp: new Date(Date.now() - Math.random() * 3600000),
    screens: Math.floor(Math.random() * 5 + 3),
    conversion: Math.random() > 0.22,
  }));
}
