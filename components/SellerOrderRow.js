"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OrderStatusBadge from "@/components/OrderStatusBadge";

export default function SellerOrderRow({ order }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function updateStatus(status) {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        setIsSubmitting(false);
        return;
      }
      router.refresh();
    } catch {
      setIsSubmitting(false);
    }
  }

  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 pr-4">
        <Link
          href={`/products/${order.productId}`}
          className="font-medium text-gray-900 hover:underline"
        >
          {order.product.title}
        </Link>
        <div className="text-xs text-gray-500">
          Acheteur : {order.buyer.username}
        </div>
        {order.message && (
          <div className="mt-1 text-xs italic text-gray-500">
            &laquo; {order.message} &raquo;
          </div>
        )}
      </td>
      <td className="py-3 pr-4 text-sm text-gray-600">{order.quantity}</td>
      <td className="py-3 pr-4">
        <OrderStatusBadge status={order.status} />
      </td>
      <td className="py-3 pr-4 text-sm text-gray-500">
        {new Date(order.createdAt).toLocaleDateString("fr-CH")}
      </td>
      <td className="py-3">
        {order.status === "PENDING" && (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => updateStatus("ACCEPTED")}
              className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-60"
            >
              Accepter
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => updateStatus("DECLINED")}
              className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              Refuser
            </button>
          </div>
        )}
        {order.status === "ACCEPTED" && (
          <div className="flex justify-end">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => updateStatus("COMPLETED")}
              className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-60"
            >
              Marquer terminé
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
