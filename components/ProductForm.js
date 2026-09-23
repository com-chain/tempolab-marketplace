"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/data/categories";

const TYPE_LABELS = {
  PHYSICAL: "Producto físico",
  DIGITAL: "Producto digital",
  SERVICE: "Servicio",
};

export default function ProductForm({
  product,
  members,
  redirectTo = "/dashboard/produits",
}) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const isAdmin = Boolean(members);

  const [shippingAvailable, setShippingAvailable] = useState(
    product?.shippingAvailable ?? false
  );
  const [imageUrl, setImageUrl] = useState(product?.image || "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Error al enviar la imagen.");
        return;
      }
      setImageUrl(data.url);
    } catch {
      setError("Error al enviar la imagen. Inténtalo de nuevo.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: formData.get("price"),
      category: formData.get("category"),
      location: formData.get("location"),
      type: formData.get("type"),
      image: imageUrl,
      quantity: formData.get("quantity"),
      shippingAvailable,
      shippingDelay: shippingAvailable
        ? formData.get("shippingDelay") || ""
        : "",
      ...(isAdmin ? { ownerId: formData.get("ownerId") } : {}),
    };

    try {
      const url = isEdit ? `/api/products/${product.id}` : "/api/products";
      const method = isEdit ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Se ha producido un error.");
        setIsSubmitting(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Se ha producido un error. Inténtalo de nuevo.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {isAdmin && (
        <div>
          <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700">
            Propietario del producto
          </label>
          <select
            id="ownerId"
            name="ownerId"
            required
            defaultValue={product?.ownerId || ""}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          >
            <option value="" disabled>
              Elegir un miembro...
            </option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.username}
                {member.companyName ? ` (${member.companyName})` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={3}
          defaultValue={product?.title}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          minLength={10}
          defaultValue={product?.description}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Precio (TEMPO)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={product?.price ? String(product.price) : ""}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Cantidad disponible
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            step="1"
            min="0"
            required
            defaultValue={product?.quantity ?? 1}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={product?.category || ""}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          >
            <option value="" disabled>
              Elegir...
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            name="type"
            required
            defaultValue={product?.type || "PHYSICAL"}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          >
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Ubicación
        </label>
        <input
          id="location"
          name="location"
          type="text"
          required
          placeholder="ej. Ginebra"
          defaultValue={product?.location}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">
          Foto del producto
        </label>
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Vista previa"
            className="mt-2 h-32 w-32 rounded-md border border-gray-200 object-cover"
          />
        )}
        <input
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-2 block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-light file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand"
        />
        {isUploading && (
          <p className="mt-1 text-xs text-gray-500">Enviando la imagen...</p>
        )}
      </div>

      <div className="rounded-md border border-gray-200 p-4">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={shippingAvailable}
            onChange={(event) => setShippingAvailable(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          Envío disponible
        </label>

        {shippingAvailable && (
          <div className="mt-3">
            <label
              htmlFor="shippingDelay"
              className="block text-sm font-medium text-gray-700"
            >
              Plazo de envío
            </label>
            <input
              id="shippingDelay"
              name="shippingDelay"
              type="text"
              placeholder="ej. 3-5 días"
              defaultValue={product?.shippingDelay || ""}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isUploading}
        className="mt-2 rounded-md bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {isSubmitting
          ? "Guardando..."
          : isEdit
            ? "Guardar cambios"
            : "Publicar producto"}
      </button>
    </form>
  );
}
