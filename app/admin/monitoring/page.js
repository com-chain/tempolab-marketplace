import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ACTION_LABELS = {
  MEMBER_REGISTERED: "Inscripción",
  MEMBER_APPROVED: "Cuenta aprobada",
  MEMBER_REJECTED: "Cuenta rechazada",
  PRODUCT_CREATED: "Producto creado",
  PRODUCT_UPDATED: "Producto modificado",
  PRODUCT_REASSIGNED: "Producto reasignado",
  PRODUCT_DELETED: "Producto eliminado",
  ORDER_CREATED: "Pedido creado",
  ORDER_STATUS_CHANGED: "Estado del pedido modificado",
};

function formatDate(date) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
}

// Aisladas fuera del cuerpo del componente: Date.now() es una llamada impura
// que la regla react-hooks/purity prohíbe directamente en el render.
async function checkDatabaseHealth() {
  const startedAt = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "up", latencyMs: Date.now() - startedAt };
  } catch {
    return { status: "down", latencyMs: Date.now() - startedAt };
  }
}

function oneDayAgo() {
  return new Date(Date.now() - 24 * 60 * 60 * 1000);
}

export default async function AdminMonitoringPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  if (session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const [{ status: dbStatus, latencyMs: dbLatencyMs }, activity, errors, activityCount, errorCount24h] =
    await Promise.all([
      checkDatabaseHealth(),
      prisma.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
          actor: { select: { username: true, companyName: true } },
        },
      }),
      prisma.errorLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.activityLog.count(),
      prisma.errorLog.count({
        where: { createdAt: { gte: oneDayAgo() } },
      }),
    ]);

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <Link href="/dashboard" className="text-sm text-gray-500 hover:underline">
        &larr; Mi cuenta
      </Link>

      <h1 className="mt-2 text-2xl font-bold text-gray-900">Monitorización</h1>
      <p className="mt-1 text-sm text-gray-500">
        Registro de actividad, errores del servidor y estado del sistema.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold uppercase text-gray-500">
            Estado del sistema
          </h2>
          <p className="mt-2 flex items-center gap-2 text-lg font-semibold">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                dbStatus === "up" ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {dbStatus === "up" ? "Operativo" : "Degradado"}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Base de datos: {dbStatus} ({dbLatencyMs} ms) · ver también{" "}
            <a href="/api/health" className="text-brand hover:underline">
              /api/health
            </a>
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold uppercase text-gray-500">
            Actividad registrada
          </h2>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {activityCount} eventos
          </p>
          <p className="mt-1 text-xs text-gray-500">Desde el inicio.</p>
        </div>

        <div className="rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold uppercase text-gray-500">
            Errores (24h)
          </h2>
          <p
            className={`mt-2 text-lg font-semibold ${
              errorCount24h > 0 ? "text-red-600" : "text-gray-900"
            }`}
          >
            {errorCount24h}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {errorCount24h > 0 ? "Revisar más abajo." : "Sin errores recientes."}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900">
          Registro de actividad
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Los {activity.length} eventos más recientes.
        </p>

        {activity.length === 0 ? (
          <p className="mt-6 text-center text-gray-500">Sin actividad.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                  <th className="py-2 pr-4 font-medium">Fecha</th>
                  <th className="py-2 pr-4 font-medium">Acción</th>
                  <th className="py-2 pr-4 font-medium">Por</th>
                  <th className="py-2 font-medium">Detalles</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-100">
                    <td className="whitespace-nowrap py-2 pr-4 text-gray-500">
                      {formatDate(entry.createdAt)}
                    </td>
                    <td className="whitespace-nowrap py-2 pr-4">
                      <span className="rounded-full bg-brand-light px-2 py-0.5 text-xs font-medium text-brand">
                        {ACTION_LABELS[entry.action] || entry.action}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-2 pr-4 text-gray-700">
                      {entry.actor?.companyName || entry.actor?.username || "—"}
                    </td>
                    <td className="py-2 text-gray-500">
                      {entry.metadata
                        ? Object.entries(entry.metadata)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(" · ")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900">
          Errores del servidor
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Los {errors.length} errores más recientes (capturados
          automáticamente).
        </p>

        {errors.length === 0 ? (
          <p className="mt-6 text-center text-gray-500">
            No hay errores registrados.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                  <th className="py-2 pr-4 font-medium">Fecha</th>
                  <th className="py-2 pr-4 font-medium">Mensaje</th>
                  <th className="py-2 pr-4 font-medium">Ruta</th>
                  <th className="py-2 font-medium">Método</th>
                </tr>
              </thead>
              <tbody>
                {errors.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-100">
                    <td className="whitespace-nowrap py-2 pr-4 text-gray-500">
                      {formatDate(entry.createdAt)}
                    </td>
                    <td className="max-w-md truncate py-2 pr-4 text-red-600">
                      {entry.message}
                    </td>
                    <td className="whitespace-nowrap py-2 pr-4 text-gray-500">
                      {entry.path || "—"}
                    </td>
                    <td className="whitespace-nowrap py-2 text-gray-500">
                      {entry.method || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
