"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    const email = new FormData(event.currentTarget).get("email");

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Une erreur est survenue.");
        return;
      }
      setMessage(data.message);
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Mot de passe oublié
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Entrez votre adresse e-mail, nous vous enverrons un lien pour
        réinitialiser votre mot de passe.
      </p>

      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Adresse e-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {isSubmitting ? "Envoi..." : "Envoyer le lien"}
        </button>
      </form>

      <Link
        href="/login"
        className="mt-6 text-center text-sm text-gray-500 hover:underline"
      >
        &larr; Retour à la connexion
      </Link>
    </div>
  );
}
