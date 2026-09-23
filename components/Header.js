import Link from "next/link";
import CategoryMegaMenu from "@/components/CategoryMegaMenu";
import CartButton from "@/components/CartButton";
import { auth } from "@/auth";

// Enlaces de navegación adicionales, además del megamenú Categorías.
// Para añadir un nuevo elemento más tarde, basta con añadir una línea aquí.
const NAV_LINKS = [
  { label: "Organizaciones locales", href: "/#membres" },
  { label: "Contacto", href: "/contact" },
];

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 shrink-0 text-brand"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
            <path
              d="M12 7.5v4.7l3.2 1.9"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            <span className="text-brand">TempoLab</span>
          </span>
        </Link>

        <nav className="hidden shrink-0 items-center gap-1 lg:flex">
          <CategoryMegaMenu />
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <div className="lg:hidden">
            <CategoryMegaMenu />
          </div>
          <CartButton />
          {session ? (
            <>
              <span className="hidden text-sm text-slate-600 sm:inline">
                {session.user?.name}
              </span>
              <Link
                href="/dashboard"
                className="rounded-full bg-brand px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-brand-dark hover:shadow sm:px-4 sm:text-sm"
              >
                Mi cuenta
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 sm:px-3.5 sm:text-sm"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-brand px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-brand-dark hover:shadow sm:px-4 sm:text-sm"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 py-1.5 sm:px-6 lg:hidden">
        <div className="flex flex-wrap gap-x-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
