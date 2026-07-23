// JOS-60/61: recibe el nombre del usuario autenticado por prop — antes
// importaba CURRENT_USER_NAME (placeholder), ver src/app/(app)/inicio/page.tsx.
export function Greeting({ nombre }: { nombre: string }) {
  const fecha = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3.5">
      <div>
        <p className="text-sm font-semibold text-text-primary">
          Buenos días, {nombre}
        </p>
        <p className="text-xs capitalize text-text-tertiary">{fecha}</p>
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-600">
        {nombre.slice(0, 2).toUpperCase()}
      </div>
    </header>
  );
}
