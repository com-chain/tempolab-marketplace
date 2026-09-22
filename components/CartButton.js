"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/panier"
      className="relative rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-brand-light hover:text-brand"
    >
      Panier
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
