import { useEffect, useRef } from "react";
import type { HeatmapScreen } from "@/lib/parseExcel";
import { fmtNum } from "@/lib/format";

type Accent = "primary" | "secondary";

export function HeatmapCanvas({
  screen,
  accent = "secondary",
}: {
  screen: HeatmapScreen;
  accent?: Accent;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const sx = w / screen.screenWidth;
    const sy = h / screen.screenHeight;
    const maxCount = Math.max(...screen.clicks.map((c) => c.count), 1);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "hsl(var(--muted))";
    ctx.fillRect(0, 0, w, h);

    for (const click of screen.clicks) {
      const x = click.x * sx;
      const y = click.y * sy;
      const intensity = click.count / maxCount;
      const radius = 24 + intensity * 56;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      if (accent === "primary") {
        gradient.addColorStop(0, `rgba(220, 80, 40, ${0.35 + intensity * 0.45})`);
        gradient.addColorStop(0.5, `rgba(240, 120, 50, ${0.15 + intensity * 0.25})`);
        gradient.addColorStop(1, "rgba(240, 120, 50, 0)");
      } else {
        gradient.addColorStop(0, `rgba(100, 120, 160, ${0.3 + intensity * 0.4})`);
        gradient.addColorStop(0.5, `rgba(120, 140, 180, ${0.12 + intensity * 0.2})`);
        gradient.addColorStop(1, "rgba(120, 140, 180, 0)");
      }
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [screen, accent]);

  const totalClicks = screen.clicks.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="space-y-3">
      <div className="relative mx-auto max-w-[280px] rounded-2xl border-4 border-border bg-muted/30 p-2 shadow-sm">
        <canvas
          ref={canvasRef}
          width={270}
          height={585}
          className="w-full rounded-xl"
          aria-label={`Heatmap for ${screen.screenName}`}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg bg-muted/30 px-2 py-2">
          <p className="text-muted-foreground">Users</p>
          <p className="font-semibold text-foreground">{fmtNum(screen.userCount)}</p>
        </div>
        <div className="rounded-lg bg-muted/30 px-2 py-2">
          <p className="text-muted-foreground">Avg time</p>
          <p className="font-semibold text-foreground">{screen.avgTimeSpent}s</p>
        </div>
        <div className="rounded-lg bg-muted/30 px-2 py-2">
          <p className="text-muted-foreground">Clicks</p>
          <p className="font-semibold text-foreground">{fmtNum(totalClicks)}</p>
        </div>
      </div>
    </div>
  );
}
