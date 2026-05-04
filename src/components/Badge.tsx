import type { ReactNode } from "react";

type Variant = "neutral" | "info" | "success" | "warning" | "destructive" | "primary";

const variants: Record<Variant, string> = {
  neutral: "bg-secondary text-secondary-foreground",
  info: "bg-info/10 text-info ring-1 ring-info/20",
  success: "bg-success/10 text-success ring-1 ring-success/20",
  warning: "bg-warning/15 text-warning-foreground ring-1 ring-warning/30",
  destructive: "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
  primary: "bg-primary/10 text-primary ring-1 ring-primary/20",
};

export function Pill({
  children,
  variant = "neutral",
}: {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

export function YesNoPill({ value }: { value: "Yes" | "No" }) {
  return <Pill variant={value === "Yes" ? "warning" : "neutral"}>{value}</Pill>;
}

export function TransferMethodPill({ value }: { value: string }) {
  const v: Variant = value === "SFTP" ? "info" : value === "API" ? "primary" : "neutral";
  return <Pill variant={v}>{value}</Pill>;
}

export function FeedTypePill({ value }: { value: string }) {
  return <Pill variant="neutral">{value}</Pill>;
}
