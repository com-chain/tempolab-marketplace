import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BuyerOrderRow from "@/components/BuyerOrderRow";

export default async function MyPurchasesPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { buyerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { title: true } },
      seller: { select: { username: true } },
    },
  });

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <Link href="/dashboard" className="text-sm text-gray-500 hover:underline">
        &larr; Mon espace
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">Mes achats</h1>

      {orders.length === 0 ? (
        <p className="mt-8 text-center text-gray-500">
          Vous n&apos;avez pas encore fait de demande d&apos;achat.
        </p>
      ) : (
        <table className="mt-6 w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
              <th className="py-2 pr-4 font-medium">Produit</th>
              <th className="py-2 pr-4 font-medium">Qté</th>
              <th className="py-2 pr-4 font-medium">Statut</th>
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <BuyerOrderRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
