import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-8 py-[52px] text-center">
      <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-primary-50">
        {icon}
      </div>
      <p className="text-sm font-semibold text-text-primary">{title}</p>
      {description ? (
        <p className="text-xs text-text-tertiary">{description}</p>
      ) : null}
    </div>
  );
}
