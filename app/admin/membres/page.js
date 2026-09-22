import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AdminMemberRow from "@/components/AdminMemberRow";

export default async function AdminMembresPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  if (session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const pendingMembers = await prisma.member.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    omit: { passwordHash: true },
  });

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Inscriptions en attente
        </h1>
        <Link
          href="/admin/membres/tous"
          className="text-sm text-brand hover:underline"
        >
          Voir tous les membres &rarr;
        </Link>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        {pendingMembers.length} inscription
        {pendingMembers.length !== 1 ? "s" : ""} à valider.
      </p>

      {pendingMembers.length === 0 ? (
        <p className="mt-8 text-center text-gray-500">
          Aucune inscription en attente.
        </p>
      ) : (
        <table className="mt-6 w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
              <th className="py-2 pr-4 font-medium">Compte</th>
              <th className="py-2 pr-4 font-medium">Type</th>
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {pendingMembers.map((member) => (
              <AdminMemberRow key={member.id} member={member} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
