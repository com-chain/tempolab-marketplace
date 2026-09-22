import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/ProductForm";

export default async function AdminEditProductPage({ params }) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  if (session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    notFound();
  }

  const members = await prisma.member.findMany({
    where: { status: "APPROVED" },
    orderBy: { username: "asc" },
    select: { id: true, username: true, companyName: true },
  });

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <Link
        href="/admin/produits"
        className="text-sm text-gray-500 hover:underline"
      >
        &larr; Tous les produits
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">
        Modifier le produit
      </h1>

      <ProductForm
        product={{ ...product, price: Number(product.price) }}
        members={members}
        redirectTo="/admin/produits"
      />
    </div>
  );
}
