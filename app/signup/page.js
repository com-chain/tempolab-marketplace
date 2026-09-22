"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState("INDIVIDUAL");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone") || "",
      accountType,
      companyName: formData.get("companyName") || "",
    };

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Une erreur est survenue.");
        return;
      }

      setSuccess(data.message);
      event.currentTarget.reset();
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">S&apos;inscrire</h1>
      <p className="mt-1 text-sm text-gray-500">
        Votre inscription sera examinée par un administrateur avant que vous
        puissiez vous connecter.
      </p>

      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAccountType("INDIVIDUAL")}
            className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
              accountType === "INDIVIDUAL"
                ? "border-brand bg-brand-light text-brand"
                : "border-gray-300 text-gray-600"
            }`}
          >
            Particulier
          </button>
          <button
            type="button"
            onClick={() => setAccountType("COMPANY")}
            className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
              accountType === "COMPANY"
                ? "border-brand bg-brand-light text-brand"
                : "border-gray-300 text-gray-600"
            }`}
          >
            Association / Entreprise
          </button>
        </div>

        {accountType === "COMPANY" && (
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700"
            >
              Nom de l&apos;association/entreprise
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Nom d&apos;utilisateur
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            minLength={3}
            maxLength={20}
            pattern="[a-zA-Z0-9._]+"
            title="Lettres, chiffres, points et underscores uniquement (3 à 20 caractères)."
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            3 à 20 caractères : lettres, chiffres, points et underscores.
          </p>
        </div>

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

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Téléphone (facultatif)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
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
          className="mt-2 rounded-md bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {isSubmitting ? "Envoi..." : "S'inscrire"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Déjà inscrit ?{" "}
        <Link href="/login" className="text-brand hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
