# Vibe CRM

Estructura base de la aplicación: Next.js (App Router, TypeScript) + Tailwind CSS v4. El paquete `convex` está instalado y listo para conectarse a Convex, pero todavía sin configurar (sin esquema, sin proveedor, sin funciones) — eso, y las pantallas del PRD, se construyen poco a poco a partir de las tareas de Linear (equipo `Joss`, proyectos `CRM-MVP` y `CRM-RESTOPRD`).

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Conectar Convex (cuando toque)

```bash
npx convex dev
```

La primera vez abre el navegador para crear/enlazar el proyecto en tu cuenta de Convex y genera `.env.local` con `CONVEX_DEPLOYMENT` y `NEXT_PUBLIC_CONVEX_URL` (ver `.env.example`).

## Desplegar

- **Railway**: conecta el repo de GitHub; `railway.json` ya fija `npm run build` / `npm run start`. Railway asigna `$PORT` automáticamente.
- **Convex**: `npx convex deploy` para producción.

## Referencias del proyecto

- PRD: página "📋 CRM-PRD" en Notion.
- Tareas: Linear, equipo `Joss`, proyectos `CRM-MVP` (funciones del MVP) y `CRM-RESTOPRD` (resto de funciones, por fases).
- Diseño: `design/uploads/CRM Login para negocios digitales/*.dc.html` (una maqueta por pantalla) y `design/design.md` (design system: colores, tipografía, espaciado).
