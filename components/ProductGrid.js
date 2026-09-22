import ProductCard from "@/components/ProductCard";

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <p className="mx-auto max-w-6xl px-4 py-12 text-center text-gray-500 sm:px-6">
        Aucun produit ne correspond à votre recherche.
      </p>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
