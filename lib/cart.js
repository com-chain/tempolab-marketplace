const CART_KEY = "smartketplace_cart";

export function readCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function writeCart(items) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // Stockage indisponible (mode privé, etc.) — on ignore silencieusement.
  }
}
