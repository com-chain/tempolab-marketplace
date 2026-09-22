// Logger structuré : écrit du JSON sur stdout/stderr (visible dans les logs
// Vercel) et, pour les erreurs, garde aussi une copie en base (ErrorLog) pour
// qu'un admin puisse les consulter depuis le dashboard sans accès au serveur.
import { prisma } from "@/lib/prisma";

function write(level, message, context) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };
  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export function logInfo(message, context) {
  write("info", message, context);
}

export function logWarn(message, context) {
  write("warn", message, context);
}

// `error` peut être une Error, une string, ou une valeur `unknown` (cas de
// onRequestError). `context` peut inclure path/method/routeType/metadata.
export async function logError(error, context = {}) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  write("error", message, { stack, ...context });

  try {
    await prisma.errorLog.create({
      data: {
        message: message.slice(0, 2000),
        stack: stack ? stack.slice(0, 5000) : null,
        path: context.path || null,
        method: context.method || null,
        routeType: context.routeType || null,
        metadata: context.metadata || undefined,
      },
    });
  } catch (dbError) {
    // Ne jamais casser la requête d'origine à cause d'un souci de logging.
    console.error(
      JSON.stringify({
        level: "error",
        message: "Échec de l'écriture dans ErrorLog",
        cause: dbError instanceof Error ? dbError.message : String(dbError),
        timestamp: new Date().toISOString(),
      })
    );
  }
}
