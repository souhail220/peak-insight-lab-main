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
  browser: string;
  duration: number;
  timestamp: Date;
  pages: number;
  conversion: boolean;
}

// A/B Testing data generator
export function generateABTestMetrics(): ABTestMetrics {
  const variantAVisits = 12450;
  const variantAConversions = 1248;
  const variantAConversionRate = (variantAConversions / variantAVisits) * 100;

  const variantBVisits = 12380;
  const variantBConversions = 1456;
  const variantBConversionRate = (variantBConversions / variantBVisits) * 100;

  const uplift = ((variantBConversionRate - variantAConversionRate) / variantAConversionRate) * 100;
  const winnerConfidence = Math.min(98.5, 75 + Math.abs(uplift) * 2.5);

  return {
    variantA: {
      conversionRate: parseFloat(variantAConversionRate.toFixed(2)),
      visits: variantAVisits,
      conversions: variantAConversions,
      avgSessionDuration: 245,
      bounceRate: 32.5,
      ctr: 4.2,
      confidence: 95.2,
    },
    variantB: {
      conversionRate: parseFloat(variantBConversionRate.toFixed(2)),
      visits: variantBVisits,
      conversions: variantBConversions,
      avgSessionDuration: 278,
      bounceRate: 28.1,
      ctr: 5.8,
      confidence: 97.1,
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
    totalSessions: 145230,
    totalConversions: 8952,
    conversionRate: 6.16,
    avgSessionDuration: 287,
    bounceRate: 28.5,
    avgPagesPerSession: 4.2,
    newVisitors: 89230,
    returningVisitors: 56000,
    topPages: [
      { page: "/hiking/trails", views: 45230, conversions: 3420, conversionRate: 7.56 },
      { page: "/hiking/booking", views: 38920, conversions: 2856, conversionRate: 7.34 },
      { page: "/hiking/guides", views: 32150, conversions: 1685, conversionRate: 5.24 },
      { page: "/hiking/reviews", views: 28450, conversions: 891, conversionRate: 3.13 },
    ],
    topScreens: [
      { screen: "Trail Grid", interactions: 52100, avgTime: 84 },
      { screen: "Booking Form", interactions: 41200, avgTime: 156 },
      { screen: "Payment", interactions: 28900, avgTime: 234 },
      { screen: "Confirmation", interactions: 28500, avgTime: 45 },
    ],
    dropOffPoints: [
      { page: "Trail Details", dropOffRate: 12.5 },
      { page: "Booking Form", dropOffRate: 28.3 },
      { page: "Payment Method", dropOffRate: 18.7 },
      { page: "Final Confirmation", dropOffRate: 5.2 },
    ],
  };
}

// User analytics data
export function generateUserAnalyticsData() {
  const countries: CountryData[] = [
    { country: "Tunisia", code: "TN", users: 85400, percentage: 70.8, avgSessionDuration: 325 },
    { country: "Algeria", code: "DZ", users: 18900, percentage: 15.7, avgSessionDuration: 298 },
    { country: "Morocco", code: "MA", users: 10200, percentage: 8.5, avgSessionDuration: 287 },
    { country: "Libya", code: "LY", users: 3200, percentage: 2.7, avgSessionDuration: 245 },
    { country: "Egypt", code: "EG", users: 2800, percentage: 2.3, avgSessionDuration: 276 },
  ];

  const devices: DeviceData[] = [
    { device: "Mobile", users: 78450, percentage: 65.2, avgSessionDuration: 245 },
    { device: "Desktop", users: 35280, percentage: 29.3, avgSessionDuration: 412 },
    { device: "Tablet", users: 6770, percentage: 5.6, avgSessionDuration: 289 },
  ];

  const browsers: DeviceData[] = [
    { device: "Chrome", users: 68420, percentage: 56.8, avgSessionDuration: 298 },
    { device: "Safari", users: 34890, percentage: 28.9, avgSessionDuration: 312 },
    { device: "Firefox", users: 10450, percentage: 8.7, avgSessionDuration: 276 },
    { device: "Edge", users: 5740, percentage: 4.8, avgSessionDuration: 285 },
  ];

  const os: DeviceData[] = [
    { device: "iOS", users: 45230, percentage: 37.6, avgSessionDuration: 267 },
    { device: "Android", users: 48900, percentage: 40.6, avgSessionDuration: 234 },
    { device: "Windows", users: 18450, percentage: 15.3, avgSessionDuration: 398 },
    { device: "macOS", users: 7870, percentage: 6.5, avgSessionDuration: 425 },
  ];

  const trafficSources: TrafficSource[] = [
    { source: "Direct", users: 34200, sessions: 52300, conversionRate: 8.2 },
    { source: "Google Tunisia", users: 45600, sessions: 68900, conversionRate: 6.8 },
    { source: "Facebook", users: 18900, sessions: 28450, conversionRate: 5.1 },
    { source: "Instagram", users: 12300, sessions: 18650, conversionRate: 4.2 },
    { source: "Email", users: 8450, sessions: 12300, conversionRate: 9.5 },
    { source: "Referral", users: 5200, sessions: 7850, conversionRate: 3.8 },
  ];

  const hourlyData: HourlyActivity[] = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, "0")}:00`,
    users: Math.floor(Math.random() * 2000 + 1500),
    sessions: Math.floor(Math.random() * 3000 + 2500),
  }));

  const dailyData: DailyActivity[] = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(2026, 0, i + 1).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    sessions: Math.floor(Math.random() * 8000 + 4000),
    users: Math.floor(Math.random() * 5000 + 3000),
    conversions: Math.floor(Math.random() * 600 + 200),
  }));

  return {
    totalUsers: 2000,
    activeUsers: 14250,
    totalSessions: 8420,
    peakHour: "14:00 - 15:00",
    peakDay: "Saturday",
    newVisitors: 67300,
    returningVisitors: 53200,
    newVisitorPercentage: 55.8,
    countries,
    devices,
    browsers,
    os,
    trafficSources,
    hourlyData,
    dailyData,
    avgSessionDuration: 287,
    avgPagesPerSession: 4.2,
  };
}

// Generate recent sessions
export function generateRecentSessions(): UserSession[] {
  const devices = ["iPhone 15", "Samsung Galaxy S24", "iPad Pro", "MacBook Pro", "Dell XPS"];
  const browsers = ["Chrome", "Safari", "Firefox", "Edge"];

  return Array.from({ length: 15 }, (_, i) => ({
    sessionId: `session_${Date.now()}_${i}`,
    userId: `user_${Math.floor(Math.random() * 10000)}`,
    country: "from TN",
    device: devices[Math.floor(Math.random() * devices.length)],
    browser: browsers[Math.floor(Math.random() * browsers.length)],
    duration: Math.floor(Math.random() * 1200 + 60),
    timestamp: new Date(Date.now() - Math.random() * 3600000),
    pages: Math.floor(Math.random() * 8 + 1),
    conversion: Math.random() > 0.6,
  }));
}
