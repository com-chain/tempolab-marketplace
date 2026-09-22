"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const { items, updateQuantity, removeItem, clearCart } = useCart();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    const ids = items.map((item) => item.productId).join(",");
    fetch(`/api/products/batch?ids=${ids}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .finally(() => setIsLoading(false));
  }, [items]);

  const cartRows = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean);

  const total = cartRows.reduce(
    (sum, row) => sum + row.product.price * row.quantity,
    0
  );

  async function handleCheckout() {
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartRows.map((row) => ({
            productId: row.productId,
            quantity: row.quantity,
          })),
          message,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Une erreur est survenue.");
        setIsSubmitting(false);
        return;
      }
      clearCart();
      router.push("/dashboard/achats");
    } catch {
      setError("Une erreur est survenue. Réessayez.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">Panier</h1>

      {isLoading ? (
        <p className="mt-8 text-center text-gray-500">Chargement...</p>
      ) : cartRows.length === 0 ? (
        <div className="mt-8 text-center text-gray-500">
          <p>Votre panier est vide.</p>
          <Link href="/" className="mt-2 inline-block text-brand hover:underline">
            Voir les produits
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-3">
            {cartRows.map((row) => (
              <div
                key={row.productId}
                className="flex items-center gap-4 rounded-md border border-gray-200 p-3"
              >
                {row.product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.product.image}
                    alt={row.product.title}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded-md bg-gray-100" />
                )}
                <div className="flex-1">
                  <Link
                    href={`/products/${row.productId}`}
                    className="font-medium text-gray-900 hover:underline"
                  >
                    {row.product.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    Vendu par{" "}
                    {row.product.owner.companyName || row.product.owner.username}
                  </p>
                  <p className="text-sm font-semibold text-brand">
                    {row.product.price} {row.product.currency}
                  </p>
                </div>
                <input
                  type="number"
                  min="1"
                  max={row.product.quantity}
                  value={row.quantity}
                  onChange={(event) =>
                    updateQuantity(
                      row.productId,
                      Math.max(1, Number(event.target.value) || 1)
                    )
                  }
                  className="w-16 rounded-md border border-gray-300 px-2 py-1 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeItem(row.productId)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-lg font-semibold text-brand">
              {total.toFixed(2)} KKN/CHF
            </span>
          </div>

          <div className="mt-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message pour le(s) vendeur(s) (facultatif)
            </label>
            <textarea
              id="message"
              rows={3}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          {error && (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {sessionStatus === "unauthenticated" ? (
            <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <Link href="/login" className="font-medium underline">
                Connectez-vous
              </Link>{" "}
              pour valider votre demande.
            </p>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleCheckout}
              className="mt-6 w-full rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {isSubmitting ? "Envoi..." : "Envoyer la demande d'achat"}
            </button>
          )}
          <p className="mt-2 text-center text-xs text-gray-500">
            Ceci envoie une demande au(x) vendeur(s) — aucun paiement n&apos;est
            effectué sur le site. Vous vous arrangez ensuite directement avec
            le vendeur.
          </p>
        </>
      )}
    </div>
  );
}
