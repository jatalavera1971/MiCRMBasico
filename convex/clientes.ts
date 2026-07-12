import { query } from "./_generated/server";
import { listarClientesInactivos as listarClientesInactivosModel } from "./model/clientes";

// Pública y sin autenticación/scoping por usuario: login (JOS-60/61) no está
// construido todavía. No desplegar esta app en ningún sitio público hasta que
// exista auth real — ver README.md.
export const listarClientesInactivos = query({
  args: {},
  handler: async (ctx) => {
    return listarClientesInactivosModel(ctx);
  },
});
