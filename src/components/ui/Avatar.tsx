import { cn } from "@/lib/utils";

const SIZES = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-xl",
} as const;

function initials(nombre: string) {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  return (partes[0]?.[0] ?? "").concat(partes[1]?.[0] ?? "").toUpperCase();
}

/** design.md → Avatars: círculo, fondo primary-100, texto primary-700, 2 iniciales máx. */
export function Avatar({
  nombre,
  size = "md",
  className,
}: {
  nombre: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700",
        SIZES[size],
        className,
      )}
    >
      {initials(nombre)}
    </div>
  );
}
