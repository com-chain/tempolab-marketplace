import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";

const TYPE_LABELS = {
  PHYSICAL: "Produit physique",
  DIGITAL: "Produit numérique",
  SERVICE: "Service",
};

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { owner: { select: { username: true, companyName: true } } },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        &larr; Retour à tous les produits
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.title}
            className="h-80 w-full rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-80 w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400">
            Pas d&apos;image
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="w-fit rounded-full bg-brand-light px-2 py-0.5 text-xs font-medium text-brand">
              {product.category}
            </span>
            <span className="w-fit rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {TYPE_LABELS[product.type]}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {product.title}
          </h1>
          <p className="text-sm text-gray-500">{product.location}</p>
          <p className="text-sm text-gray-500">
            Vendu par{" "}
            <span className="font-medium text-gray-700">
              {product.owner.companyName || product.owner.username}
            </span>
          </p>
          <p className="text-2xl font-semibold text-brand">
            {Number(product.price)} {product.currency}
          </p>
          <p className="text-gray-700">{product.description}</p>

          {product.quantity > 0 && (
            <AddToCartButton
              productId={product.id}
              className="w-fit rounded-md bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-dark"
            />
          )}

          <div className="mt-2 flex flex-col gap-1 border-t border-gray-100 pt-3 text-sm text-gray-600">
            <p>
              {product.quantity > 0
                ? `${product.quantity} en stock`
                : "Rupture de stock"}
            </p>
            <p>
              {product.shippingAvailable
                ? `Livraison possible${product.shippingDelay ? ` — ${product.shippingDelay}` : ""}`
                : "Pas de livraison — retrait uniquement"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
