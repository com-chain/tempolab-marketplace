import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="text-lg font-bold tracking-tight text-slate-900">
              <span className="text-brand">TempoLab</span>
            </span>
            <p className="mt-2 max-w-xs text-sm text-slate-500">
              Un mercado local donde el tiempo es la moneda: personas y
              organizaciones intercambian productos y servicios en tempos.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Explorar</h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-slate-500 transition-colors hover:text-brand"
                >
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link
                  href="/associations-membres"
                  className="text-sm text-slate-500 transition-colors hover:text-brand"
                >
                  Organizaciones locales
                </Link>
              </li>
              <li>
                <Link
                  href="/#membres"
                  className="text-sm text-slate-500 transition-colors hover:text-brand"
                >
                  Cómo funciona
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Cuenta</h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link
                  href="/login"
                  className="text-sm text-slate-500 transition-colors hover:text-brand"
                >
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-sm text-slate-500 transition-colors hover:text-brand"
                >
                  Registrarse
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-slate-500 transition-colors hover:text-brand"
                >
                  Mi espacio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Ayuda</h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-slate-500 transition-colors hover:text-brand"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TempoLab.</p>
          <p>Todos los pagos se realizan en tempos, la moneda de tiempo local.</p>
        </div>
      </div>
    </footer>
  );
}
