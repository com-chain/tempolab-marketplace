"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    const password = new FormData(event.currentTarget).get("password");

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Une erreur est survenue.");
        return;
      }
      setMessage(data.message);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <p className="text-sm text-red-700">
        Lien de réinitialisation manquant ou invalide.{" "}
        <Link href="/forgot-password" className="text-brand hover:underline">
          Demander un nouveau lien
        </Link>
      </p>
    );
  }

  return (
    <>
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
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Nouveau mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}"
            title="Au moins 8 caractères, avec une majuscule, une minuscule et un chiffre."
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Au moins 8 caractères, avec une majuscule, une minuscule et un
            chiffre.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {isSubmitting ? "Enregistrement..." : "Réinitialiser le mot de passe"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Réinitialiser le mot de passe
      </h1>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
