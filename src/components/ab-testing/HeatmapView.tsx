import { useState } from "react";
import { useABTestStore } from "@/store/abTestStore";
import { UploadScreen } from "@/components/ABTestingUpload";
import heatmapVariantA from "@/images/heatmap_aoi_image-2026-05-05-102349351-png (2).jpg";
import heatmapVariantB from "@/images/heatmap_aoi_image-2026-05-05-102359184-png (2).jpg";

const HEATMAP_SCREENS = [
  {
    screenName: "Routes & Discovery",
    description: "Your routes (A) vs Explore home (B)",
    variantA: heatmapVariantA,
    variantB: heatmapVariantB,
  },
] as const;

export function HeatmapView() {
  const { dataA, dataB } = useABTestStore();
  const [selectedScreen, setSelectedScreen] = useState(0);

  if (!dataA || !dataB) return <UploadScreen />;

  const screen = HEATMAP_SCREENS[selectedScreen];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Heatmap Analysis</h2>

        {HEATMAP_SCREENS.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">Select Screen:</label>
            <select
              value={selectedScreen}
              onChange={(e) => setSelectedScreen(Number(e.target.value))}
              className="w-full max-w-md px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              {HEATMAP_SCREENS.map((item, idx) => (
                <option key={item.screenName} value={idx}>
                  {item.screenName}
                </option>
              ))}
            </select>
          </div>
        )}

        <p className="mb-6 text-sm text-muted-foreground">{screen.description}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Variant A</h3>
            <div className="overflow-hidden rounded-xl border border-border bg-muted/20">
              <img
                src={screen.variantA}
                alt={`${screen.screenName} — Variant A heatmap`}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Variant B</h3>
            <div className="overflow-hidden rounded-xl border border-border bg-muted/20">
              <img
                src={screen.variantB}
                alt={`${screen.screenName} — Variant B heatmap`}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/20 border border-border">
          <p className="text-xs text-muted-foreground">
            Attention Insight heatmaps show gaze and interaction intensity. Warmer colors (red/orange) indicate
            higher engagement; CTA boxes mark tracked areas of interest.
          </p>
        </div>
      </div>
    </div>
  );
}
