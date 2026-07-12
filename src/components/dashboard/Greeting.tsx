import { CURRENT_USER_NAME } from "@/lib/constants";

export function Greeting() {
  const fecha = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3.5">
      <div>
        <p className="text-sm font-semibold text-text-primary">
          Buenos días, {CURRENT_USER_NAME}
        </p>
        <p className="text-xs capitalize text-text-tertiary">{fecha}</p>
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-600">
        {CURRENT_USER_NAME.slice(0, 2).toUpperCase()}
      </div>
    </header>
  );
}
