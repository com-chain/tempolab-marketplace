"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminProductsTable({ products }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.owner.username.toLowerCase().includes(query)
    );
  }, [products, search]);

  async function handleDelete(product) {
    if (
      !confirm(
        `¿Eliminar "${product.title}" (${product.owner.username})? Esta acción es definitiva.`
      )
    ) {
      return;
    }
    setDeletingId(product.id);
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.refresh();
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar por título, categoría o vendedor..."
        className="mt-6 w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
      />

      <p className="mt-3 text-xs text-gray-500">
        {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-gray-500">No se encontró ningún producto.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                <th className="py-2 pr-4 font-medium">Producto</th>
                <th className="py-2 pr-4 font-medium">Vendedor</th>
                <th className="py-2 pr-4 font-medium">Precio</th>
                <th className="py-2 pr-4 font-medium">Cant.</th>
                <th className="py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-gray-900">
                      {product.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.category}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-600">
                    {product.owner.username}
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-600">
                    {product.price} {product.currency}
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-600">
                    {product.quantity}
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/produits/${product.id}`}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        disabled={deletingId === product.id}
                        onClick={() => handleDelete(product)}
                        className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
