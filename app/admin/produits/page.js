import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AdminProductsTable from "@/components/AdminProductsTable";

export default async function AdminProductsPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  if (session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const products = (
    await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { username: true, companyName: true } } },
    })
  ).map((product) => ({ ...product, price: Number(product.price) }));

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <Link href="/dashboard" className="text-sm text-gray-500 hover:underline">
        &larr; Mon espace
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Tous les produits
        </h1>
        <Link
          href="/admin/produits/nouveau"
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          + Ajouter pour un membre
        </Link>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Tous les produits publiés par tous les membres.
      </p>

      <AdminProductsTable products={products} />
    </div>
  );
}
