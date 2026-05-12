import type { InterfaceData } from "@/lib/parseExcel";

// 12 TrailMate Hiking App Features
const FEATURES = [
  "AI Safety Watch",
  "Offline AI Emergency Assistant",
  "Mesh SOS Network",
  "AI Route Generator + AR",
  "RadioMode Walkie-Talkie",
  "Smart Gear Checklist",
  "AI Hiking Companion",
  "Enhanced Route Sharing",
  "GhostTrail Footprint",
  "WildlifeID Lens",
  "StarPath Navigator",
  "ThermalRisk Scanner"
];

// Generate realistic test data for A/B testing (TrailMate hiking app with feature tracking)
export function generateDemoInterfaceData(variant: "A" | "B"): InterfaceData {
  const isVariantB = variant === "B";

  // Generate feature interaction data for each user
  const rawData = Array.from({ length: 150 }, (_, i) => {
    const userId = `USER_${variant}_${String(i + 1).padStart(3, "0")}`;
    const baseObj: Record<string, any> = { "User ID": userId };
    
    // For each feature, track adoption and interactions
    FEATURES.forEach(feature => {
      const adoptionRate = isVariantB ? Math.random() > 0.25 : Math.random() > 0.4;
      baseObj[`${feature} (Used)`] = adoptionRate ? "Yes" : "No";
      baseObj[`${feature} (Interactions)`] = adoptionRate ? Math.floor(Math.random() * 50 + (isVariantB ? 15 : 8)) : 0;
      baseObj[`${feature} (Avg Time)`] = adoptionRate ? Math.floor(Math.random() * 300 + (isVariantB ? 60 : 30)) : 0;
    });

    // Additional engagement metrics
    baseObj["Screens Visited"] = Math.floor(Math.random() * 15 + (isVariantB ? 8 : 5));
    baseObj["Session Duration (sec)"] = Math.floor(Math.random() * 1200 + (isVariantB ? 300 : 150));
    baseObj["Feature Discovery"] = Math.floor(Math.random() * 12 + (isVariantB ? 6 : 3));
    baseObj["Emergency Used"] = Math.random() > 0.95 ? "Yes" : "No";
    
    return baseObj;
  });

  const kpis = [
    { kpi: "AI Safety Watch Adoption", rate: isVariantB ? 0.68 : 0.35, raw: isVariantB ? 102 : 52, target: "65%", vsA: "+33pp" },
    { kpi: "Offline AI Emergency Adoption", rate: isVariantB ? 0.61 : 0.28, raw: isVariantB ? 91 : 42, target: "60%", vsA: "+33pp" },
    { kpi: "Mesh SOS Network Usage", rate: isVariantB ? 0.52 : 0.22, raw: isVariantB ? 78 : 33, target: "50%", vsA: "+30pp" },
    { kpi: "AI Route Generator + AR Adoption", rate: isVariantB ? 0.75 : 0.45, raw: isVariantB ? 112 : 67, target: "70%", vsA: "+30pp" },
    { kpi: "RadioMode Walkie-Talkie Usage", rate: isVariantB ? 0.58 : 0.32, raw: isVariantB ? 87 : 48, target: "55%", vsA: "+26pp" },
    { kpi: "Smart Gear Checklist Adoption", rate: isVariantB ? 0.72 : 0.48, raw: isVariantB ? 108 : 72, target: "70%", vsA: "+24pp" },
    { kpi: "AI Hiking Companion Engagement", rate: isVariantB ? 0.81 : 0.52, raw: isVariantB ? 121 : 78, target: "75%", vsA: "+29pp" },
    { kpi: "Route Sharing (Community)", rate: isVariantB ? 0.46 : 0.24, raw: isVariantB ? 69 : 36, target: "45%", vsA: "+22pp" },
    { kpi: "GhostTrail Footprint Usage", rate: isVariantB ? 0.54 : 0.28, raw: isVariantB ? 81 : 42, target: "50%", vsA: "+26pp" },
    { kpi: "WildlifeID Lens Engagement", rate: isVariantB ? 0.63 : 0.38, raw: isVariantB ? 94 : 57, target: "60%", vsA: "+25pp" },
    { kpi: "StarPath Navigator Adoption", rate: isVariantB ? 0.44 : 0.19, raw: isVariantB ? 66 : 28, target: "40%", vsA: "+25pp" },
    { kpi: "ThermalRisk Scanner Awareness", rate: isVariantB ? 0.59 : 0.35, raw: isVariantB ? 88 : 52, target: "55%", vsA: "+24pp" },
    { kpi: "Start Hike Button", rate: isVariantB ? 0.62 : 0.53, raw: isVariantB ? 93 : 80, target: null, vsA: null },
    { kpi: "Trip Planning Success", rate: isVariantB ? 0.68 : 0.48, raw: isVariantB ? 102 : 72, target: "60%", vsA: "+20pp" },
    { kpi: "Plan Trip CTA", rate: isVariantB ? 0.55 : 0.45, raw: isVariantB ? 82 : 68, target: null, vsA: null },
    { kpi: "Reserve Now Conversion", rate: isVariantB ? 0.54 : 0.35, raw: isVariantB ? 81 : 52, target: "50%", vsA: "+19pp" },
    { kpi: "Route Removal Rate", rate: isVariantB ? 0.08 : 0.12, raw: isVariantB ? 12 : 18, target: null, vsA: null },
    { kpi: "Guide Profile Views", rate: isVariantB ? 0.68 : 0.58, raw: isVariantB ? 102 : 87, target: null, vsA: null },
  ];

  const funnel = [
    { step: "Discover", users: 150, dropoff: 0, completion: 100 },
    { step: "View Details", users: isVariantB ? 138 : 120, dropoff: isVariantB ? 12 : 30, completion: isVariantB ? 92 : 80 },
    { step: "Save Trail", users: isVariantB ? 108 : 72, dropoff: isVariantB ? 30 : 48, completion: isVariantB ? 72 : 48 },
    { step: "Plan Trip", users: isVariantB ? 102 : 68, dropoff: isVariantB ? 6 : 4, completion: isVariantB ? 68 : 45 },
    { step: "Reserve Spot", users: isVariantB ? 81 : 52, dropoff: isVariantB ? 21 : 16, completion: isVariantB ? 54 : 35 },
  ];

  return {
    fileName: `Interface${variant}_TestData.xlsx`,
    title: `Trail Mate A/B Test — Interface ${variant} | 150 Users`,
    testName: `TrailMate Interface ${variant}`,
    testPeriod: "May 1-31, 2026",
    userCount: 150,
    kpis,
    funnel,
    rawColumns: [
      "User ID",
      ...FEATURES.flatMap(f => [`${f} (Used)`, `${f} (Interactions)`, `${f} (Avg Time)`]),
      "Screens Visited",
      "Session Duration (sec)",
      "Feature Discovery",
      "Emergency Used"
    ],
    rawData,
    heatmaps: generateHeatmapData(variant, isVariantB),
  };
}

// Generate heatmap data for screen interactions
function generateHeatmapData(variant: string, isVariantB: boolean) {
  const screens = [
    { name: "Home Screen", width: 1080, height: 2340 },
    { name: "Discovery Feed", width: 1080, height: 2340 },
    { name: "Route Details", width: 1080, height: 2340 },
    { name: "Emergency Panel", width: 1080, height: 2340 },
    { name: "Gear Checklist", width: 1080, height: 2340 },
  ];

  return screens.map(screen => {
    const clicks: Array<{x: number, y: number, count: number}> = [];
    const hotspotCount = isVariantB ? 8 : 5;
    
    for (let i = 0; i < hotspotCount; i++) {
      clicks.push({
        x: Math.floor(Math.random() * screen.width),
        y: Math.floor(Math.random() * screen.height),
        count: Math.floor(Math.random() * 200 + (isVariantB ? 50 : 20))
      });
    }

    return {
      screenName: screen.name,
      screenWidth: screen.width,
      screenHeight: screen.height,
      clicks,
      avgTimeSpent: Math.floor(Math.random() * 120 + (isVariantB ? 40 : 20)),
      userCount: Math.floor(Math.random() * 150 + (isVariantB ? 100 : 60)),
      variant
    };
  });
}

// Generate demo A/B test data for both variants
export function generateDemoABTestData() {
  const dataA = generateDemoInterfaceData("A");
  const dataB = generateDemoInterfaceData("B");
  return { dataA, dataB };
}
