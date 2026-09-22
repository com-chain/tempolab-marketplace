"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductListRow({ product }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Supprimer "${product.title}" ? Cette action est définitive.`)) {
      return;
    }
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        setIsDeleting(false);
        return;
      }
      router.refresh();
    } catch {
      setIsDeleting(false);
    }
  }

  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 pr-4">
        <div className="font-medium text-gray-900">{product.title}</div>
        <div className="text-xs text-gray-500">{product.category}</div>
      </td>
      <td className="py-3 pr-4 text-sm text-gray-600">
        {product.price} {product.currency}
      </td>
      <td className="py-3 pr-4 text-sm text-gray-600">{product.quantity}</td>
      <td className="py-3 pr-4 text-sm text-gray-500">
        {product.shippingAvailable ? "Oui" : "Non"}
      </td>
      <td className="py-3">
        <div className="flex justify-end gap-2">
          <Link
            href={`/dashboard/produits/${product.id}`}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            Modifier
          </Link>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            Supprimer
          </button>
        </div>
      </td>
    </tr>
  );
}
