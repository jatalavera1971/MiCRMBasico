import { cache } from "react";
import { cookies } from "next/headers";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

export const SESSION_COOKIE_NAME = "crm_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 días, fijo, sin renovación deslizante

// JOS-60/61: única forma de leer la sesión actual server-side. El `token` se
// reexpone en el retorno a propósito — page.tsx/layout.tsx lo pasan a sus
// fetchQuery de negocio (ahora todas exigen sesión, ver convex/clientes.ts
// etc.), y las Server Actions en src/lib/actions/*.ts lo pasan a sus
// fetchMutation. El token NUNCA sale de una función marcada "use server" o de
// un Server Component — nunca se serializa hacia un Client Component.
export const getSesionActual = cache(async () => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const usuario = await fetchQuery(api.auth.obtenerSesionActual, { token });
  if (!usuario) return null;
  return { token, usuario };
});
