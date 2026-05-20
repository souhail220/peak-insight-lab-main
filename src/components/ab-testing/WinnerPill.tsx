export function WinnerPill({ w }: { w: string }) {
  const map: Record<string, string> = {
    B: "bg-primary/20 text-primary",
    A: "bg-secondary/20 text-secondary-foreground",
    Tie: "bg-muted text-muted-foreground",
    "B only": "bg-primary/20 text-primary",
  };
  const label = w === "B" ? "B wins" : w === "A" ? "A wins" : w === "Tie" ? "Tie" : "New metric";
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[w] || "bg-muted"}`}>{label}</span>;
}
