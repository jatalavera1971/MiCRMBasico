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

⚠️ **Desplegado en Railway sin autenticación — riesgo aceptado explícitamente, no un descuido.** Las funciones de Convex (`clientes`, `recordatorios`, `interacciones`, `dashboard`) son públicas y no tienen autenticación/autorización. Login real (JOS-60/61) todavía no existe. Alcance concreto de lo que expone/permite hoy cualquiera con la URL de la app:
- **Leer**: `listarClientes` (JOS-10/13/45, 13 jul 2026) devuelve `nombre`, `email`, `telefono`, `empresa`, `canal_preferido`, `fase`, `prioridad` y `fecha_ultimo_contacto` de hasta 500 clientes; `listarClientesInactivos` devuelve `nombre`/`empresa`/`fecha_ultimo_contacto` de los inactivos; `obtenerCliente` (JOS-11, 15 jul 2026) devuelve esos mismos campos de un cliente concreto por id — no es un salto de riesgo nuevo, ya que los ids son públicos desde `listarClientes`, se documenta para que la lista quede completa. Ninguna expone el documento completo, pero sí más campos (incluido `telefono` y la actividad comercial reciente) que antes de JOS-10.
- **Escribir**: `crearCliente` (JOS-12) permite crear clientes nuevos sin límite ni verificación — mitigado solo con límites de longitud server-side (nombre/email/empresa/teléfono), sin rate-limit ni captcha.
- **Actualizar recordatorios**: `marcarComoHecho` permite marcar cualquier recordatorio como hecho conociendo su id.
- **Actualizar clientes (JOS-11, 15 jul 2026)**: `actualizarCliente`, `actualizarCanalPreferido` y `actualizarPrioridad` permiten a cualquiera con acceso a la app modificar la PII (nombre/email/empresa/teléfono), el canal preferido o la prioridad de cualquier cliente conociendo su id, sin autenticación. Salto de riesgo mayor que crear/leer: antes solo se podía añadir datos o marcar un recordatorio hecho, ahora se puede sobrescribir cualquier cliente ya existente.
- **Eliminar clientes (JOS-11, 15 jul 2026)**: `eliminarCliente` borra permanentemente cualquier cliente y, en cascada, todos sus `recordatorios` e `interacciones`, sin autenticación ni confirmación más allá de la del propio navegador. Es la mutation pública más destructiva del proyecto hasta ahora — riesgo ampliado aceptado explícitamente el 15 jul 2026 (ronda de revisión previa a la implementación), mismo patrón que el resto de esta sección.
- **Interacciones (JOS-18/19/20/21, 16 jul 2026)**: `crearInteraccion` permite a cualquiera con acceso a la app escribir notas de texto libre sobre las conversaciones con cualquier cliente (conociendo su id), y `listarInteracciones` permite leerlas — superficie nueva y más sensible que la PII de contacto ya expuesta, ya que el contenido es texto libre sin estructura. Riesgo ampliado aceptado explícitamente el 16 jul 2026 (ronda de revisión previa a la implementación), con estas mitigaciones técnicas server-side (nunca solo en el formulario del cliente): `notas` máximo 2000 caracteres, `proximo_paso_texto` máximo 200, la fecha de la interacción se rechaza si es futura (margen 24h) o anterior al alta del cliente, `proximo_paso_fecha` se valida como fecha de calendario real, y `listarInteracciones` está acotada a las 500 interacciones más recientes por cliente (mismo cap que `listarClientes`, evita que la escritura pública sin límite pueda inflar el historial de un cliente concreto sin control).
- **Límite funcional, no de seguridad**: la búsqueda de `/clientes` (JOS-13) filtra en el navegador sobre los hasta 500 clientes que devuelve `listarClientes` — si la tabla creciera más allá de eso (posible precisamente por la escritura pública sin límite), la búsqueda dejaría de cubrir el resto sin que se note. Revisar al abordar JOS-31 (QA de rendimiento 500+).
- **Límite funcional, no de seguridad (recordatorios, 16 jul 2026)**: `crearInteraccion` puede crear recordatorios públicos vía "próximo paso" — antes de JOS-18/21 esta tabla solo crecía por seeds internos, nunca por una mutation pública. `listarSeguimientosHoy` (P1) y `obtenerProximoRecordatorio` (ficha) están acotadas a 500 filas (`.take(500)`) para no degradar esas pantallas ante un volumen inflado; si el total de recordatorios pendientes superara ese límite, ambas dejarían de ser exhaustivas sin que se note. Queda como deuda un índice compuesto si F9 (JOS-22) hace crecer el uso real de recordatorios.

Se decidió conscientemente activar el despliegue de todos modos (2026-07-12, riesgo de escritura pública reafirmado el 13-07-2026 al ampliar la lectura, el 15-07-2026 al añadir actualización y borrado permanente de clientes, y el 16-07-2026 al añadir notas de texto libre sobre clientes); en cuanto exista JOS-60/61, hay que revisar/rotar credenciales y cerrar el acceso público hasta entonces si se detecta uso indebido. Railway está conectado a este repo por GitHub para auto-deploy — cualquier push a `main` dispara un despliegue real.

- **Railway**: `railway.json` ejecuta `npx convex deploy --cmd 'npm run build'` (despliega las funciones de Convex a producción, fijando `NEXT_PUBLIC_CONVEX_URL` para el build) y arranca con `npm run start`. Railway asigna `$PORT` automáticamente.
  - `convex/_generated` **sí se versiona en git** (siguiendo la recomendación oficial del propio `npx convex codegen --help`: "should be committed to the repo") — `--cmd` se ejecuta *antes* de que `convex deploy` regenere esa carpeta, así que si no estuviera commiteada, `npm run build` fallaría en cualquier clone limpio (incluido Railway) con `Module not found` sobre `convex/_generated/api`. Si cambias el schema o las funciones, corre `npx convex codegen` (o `npx convex dev`) y commitea los cambios en `convex/_generated`.
  - **Requisito ya configurado:** deployment de producción de Convex creado (`diligent-chipmunk-930`, región `eu`) y `CONVEX_DEPLOY_KEY` puesto en el proyecto de Railway (nunca en un fichero versionado — se generó con `npx convex deployment token create ... --prod` y se pasó directo a `railway variable set --stdin`, sin exponerlo en ningún log).
- **Convex**: `npx convex deploy` para producción (mismo comando que usa Railway) — la primera vez, crea antes el deployment de producción en la región correcta con `npx convex deployment create --type prod --region eu --default`.

## Referencias del proyecto

- PRD: página "📋 CRM-PRD" en Notion.
- Tareas: Linear, equipo `Joss`, proyectos `CRM-MVP` (funciones del MVP) y `CRM-RESTOPRD` (resto de funciones, por fases).
- Diseño: `design/CRM Prototype Paginas/` (prototipo React interactivo, un HTML de entrada por pantalla + lógica compartida en `shared/crm-app.js`) y `design/CRM Prototype Paginas/_ds_ref/` (tokens de diseño: color, tipografía, espaciado). No versionado en git (carpeta local/untracked); `design/design.md` es una versión anterior obsoleta, no usar.
