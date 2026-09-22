import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/ProductForm";

export default async function AdminNewProductPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  if (session.user?.role !== "ADMIN") {
    redirect("/");
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
        Ajouter un produit pour un membre
      </h1>

      <ProductForm members={members} redirectTo="/admin/produits" />
    </div>
  );
}
