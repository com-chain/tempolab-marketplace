"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_LABELS = {
  PENDING: "En attente",
  APPROVED: "Approuvé",
  REJECTED: "Rejeté",
};

const STATUS_STYLES = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

function MemberActions({ member }) {
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
      router.refresh();
    } catch {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-end gap-2">
      {member.status !== "APPROVED" && (
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => updateStatus("APPROVED")}
          className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-60"
        >
          Approuver
        </button>
      )}
      {member.status !== "REJECTED" && (
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => updateStatus("REJECTED")}
          className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
        >
          {member.status === "APPROVED" ? "Révoquer" : "Rejeter"}
        </button>
      )}
    </div>
  );
}

export default function AdminAllMembersTable({ members }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = useMemo(() => {
    return members.filter((member) => {
      const matchesStatus =
        statusFilter === "ALL" || member.status === statusFilter;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        member.username.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.companyName?.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [members, search, statusFilter]);

  return (
    <div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher par nom, e-mail ou association..."
          className="w-full flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none sm:w-56"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="APPROVED">Approuvé</option>
          <option value="REJECTED">Rejeté</option>
        </select>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        {filtered.length} compte{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-gray-500">
          Aucun compte ne correspond à ces critères.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                <th className="py-2 pr-4 font-medium">Compte</th>
                <th className="py-2 pr-4 font-medium">Type</th>
                <th className="py-2 pr-4 font-medium">Statut</th>
                <th className="py-2 pr-4 font-medium">Rôle</th>
                <th className="py-2 pr-4 font-medium">Date</th>
                <th className="py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((member) => (
                <tr key={member.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-gray-900">
                      {member.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      {member.email}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-600">
                    {member.accountType === "COMPANY"
                      ? member.companyName || "Association/Entreprise"
                      : "Particulier"}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[member.status]}`}
                    >
                      {STATUS_LABELS[member.status]}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-500">
                    {member.role === "ADMIN" ? "Admin" : "Membre"}
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-500">
                    {new Date(member.createdAt).toLocaleDateString("fr-CH")}
                  </td>
                  <td className="py-3">
                    {member.role !== "ADMIN" && (
                      <MemberActions member={member} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
