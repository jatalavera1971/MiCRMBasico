import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** design.md → card-default: superficie blanca sobre canvas, sombra de dos capas. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-4 shadow-card transition-shadow hover:shadow-card-hover",
        className,
      )}
      {...props}
    />
  );
}

/** design.md → card-contact-risk / card-task-overdue / card-pipeline-risk. */
export function RiskCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <Card
      className={cn("bg-risk-bg border-risk-border hover:shadow-card", className)}
      {...props}
    />
  );
}
