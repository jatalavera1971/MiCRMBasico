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

⚠️ **No desplegar en Railway ni en ninguna URL pública todavía — y ahora sí funcionaría si se intenta.** Las funciones de Convex (`clientes`, `recordatorios`, `dashboard`) son públicas y no tienen autenticación/autorización — cualquiera con la URL de la app llegaría a la URL de Convex y podría leer datos de clientes y marcar recordatorios como hechos. Esto se queda así hasta que exista login real (tareas de Linear JOS-60/61), o hasta que se decida conscientemente asumir el riesgo. Hasta entonces, solo se ejecuta en local con `npm run dev`. Railway está conectado a este repo por GitHub para auto-deploy — **cualquier push a `main` puede disparar un despliegue real**, así que el push a este repo se retiene hasta recibir luz verde explícita.

- **Railway**: `railway.json` ejecuta `npx convex deploy --cmd 'npm run build'` (despliega las funciones de Convex a producción y regenera `convex/_generated` antes de compilar Next.js — necesario porque esa carpeta está en `.gitignore` y no existe en un clone limpio) y arranca con `npm run start`. Railway asigna `$PORT` automáticamente.
  - **Requisito pendiente antes de que este build funcione de verdad en Railway:** crear el deployment de producción de Convex (`npx convex deployment create --type prod --region eu --default` — si no, Convex lo provisiona en `us` por defecto) y configurar la variable de entorno `CONVEX_DEPLOY_KEY` (deploy key de producción, se genera desde el dashboard de Convex → Settings → Deploy Keys) directamente en el proyecto de Railway — nunca en un fichero versionado.
- **Convex**: `npx convex deploy` para producción (mismo comando que usa Railway) — la primera vez, crea antes el deployment de producción en la región correcta con `npx convex deployment create --type prod --region eu --default`.

## Referencias del proyecto

- PRD: página "📋 CRM-PRD" en Notion.
- Tareas: Linear, equipo `Joss`, proyectos `CRM-MVP` (funciones del MVP) y `CRM-RESTOPRD` (resto de funciones, por fases).
- Diseño: `design/CRM Prototype Paginas/` (prototipo React interactivo, un HTML de entrada por pantalla + lógica compartida en `shared/crm-app.js`) y `design/CRM Prototype Paginas/_ds_ref/` (tokens de diseño: color, tipografía, espaciado). No versionado en git (carpeta local/untracked); `design/design.md` es una versión anterior obsoleta, no usar.
