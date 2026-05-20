export function StatCard({
  label,
  value,
  subA,
  subB,
  icon,
}: {
  label: string;
  value: string;
  subA?: string;
  subB?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
        {icon && <div className="text-primary opacity-70">{icon}</div>}
      </div>
      <div className="text-2xl font-semibold text-foreground mt-2">{value}</div>
      {(subA || subB) && (
        <div className="mt-3 flex gap-4 text-xs">
          {subA && (
            <span className="text-muted-foreground">
              A: <span className="text-foreground font-medium">{subA}</span>
            </span>
          )}
          {subB && (
            <span className="text-muted-foreground">
              B: <span className="text-primary font-medium">{subB}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
