// Capture automatiquement toute erreur serveur non gérée (rendu, route
// handler, server action) via le hook natif Next.js onRequestError, et
// l'enregistre dans ErrorLog + les logs structurés. Voir lib/logger.js.
export async function register() {}

export async function onRequestError(error, request, context) {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { logError } = await import("@/lib/logger");
  await logError(error, {
    path: request.path,
    method: request.method,
    routeType: context.routeType,
    metadata: { renderSource: context.renderSource },
  });
}
