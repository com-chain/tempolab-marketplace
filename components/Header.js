import Link from "next/link";
import CategoryMegaMenu from "@/components/CategoryMegaMenu";
import CartButton from "@/components/CartButton";
import { auth } from "@/auth";

// Liens de la barre de navigation secondaire, en plus du méga-menu Catégories.
// Pour ajouter un nouvel élément plus tard, il suffit d'ajouter une ligne ici.
const NAV_LINKS = [
  { label: "Associations membres", href: "/#membres" },
  { label: "Contact", href: "/contact" },
];

export default async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-gray-200 bg-white">
      {/* Barre du haut : logo + connexion / inscription */}
      <div className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-end gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kultura-logo.svg"
              alt="Kultura"
              className="h-7 w-auto"
            />
            <span className="text-lg font-bold leading-none text-brand">
              La Place de Marché
            </span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <CartButton />
            {session ? (
              <>
                <span className="hidden text-sm text-gray-600 sm:inline">
                  {session.user?.name}
                </span>
                <Link
                  href="/dashboard"
                  className="rounded-md bg-brand px-2 py-1.5 text-xs font-medium text-white hover:bg-brand-dark sm:px-3 sm:text-sm"
                >
                  Mon espace
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md bg-brand px-2 py-1.5 text-xs font-medium text-white hover:bg-brand-dark sm:px-3 sm:text-sm"
                >
                  Se connecter
                </Link>
                <Link
                  href="/signup"
                  className="rounded-md px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-brand-light hover:text-brand sm:px-3 sm:text-sm"
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Barre de navigation secondaire : catégories, associations, contact... */}
      <nav className="bg-brand">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center px-4 sm:px-6">
          <CategoryMegaMenu />
          {NAV_LINKS.map((link) => (
            <span key={link.href} className="flex shrink-0 items-center">
              <span className="h-4 w-px shrink-0 bg-white/40" aria-hidden="true" />
              <Link
                href={link.href}
                className="shrink-0 px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>
      </nav>
    </header>
  );
}
