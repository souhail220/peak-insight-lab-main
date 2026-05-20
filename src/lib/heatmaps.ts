import type { HeatmapScreen } from "@/lib/parseExcel";

const DEFAULT_SCREENS = [
  { name: "Home Screen", width: 1080, height: 2340 },
  { name: "Discovery Feed", width: 1080, height: 2340 },
  { name: "Route Details", width: 1080, height: 2340 },
  { name: "Emergency Panel", width: 1080, height: 2340 },
  { name: "Gear Checklist", width: 1080, height: 2340 },
];

/** Synthetic click heatmaps when Excel has no heatmap sheet (upload path). */
export function generateHeatmapsForInterface(
  variant: string,
  isVariantB: boolean,
  userCount: number
): HeatmapScreen[] {
  return DEFAULT_SCREENS.map((screen) => {
    const clicks: Array<{ x: number; y: number; count: number }> = [];
    const hotspotCount = isVariantB ? 8 : 5;

    for (let i = 0; i < hotspotCount; i++) {
      clicks.push({
        x: Math.floor(Math.random() * screen.width),
        y: Math.floor(Math.random() * screen.height),
        count: Math.floor(Math.random() * 200 + (isVariantB ? 50 : 20)),
      });
    }

    return {
      screenName: screen.name,
      screenWidth: screen.width,
      screenHeight: screen.height,
      clicks,
      avgTimeSpent: Math.floor(Math.random() * 120 + (isVariantB ? 40 : 20)),
      userCount: Math.min(userCount, Math.floor(Math.random() * userCount + (isVariantB ? 0.7 : 0.5) * userCount)),
      variant,
    };
  });
}

export function inferVariantB(fileName: string, title: string): boolean {
  const hint = `${fileName} ${title}`.toLowerCase();
  return /\b(interface\s*)?b\b|variant\s*b/.test(hint);
}

export function mergeHeatmapScreenNames(a?: HeatmapScreen[], b?: HeatmapScreen[]): string[] {
  const names = new Set<string>();
  a?.forEach((h) => names.add(h.screenName));
  b?.forEach((h) => names.add(h.screenName));
  return Array.from(names);
}
