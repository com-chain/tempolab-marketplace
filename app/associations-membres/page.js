"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import MemberLogo from "@/components/MemberLogo";
import { members } from "@/data/members";

const DIACRITICS_PATTERN = new RegExp("[\\u0300-\\u036f]", "g");

function normalizeFirstLetter(name) {
  const letter = name.normalize("NFD").replace(DIACRITICS_PATTERN, "")[0];
  return /[a-zA-Z]/.test(letter) ? letter.toUpperCase() : "#";
}

function groupByLetter(list) {
  const groups = new Map();
  for (const member of list) {
    const letter = normalizeFirstLetter(member.name);
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter).push(member);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export default function AssociationsMembresPage() {
  const [search, setSearch] = useState("");

  const sorted = useMemo(
    () => [...members].sort((a, b) => a.name.localeCompare(b.name, "fr")),
    []
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return sorted;
    const query = search.trim().toLowerCase();
    return sorted.filter((member) =>
      member.name.toLowerCase().includes(query)
    );
  }, [search, sorted]);

  const groups = useMemo(() => groupByLetter(filtered), [filtered]);

  return (
    <div className="flex-1 bg-white">
      <div className="border-b border-gray-200 bg-brand-light">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <Link href="/" className="text-sm text-gray-600 hover:underline">
            &larr; Retour à l&apos;accueil
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
            Associations membres
          </h1>
          <p className="mt-2 max-w-xl text-gray-600">
            Kultura réunit {members.length} associations membres à Genève.
          </p>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher une association..."
            className="mt-6 w-full max-w-sm rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {groups.length === 0 && (
          <p className="text-center text-gray-500">
            Aucune association ne correspond à votre recherche.
          </p>
        )}

        <div className="flex flex-col gap-10">
          {groups.map(([letter, list]) => (
            <div key={letter}>
              <h2 className="text-sm font-bold text-brand">{letter}</h2>
              <div className="mt-3 grid grid-cols-1 gap-3 border-t border-gray-100 pt-3 sm:grid-cols-2">
                {list.map((member) =>
                  member.url ? (
                    <a
                      key={member.id}
                      href={member.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-brand-light"
                    >
                      <MemberLogo member={member} className="h-10 w-10" />
                      <span className="text-sm font-medium text-gray-800">
                        {member.name}
                      </span>
                    </a>
                  ) : (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 rounded-md p-2"
                    >
                      <MemberLogo member={member} className="h-10 w-10" />
                      <span className="text-sm font-medium text-gray-800">
                        {member.name}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
