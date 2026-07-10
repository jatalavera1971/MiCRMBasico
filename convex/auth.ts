import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

// P8 (Login) usa email + contraseña. El alta de cuentas no es pública: las
// crea Marta desde P9 y cada persona invitada define su propia contraseña al
// aceptar la invitación (ver convex/users.ts::invite). Password admite ese
// flujo porque el signIn inicial de una cuenta invitada puede ejecutarse
// desde el enlace de invitación con flow "signUp" una única vez.
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
});
