"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const ERROR_MESSAGES = {
  "pending-approval":
    "Votre compte est en attente de validation par un administrateur.",
  "account-rejected": "Votre demande d'inscription n'a pas été validée.",
  CredentialsSignin: "Nom d'utilisateur/e-mail ou mot de passe incorrect.",
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const result = await signIn("credentials", {
      identifier: formData.get("identifier"),
      password: formData.get("password"),
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      const key = result.code || result.error;
      setError(ERROR_MESSAGES[key] || "Une erreur est survenue.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">Se connecter</h1>

      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label
            htmlFor="identifier"
            className="block text-sm font-medium text-gray-700"
          >
            Nom d&apos;utilisateur ou e-mail
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-md bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <div className="mt-4 flex justify-between text-sm">
        <Link href="/forgot-password" className="text-brand hover:underline">
          Mot de passe oublié ?
        </Link>
        <Link href="/signup" className="text-brand hover:underline">
          S&apos;inscrire
        </Link>
      </div>

      <Link
        href="/"
        className="mt-6 text-center text-sm text-gray-500 hover:underline"
      >
        &larr; Retour à l&apos;accueil
      </Link>
    </div>
  );
}
