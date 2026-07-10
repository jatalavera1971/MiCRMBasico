import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

// P8 es la única ruta pública (login). Todo lo demás requiere sesión — ver
// PRD sección 8, "P8 es el punto de entrada para usuarios no autenticados".
const isPublicRoute = createRouteMatcher(["/login"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const authenticated = await convexAuth.isAuthenticated();

  if (!isPublicRoute(request) && !authenticated) {
    return nextjsMiddlewareRedirect(request, "/login");
  }
  if (isPublicRoute(request) && authenticated) {
    return nextjsMiddlewareRedirect(request, "/inicio");
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
