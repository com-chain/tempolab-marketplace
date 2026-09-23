import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md hover:border-brand/30"
    >
      <div className="relative">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.title}
            className="h-44 w-full rounded-t-xl object-cover"
          />
        ) : (
          <div className="flex h-44 w-full items-center justify-center rounded-t-xl bg-gray-100 text-sm text-gray-400">
            Sin imagen
          </div>
        )}
        <span className="absolute left-2 top-2 w-fit rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-brand shadow-sm">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-semibold text-gray-900 group-hover:underline">
          {product.title}
        </h3>
        <p className="text-sm text-gray-500">{product.location}</p>
        <p className="text-xs text-gray-500">
          Ofrecido por{" "}
          <span className="font-medium text-gray-700">
            {product.owner.companyName || product.owner.username}
          </span>
        </p>
        <p className="mt-auto pt-2 font-semibold text-brand">
          {product.price} <span className="text-xs font-bold uppercase tracking-wide">{product.currency}</span>
        </p>
        <AddToCartButton productId={product.id} className="mt-2 rounded-full bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark" />
      </div>
    </Link>
  );
}
