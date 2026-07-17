/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as clientes from "../clientes.js";
import type * as dashboard from "../dashboard.js";
import type * as interacciones from "../interacciones.js";
import type * as model_clientes from "../model/clientes.js";
import type * as model_interacciones from "../model/interacciones.js";
import type * as model_recordatorios from "../model/recordatorios.js";
import type * as model_validacionFechas from "../model/validacionFechas.js";
import type * as recordatorios from "../recordatorios.js";
import type * as seed from "../seed.js";
import type * as seedPerf from "../seedPerf.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  clientes: typeof clientes;
  dashboard: typeof dashboard;
  interacciones: typeof interacciones;
  "model/clientes": typeof model_clientes;
  "model/interacciones": typeof model_interacciones;
  "model/recordatorios": typeof model_recordatorios;
  "model/validacionFechas": typeof model_validacionFechas;
  recordatorios: typeof recordatorios;
  seed: typeof seed;
  seedPerf: typeof seedPerf;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
