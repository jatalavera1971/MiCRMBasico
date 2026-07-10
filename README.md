# Vibe CRM

CRM para pequeños negocios digitales. Next.js (App Router, TypeScript, Tailwind CSS v4) + Convex como base de datos y autenticación (`@convex-dev/auth`). Pensado para desplegar en Railway.

Fuente de verdad del producto: PRD en Notion ("📋 CRM-PRD") y tareas en Linear (proyectos `CRM-MVP` y `CRM-RESTOPRD`, equipo `Joss`). El diseño exacto de cada pantalla está en `design/uploads/CRM Login para negocios digitales/*.dc.html`, con el design system documentado en `design/design.md` — los tokens de color/tipografía/espaciado de `src/app/globals.css` están traducidos 1:1 de ese archivo.

## Puesta en marcha (primera vez)

```bash
npm install

# Crea/enlaza el proyecto de Convex en tu cuenta (abre el navegador para
# iniciar sesión) y genera convex/_generated/*, que el resto del código
# necesita para compilar. Déjalo corriendo en una terminal aparte mientras
# desarrollas — sincroniza el esquema y las funciones en caliente.
npx convex dev
```

Eso genera `.env.local` con `CONVEX_DEPLOYMENT` y `NEXT_PUBLIC_CONVEX_URL` automáticamente (ver `.env.example`).

En otra terminal:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — redirige a `/login`. Como el alta de usuarios no es pública (la crea la Dueña desde P9), para el primer usuario tendrás que insertarlo a mano una vez desde el dashboard de Convex (tabla `users`, campo `role: "duena"`) o llamar a `signIn("password", { flow: "signUp", ... })` una vez desde la consola de funciones de Convex.

## Estructura

```
convex/                  Backend: esquema, autenticación y funciones (query/mutation)
  schema.ts              Modelo de datos — PRD sección 9 (Usuario, Cliente, Interacción, Recordatorio)
  auth.ts / auth.config.ts / http.ts   @convex-dev/auth (Password provider)
  clientes.ts             P1-P4, P6, P7, F1/F6/F11/F16
  interacciones.ts        P3/P5, F4 (+ automatizaciones: fechaUltimoContacto, inactivo→ganado, recordatorio automático)
  recordatorios.ts        F9, F10
  users.ts                P9/P10 — el flujo de invitación por email queda como TODO, ver el propio archivo
  dashboard.ts            P1 — KPIs (F12) y conteo de inactivos (F11)

src/
  middleware.ts            Protege todas las rutas salvo /login (@convex-dev/auth)
  app/
    (auth)/login/          P8
    (app)/                 Shell autenticado (Sidebar/TopNav/BottomNav) + P1, P2, P3 ([clienteId]), P6, P7, P9, P10
    globals.css             Tokens de diseño (@theme) + utilidades de tipografía (text-heading-md, text-body-sm...)
  components/
    ui/                    Primitivas: Button, Badge, Card, Avatar, Input, Sheet
    layout/                Sidebar, TopNav, BottomNav
    clientes/               ClienteFormSheet (P4)
    interacciones/          InteraccionFormSheet (P5)
    recordatorios/          RecordatorioFormSheet (F9)
    pipeline/               FaseSelector + MotivoPerdidaDialog (F16)
  lib/
    constants.ts            Enums (fases, prioridad, canal, rol...) — deben coincidir siempre con convex/schema.ts y el PRD
    utils.ts                 cn() (clsx + tailwind-merge)
```

P4 (Nuevo/Editar cliente), P5 (Registrar interacción) y F9 (Recordatorio) no son rutas — son overlays (`Sheet`) que se abren sobre P2/P3/P6, tal y como especifica el PRD sección 8.

## Qué falta a propósito (decisiones pendientes, no bugs)

- **Invitación de usuarios por email** (P9 "Nuevo usuario"): falta elegir proveedor de envío de emails y estrategia de token. Ver TODO en `convex/users.ts`.
- **Cambiar contraseña** (P10): la UI está pendiente de construir sobre las acciones de `@convex-dev/auth`.
- **Recuperación de contraseña** ("¿Olvidaste tu contraseña?" en P8): sin pantalla de reseteo diseñada todavía (ver PRD, P8).
- Los componentes de pantalla están conectados a Convex y funcionan, pero **no son pixel-perfect** contra los `.dc.html` de `design/` — ese ajuste fino es el siguiente paso, pantalla a pantalla.

## Desplegar

**Convex:** `npx convex deploy` (producción) — genera las credenciales para `CONVEX_DEPLOY_KEY`.

**Railway:** conecta el repo de GitHub, añade las variables de entorno (`NEXT_PUBLIC_CONVEX_URL` y las que pida tu deployment de Convex), y despliega — `railway.json` ya fija `npm run build` / `npm run start`. Railway asigna `$PORT` automáticamente; Next.js lo respeta sin configuración adicional.
