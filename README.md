# Vibe CRM

Estructura base de la aplicación: Next.js (App Router, TypeScript) + Tailwind CSS v4. El paquete `convex` está instalado y listo para conectarse a Convex, pero todavía sin configurar (sin esquema, sin proveedor, sin funciones) — eso, y las pantallas del PRD, se construyen poco a poco a partir de las tareas de Linear (equipo `Joss`, proyectos `CRM-MVP` y `CRM-RESTOPRD`).

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Convex

Ya conectado al proyecto **vibe-crm** (equipo `jose-angel-talavera-martinez` en Convex), dev deployment (por defecto) en la región **eu (Irlanda)** — la más cercana a España que ofrece Convex (no tienen región España; las únicas opciones son `eu` y `us`). `.env.local` tiene las credenciales del dev deployment (no se versiona). Para desarrollar contra Convex:

```bash
npx convex dev
```

Déjalo corriendo en una terminal aparte mientras trabajas — sincroniza el esquema y las funciones en caliente en cuanto empecemos a añadirlas a `convex/`. Panel del proyecto: https://dashboard.convex.dev/t/jose-angel-talavera-martinez/vibe-crm

## Desplegar

⚠️ **Desplegado en Railway sin autenticación — riesgo aceptado explícitamente, no un descuido.** Las funciones de Convex (`clientes`, `recordatorios`, `dashboard`) son públicas y no tienen autenticación/autorización — cualquiera con la URL de la app puede leer datos de clientes y marcar recordatorios como hechos. Login real (JOS-60/61) todavía no existe. Se decidió conscientemente activar el despliegue de todos modos (2026-07-12); en cuanto exista JOS-60/61, hay que revisar/rotar credenciales y cerrar el acceso público hasta entonces si se detecta uso indebido. Railway está conectado a este repo por GitHub para auto-deploy — cualquier push a `main` dispara un despliegue real.

- **Railway**: `railway.json` ejecuta `npx convex deploy --cmd 'npm run build'` (despliega las funciones de Convex a producción, fijando `NEXT_PUBLIC_CONVEX_URL` para el build) y arranca con `npm run start`. Railway asigna `$PORT` automáticamente.
  - `convex/_generated` **sí se versiona en git** (siguiendo la recomendación oficial del propio `npx convex codegen --help`: "should be committed to the repo") — `--cmd` se ejecuta *antes* de que `convex deploy` regenere esa carpeta, así que si no estuviera commiteada, `npm run build` fallaría en cualquier clone limpio (incluido Railway) con `Module not found` sobre `convex/_generated/api`. Si cambias el schema o las funciones, corre `npx convex codegen` (o `npx convex dev`) y commitea los cambios en `convex/_generated`.
  - **Requisito ya configurado:** deployment de producción de Convex creado (`diligent-chipmunk-930`, región `eu`) y `CONVEX_DEPLOY_KEY` puesto en el proyecto de Railway (nunca en un fichero versionado — se generó con `npx convex deployment token create ... --prod` y se pasó directo a `railway variable set --stdin`, sin exponerlo en ningún log).
- **Convex**: `npx convex deploy` para producción (mismo comando que usa Railway) — la primera vez, crea antes el deployment de producción en la región correcta con `npx convex deployment create --type prod --region eu --default`.

## Referencias del proyecto

- PRD: página "📋 CRM-PRD" en Notion.
- Tareas: Linear, equipo `Joss`, proyectos `CRM-MVP` (funciones del MVP) y `CRM-RESTOPRD` (resto de funciones, por fases).
- Diseño: `design/CRM Prototype Paginas/` (prototipo React interactivo, un HTML de entrada por pantalla + lógica compartida en `shared/crm-app.js`) y `design/CRM Prototype Paginas/_ds_ref/` (tokens de diseño: color, tipografía, espaciado). No versionado en git (carpeta local/untracked); `design/design.md` es una versión anterior obsoleta, no usar.
