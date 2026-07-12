import type { LucideIcon } from "lucide-react";

export function KpiCard({
  value,
  label,
  icon: Icon,
  iconBgClassName,
  iconColorClassName,
}: {
  value: number;
  label: string;
  icon: LucideIcon;
  iconBgClassName: string;
  iconColorClassName: string;
}) {
  return (
    <div className="flex min-h-[80px] min-w-[100px] flex-1 flex-col justify-between rounded-lg border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xl font-bold text-text-primary">{value}</span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${iconBgClassName}`}
        >
          <Icon className={`h-4 w-4 ${iconColorClassName}`} strokeWidth={1.5} />
        </span>
      </div>
      <span className="text-xs text-text-tertiary">{label}</span>
    </div>
  );
}
