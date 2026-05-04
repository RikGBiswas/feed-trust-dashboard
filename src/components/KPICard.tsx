import type { LucideIcon } from "lucide-react";

type Tone = "default" | "info" | "success" | "warning" | "destructive";

const toneStyles: Record<Tone, { bg: string; text: string }> = {
  default: { bg: "bg-secondary", text: "text-primary" },
  info: { bg: "bg-info/10", text: "text-info" },
  success: { bg: "bg-success/10", text: "text-success" },
  warning: { bg: "bg-warning/15", text: "text-warning-foreground" },
  destructive: { bg: "bg-destructive/10", text: "text-destructive" },
};

export function KPICard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
}) {
  const t = toneStyles[tone];
  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className={`h-8 w-8 rounded-md flex items-center justify-center ${t.bg} ${t.text}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
