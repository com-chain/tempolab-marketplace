export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">Contacto</h1>

      <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        ¡Atención! Aquí no se responde a los anuncios publicados en nuestro
        sitio, sino en la propia página del anuncio.
      </p>

      <form
        action="mailto:contacto@tempolab.ch"
        method="post"
        encType="text/plain"
        className="mt-6 flex flex-col gap-4"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Tu nombre:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Tu correo electrónico (obligatorio):
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700"
          >
            El motivo por el que quieres contactarnos:
          </label>
          <select
            id="reason"
            name="reason"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          >
            <option>Tengo una pregunta o un comentario.</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700"
          >
            Asunto:
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            Tu mensaje (opcional):
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-fit rounded-md bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          Enviar
        </button>
      </form>

      <div className="mt-10 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <p>Ginebra, Suiza</p>
        <p>contacto@tempolab.ch</p>
      </div>
    </div>
  );
}
