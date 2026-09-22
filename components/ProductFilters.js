"use client";

import { useMemo, useState } from "react";

const TYPE_LABELS = {
  PHYSICAL: "Produit physique",
  DIGITAL: "Produit numérique",
  SERVICE: "Service",
};

export default function ProductFilters({ products, filters, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const sellers = useMemo(() => {
    const map = new Map();
    for (const product of products) {
      if (!map.has(product.owner.id)) {
        map.set(product.owner.id, {
          id: product.owner.id,
          label: product.owner.companyName || product.owner.username,
        });
      }
    }
    return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, [products]);

  const locations = useMemo(
    () => [...new Set(products.map((product) => product.location))].sort(),
    [products]
  );

  function update(field, value) {
    onChange({ ...filters, [field]: value });
  }

  const activeCount = [
    filters.minPrice,
    filters.maxPrice,
    filters.type,
    filters.shippingOnly ? "1" : "",
    filters.location,
    filters.sellerId,
  ].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="mt-3 flex items-center gap-1 text-sm font-medium text-brand"
      >
        Filtres avancés {activeCount > 0 ? `(${activeCount})` : ""}
        <span aria-hidden="true">{isOpen ? "▴" : "▾"}</span>
      </button>

      {isOpen && (
        <div className="mt-3 grid grid-cols-2 gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 sm:grid-cols-3 lg:grid-cols-6">
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Prix min (KKN/CHF)
            </label>
            <input
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={(event) => update("minPrice", event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600">
              Prix max (KKN/CHF)
            </label>
            <input
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={(event) => update("maxPrice", event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(event) => update("type", event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand focus:outline-none"
            >
              <option value="">Tous</option>
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600">
              Localisation
            </label>
            <select
              value={filters.location}
              onChange={(event) => update("location", event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand focus:outline-none"
            >
              <option value="">Toutes</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600">
              Vendeur / Association
            </label>
            <select
              value={filters.sellerId}
              onChange={(event) => update("sellerId", event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-brand focus:outline-none"
            >
              <option value="">Tous</option>
              {sellers.map((seller) => (
                <option key={seller.id} value={seller.id}>
                  {seller.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end pb-1.5">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={filters.shippingOnly}
                onChange={(event) =>
                  update("shippingOnly", event.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              Livraison possible
            </label>
          </div>

          {activeCount > 0 && (
            <div className="col-span-full">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...filters,
                    minPrice: "",
                    maxPrice: "",
                    type: "",
                    shippingOnly: false,
                    location: "",
                    sellerId: "",
                  })
                }
                className="text-xs text-gray-500 hover:underline"
              >
                Réinitialiser les filtres avancés
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
