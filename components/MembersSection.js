import Link from "next/link";
import MemberLogo from "@/components/MemberLogo";

const PREVIEW_COUNT = 12;

export default function MembersSection({ members }) {
  const preview = members.slice(0, PREVIEW_COUNT);

  return (
    <section id="membres" className="border-t border-gray-200 bg-gray-50 scroll-mt-28">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Associations membres
          </h2>
          <p className="mt-1 max-w-md text-sm text-gray-500">
            Kultura réunit {members.length} associations membres à Genève.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
          {preview.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center gap-2"
              title={member.name}
            >
              <MemberLogo member={member} className="h-14 w-14" />
              <span className="line-clamp-2 text-center text-xs text-gray-600">
                {member.name}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/associations-membres"
            className="rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark"
          >
            Voir les {members.length} associations membres
          </Link>
        </div>
      </div>
    </section>
  );
}
