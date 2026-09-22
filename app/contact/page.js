export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">Contact</h1>

      <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        Attention ! Ce n&apos;est pas ici que l&apos;on répond aux annonces
        présentes sur notre site, mais sur la page de l&apos;annonce
        elle-même.
      </p>

      <form
        action="mailto:kultura@kultura.ch"
        method="post"
        encType="text/plain"
        className="mt-6 flex flex-col gap-4"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Votre nom :
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
            Votre adresse e-mail (obligatoire) :
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
            La raison pour laquelle vous souhaitez nous contacter :
          </label>
          <select
            id="reason"
            name="reason"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          >
            <option>J&apos;ai une question ou une remarque.</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700"
          >
            Objet :
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
            Votre message (facultatif) :
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
          Envoyer
        </button>
      </form>

      <div className="mt-10 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <p>15 Rue des Savoises, CH-1205 Genève</p>
        <p>+41 78 336 86 95</p>
        <p>kultura@kultura.ch</p>
      </div>
    </div>
  );
}
