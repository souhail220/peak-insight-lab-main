import type { InterfaceData } from "@/lib/parseExcel";
import { generateHeatmapsForInterface } from "@/lib/heatmaps";

// 12 TrailMate Hiking App Features
const FEATURES = [
  "AI Safety Watch",
  "Offline AI Emergency Assistant",
  "Mesh SOS Network",
  "AI Route Generator with AR Navigation",
  "RadioMode Walkie-Talkie",
  "Smart Gear Checklist",
  "AI Hiking Companion",
  "Enhanced Route Sharing",
  "GhostTrail Footprint System",
  "WildlifeID Lens",
  "StarPath Night Navigator",
  "ThermalRisk Scanner"
];

// Generate realistic test data for A/B testing (TrailMate hiking app with feature tracking)
export function generateDemoInterfaceData(variant: "A" | "B"): InterfaceData {
  const isVariantB = variant === "B";

  const userCount = 490;
  const featureRates: Record<string, { A: number; B: number }> = {
    "AI Safety Watch": { A: 0.71, B: 0.78 },
    "Offline AI Emergency Assistant": { A: 0.64, B: 0.70 },
    "Mesh SOS Network": { A: 0.56, B: 0.62 },
    "AI Route Generator with AR Navigation": { A: 0.74, B: 0.82 },
    "RadioMode Walkie-Talkie": { A: 0.58, B: 0.64 },
    "Smart Gear Checklist": { A: 0.76, B: 0.83 },
    "AI Hiking Companion": { A: 0.69, B: 0.77 },
    "Enhanced Route Sharing": { A: 0.52, B: 0.58 },
    "GhostTrail Footprint System": { A: 0.55, B: 0.61 },
    "WildlifeID Lens": { A: 0.61, B: 0.68 },
    "StarPath Night Navigator": { A: 0.43, B: 0.48 },
    "ThermalRisk Scanner": { A: 0.49, B: 0.55 },
  };

  // Generate feature interaction data for each user
  const rawData = Array.from({ length: userCount }, (_, i) => {
    const userId = `USER_${variant}_${String(i + 1).padStart(3, "0")}`;
    const baseObj: Record<string, any> = { "User ID": userId };
    
    // For each feature, track adoption and interactions
    FEATURES.forEach(feature => {
      const rate = featureRates[feature][variant];
      const adopted = i < Math.round(userCount * rate);
      baseObj[`${feature} (Used)`] = adopted ? "Yes" : "No";
      baseObj[`${feature} (Interactions)`] = adopted ? 2 + ((i * 7) % 9) + (isVariantB ? 1 : 0) : 0;
      baseObj[`${feature} (Avg Time)`] = adopted ? 70 + ((i * 11) % 180) + (isVariantB ? 18 : 0) : 0;
    });

    // Additional engagement metrics
    baseObj["Screens Visited"] = 4 + (i % 5) + (isVariantB ? 1 : 0);
    baseObj["Session Duration (sec)"] = 230 + ((i * 13) % 220) + (isVariantB ? 28 : 0);
    baseObj["Feature Discovery"] = 5 + (i % 5) + (isVariantB ? 1 : 0);
    baseObj["Emergency Used"] = i % 41 === 0 ? "Yes" : "No";
    
    return baseObj;
  });

  const kpis = [
    ...FEATURES.map((feature) => {
      const rate = featureRates[feature][variant];
      const rateA = featureRates[feature].A;
      return {
        kpi: `${feature} Adoption`,
        rate,
        raw: Math.round(userCount * rate),
        target: feature.includes("StarPath") || feature.includes("ThermalRisk") ? "50%" : "70%",
        vsA: isVariantB ? `+${Math.round((rate - rateA) * 100)}pp` : null,
      };
    }),
    { kpi: "Start Hike Activation", rate: isVariantB ? 0.79 : 0.72, raw: isVariantB ? 387 : 353, target: "75%", vsA: isVariantB ? "+7pp" : null },
    { kpi: "Route Plan Completed", rate: isVariantB ? 0.77 : 0.70, raw: isVariantB ? 377 : 343, target: "72%", vsA: isVariantB ? "+7pp" : null },
    { kpi: "Day 7 Retention", rate: isVariantB ? 0.58 : 0.52, raw: isVariantB ? 284 : 255, target: "55%", vsA: isVariantB ? "+6pp" : null },
    { kpi: "Intentful Session Rate", rate: isVariantB ? 0.83 : 0.79, raw: isVariantB ? 407 : 387, target: "80%", vsA: isVariantB ? "+4pp" : null },
  ];

  const funnel = [
    { step: "Open App", users: userCount, dropoff: 0, completion: 100 },
    { step: "Start Hike", users: isVariantB ? 387 : 353, dropoff: isVariantB ? 103 : 137, completion: isVariantB ? 79 : 72 },
    { step: "Generate Route", users: isVariantB ? 377 : 343, dropoff: isVariantB ? 10 : 10, completion: isVariantB ? 77 : 70 },
    { step: "Enable Safety Watch", users: isVariantB ? 382 : 348, dropoff: isVariantB ? 5 : 5, completion: isVariantB ? 78 : 71 },
    { step: "Activate Trail Feature", users: isVariantB ? 386 : 348, dropoff: isVariantB ? 4 : 0, completion: isVariantB ? 79 : 71 },
  ];

  return {
    fileName: `Interface${variant}_TestData.xlsx`,
    title: `Trail Mate A/B Test — Interface ${variant} | ${userCount} Users`,
    testName: `TrailMate Interface ${variant}`,
    testPeriod: "May 1-31, 2026",
    userCount,
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
    heatmaps: generateHeatmapsForInterface(variant, isVariantB, userCount),
  };
}

// Generate demo A/B test data for both variants
export function generateDemoABTestData() {
  const dataA = generateDemoInterfaceData("A");
  const dataB = generateDemoInterfaceData("B");
  return { dataA, dataB };
}
