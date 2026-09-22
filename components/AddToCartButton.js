"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";

export default function AddToCartButton({ productId, className }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    addItem(productId, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ||
        "rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark"
      }
    >
      {added ? "Ajouté ✓" : "Ajouter au panier"}
    </button>
  );
}
