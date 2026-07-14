// ⚠️ Borra TODOS los clientes y recordatorios existentes en el deployment antes de
// sembrar 600 clientes sintéticos para el diagnóstico de rendimiento de JOS-31 (P2
// lista+buscador, alcance parcial — ver plan). Dos guardas antes de tocar nada:
// el argumento `confirm` debe coincidir exactamente, y el conteo actual de
// `clientes` debe ser 6 (línea base de seedDemoData) o 600 (una corrida anterior
// de este mismo seed) — cualquier otro conteo aborta, para no arrasar por
// accidente un deployment con datos reales (p.ej. prod, que ya tiene un cliente
// real creado vía el formulario público). Esta guarda no es absoluta: la
// protección principal es ejecutar SIEMPRE con `--deployment dev` explícito,
// nunca `--prod` ni el default ambiguo.
import { ConvexError, v } from "convex/values";
import { internalMutation } from "./_generated/server";

const DAY_MS = 24 * 60 * 60 * 1000;
const TOTAL = 600;
const CONFIRM_TOKEN = "BORRAR-DEV-600";
const CONTEOS_SEGUROS = [6, 600];

function daysAgoMs(days: number): number {
  return Date.now() - days * DAY_MS;
}

const NOMBRES = [
  "Lucía", "Hugo", "Martina", "Mateo", "Sofía", "Daniel", "Valeria", "Alejandro",
  "Paula", "Pablo", "Carmen", "Diego", "Elena", "Marcos", "Julia", "Adrián",
  "Claudia", "Álvaro", "Noa", "Javier", "Irene", "Rubén", "Aitana", "Nicolás",
  "Sara", "Iván", "Alba", "Óscar", "Marta", "Gonzalo",
];

const APELLIDOS = [
  "García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez",
  "Pérez", "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno",
  "Álvarez", "Romero", "Alonso", "Gutiérrez", "Navarro", "Torres", "Domínguez",
  "Vázquez", "Ramos", "Gil", "Serrano", "Blanco", "Suárez", "Molina", "Ortega",
];

const EMPRESAS = [
  "Mipymes SL", "TechCorp SA", "Creativa IO", "Ruiz Asociados", "Estudio Diseño",
  "Agencia Digital", "Norte Consulting", "Bit y Bloque", "Verde Studio",
  "Llanos Software", "Aula Abierta", "Puente Data",
];

// 20 posiciones = 35% lead / 15% cualificacion / 15% primera_llamada /
// 15% propuesta_enviada / 10% negociacion / 10% cerrado — reinterpretación de la
// distribución de JOS-31 (que usa nombres de fase de una versión anterior del
// PRD) sobre las 6 fases reales del schema actual (decisión 3 del plan).
const FASES = [
  "lead", "lead", "lead", "lead", "lead", "lead", "lead",
  "cualificacion", "cualificacion", "cualificacion",
  "primera_llamada", "primera_llamada", "primera_llamada",
  "propuesta_enviada", "propuesta_enviada", "propuesta_enviada",
  "negociacion", "negociacion",
  "cerrado", "cerrado",
] as const;

const CANALES = ["telefono", "whatsapp", "email", "reunion"] as const;

function slug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

export const seedPerfData = internalMutation({
  args: { confirm: v.string() },
  handler: async (ctx, args) => {
    if (args.confirm !== CONFIRM_TOKEN) {
      throw new ConvexError(
        `Falta confirmación explícita: pasa {"confirm":"${CONFIRM_TOKEN}"}.`,
      );
    }

    const actuales = await ctx.db.query("clientes").collect();
    if (!CONTEOS_SEGUROS.includes(actuales.length)) {
      throw new ConvexError(
        `Aborta: la tabla clientes tiene ${actuales.length} filas, un tamaño no ` +
          `reconocido como estado seguro de dev (6=demo, 600=corrida anterior de ` +
          `este seed). Puede ser prod u otro estado con datos reales — revisar ` +
          `manualmente antes de forzar.`,
      );
    }

    for (const doc of await ctx.db.query("recordatorios").collect()) {
      await ctx.db.delete(doc._id);
    }
    for (const doc of actuales) {
      await ctx.db.delete(doc._id);
    }

    // Índice i: 0 = más antiguo (fecha_alta más lejana), TOTAL-1 = más reciente.
    // Con listarClientes ordenando by_fecha_alta desc + take(500), los índices
    // 0-99 ("clientes 1-100") quedan fuera; 100-599 ("101-600") quedan dentro.
    for (let i = 0; i < TOTAL; i++) {
      const nombrePila = NOMBRES[i % NOMBRES.length];
      const apellido = APELLIDOS[Math.floor(i / NOMBRES.length) % APELLIDOS.length];
      const nombre = `${nombrePila} ${apellido}`;
      const mod10 = i % 10;

      await ctx.db.insert("clientes", {
        nombre,
        empresa: mod10 === 9 ? undefined : EMPRESAS[i % EMPRESAS.length],
        fase: FASES[i % FASES.length],
        // ~10% nunca contactados (undefined); el resto entre 1 y 60 días atrás,
        // mezclando casos dentro y fuera de la ventana de 7 días de JOS-25.
        fecha_ultimo_contacto: mod10 === 0 ? undefined : daysAgoMs((i % 60) + 1),
        email: `${slug(nombrePila)}.${slug(apellido)}${i}@example.com`,
        telefono: `6${String(100000 + i).padStart(8, "0")}`,
        prioridad: mod10 < 2 ? "alta" : mod10 < 7 ? "media" : "baja",
        fecha_alta: daysAgoMs(TOTAL - i),
        canal_preferido: CANALES[i % CANALES.length],
      });
    }

    return { inserted: TOTAL };
  },
});
