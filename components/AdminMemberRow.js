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
      // Ne pas remettre isSubmitting à false ici : cette ligne va disparaître
      // du tableau une fois le refresh terminé (le membre n'est plus PENDING).
      // Le faire quand même provoque une mise à jour d'état sur un nœud en
      // cours de démontage, ce qui casse la réconciliation DOM de React.
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
          ? member.companyName || "Association/Entreprise"
          : "Particulier"}
      </td>
      <td className="py-3 pr-4 text-sm text-gray-500">
        {new Date(member.createdAt).toLocaleDateString("fr-CH")}
      </td>
      <td className="py-3 text-right">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => updateStatus("APPROVED")}
            className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-60"
          >
            Approuver
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => updateStatus("REJECTED")}
            className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            Rejeter
          </button>
        </div>
      </td>
    </tr>
  );
}
