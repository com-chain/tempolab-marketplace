import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AdminAllMembersTable from "@/components/AdminAllMembersTable";

export default async function AdminAllMembersPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  if (session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const members = await prisma.member.findMany({
    orderBy: { createdAt: "desc" },
    omit: { passwordHash: true },
  });

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <Link
        href="/admin/membres"
        className="text-sm text-gray-500 hover:underline"
      >
        &larr; Inscripciones pendientes
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">
        Todos los miembros
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Todas las personas y organizaciones inscritas en el sitio.
      </p>

      <AdminAllMembersTable members={members} />
    </div>
  );
}
