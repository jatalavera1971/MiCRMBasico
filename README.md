# Vibe CRM

Estructura base de la aplicación: Next.js (App Router, TypeScript) + Tailwind CSS v4. El paquete `convex` está instalado y listo para conectarse a Convex, pero todavía sin configurar (sin esquema, sin proveedor, sin funciones) — eso, y las pantallas del PRD, se construyen poco a poco a partir de las tareas de Linear (equipo `Joss`, proyectos `CRM-MVP` y `CRM-RESTOPRD`).

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Convex

Ya conectado al proyecto **vibe-crm** (equipo `jose-angel-talavera-martinez` en Convex), dev deployment en la región **eu (Irlanda)** — la más cercana a España que ofrece Convex (no tienen región España; las únicas opciones son `eu` y `us`). `.env.local` tiene las credenciales del dev deployment (no se versiona). Para desarrollar contra Convex:

```bash
npx convex dev
```

Déjalo corriendo en una terminal aparte mientras trabajas — sincroniza el esquema y las funciones en caliente en cuanto empecemos a añadirlas a `convex/`. Panel del proyecto: https://dashboard.convex.dev/t/jose-angel-talavera-martinez/vibe-crm

## Desplegar

- **Railway**: conecta el repo de GitHub; `railway.json` ya fija `npm run build` / `npm run start`. Railway asigna `$PORT` automáticamente.
- **Convex**: `npx convex deploy` para producción — la primera vez, crea antes el deployment de producción en la región correcta con `npx convex deployment create --type prod --region eu --default` (si no, Convex podría provisionarlo en `us` por defecto).

## Referencias del proyecto

- PRD: página "📋 CRM-PRD" en Notion.
- Tareas: Linear, equipo `Joss`, proyectos `CRM-MVP` (funciones del MVP) y `CRM-RESTOPRD` (resto de funciones, por fases).
- Diseño: `design/uploads/CRM Login para negocios digitales/*.dc.html` (una maqueta por pantalla) y `design/design.md` (design system: colores, tipografía, espaciado).
