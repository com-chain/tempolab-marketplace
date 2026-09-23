"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminMemberRow({ member }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function updateStatus(status) {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/members/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        setIsSubmitting(false);
        return;
      }
      // No volver a poner isSubmitting en false aquí: esta fila desaparecerá
      // de la tabla una vez terminado el refresh (el miembro ya no está PENDING).
      // Hacerlo de todos modos provoca una actualización de estado en un nodo
      // en proceso de desmontaje, lo que rompe la reconciliación DOM de React.
      router.refresh();
    } catch {
      setIsSubmitting(false);
    }
  }

  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 pr-4">
        <div className="font-medium text-gray-900">{member.username}</div>
        <div className="text-xs text-gray-500">{member.email}</div>
      </td>
      <td className="py-3 pr-4 text-sm text-gray-600">
        {member.accountType === "COMPANY"
          ? member.companyName || "Organización/Empresa"
          : "Particular"}
      </td>
      <td className="py-3 pr-4 text-sm text-gray-500">
        {new Date(member.createdAt).toLocaleDateString("es-ES")}
      </td>
      <td className="py-3 text-right">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => updateStatus("APPROVED")}
            className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-60"
          >
            Aprobar
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => updateStatus("REJECTED")}
            className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            Rechazar
          </button>
        </div>
      </td>
    </tr>
  );
}
