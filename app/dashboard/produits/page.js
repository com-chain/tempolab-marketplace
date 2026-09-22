import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProductListRow from "@/components/ProductListRow";

export default async function MyProductsPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const products = (
    await prisma.product.findMany({
      where: { ownerId: session.user.id },
      orderBy: { createdAt: "desc" },
    })
  ).map((product) => ({ ...product, price: Number(product.price) }));

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <Link href="/dashboard" className="text-sm text-gray-500 hover:underline">
        &larr; Mon espace
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mes produits</h1>
        <Link
          href="/dashboard/produits/nouveau"
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          + Nouveau produit
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-8 text-center text-gray-500">
          Vous n&apos;avez pas encore publié de produit.
        </p>
      ) : (
        <table className="mt-6 w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
              <th className="py-2 pr-4 font-medium">Produit</th>
              <th className="py-2 pr-4 font-medium">Prix</th>
              <th className="py-2 pr-4 font-medium">Qté</th>
              <th className="py-2 pr-4 font-medium">Livraison</th>
              <th className="py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <ProductListRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
