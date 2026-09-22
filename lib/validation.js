import { z } from "zod";

// Nom d'utilisateur : 3 à 20 caractères, lettres/chiffres/points/underscores,
// sans espace.
export const usernameSchema = z
  .string()
  .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères.")
  .max(20, "Le nom d'utilisateur ne peut pas dépasser 20 caractères.")
  .regex(
    /^[a-zA-Z0-9._]+$/,
    "Seuls les lettres, chiffres, points et underscores sont autorisés."
  );

// Mot de passe : au moins 8 caractères, une majuscule, une minuscule, un chiffre.
export const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
  .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule.")
  .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule.")
  .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.");

export const registerSchema = z
  .object({
    username: usernameSchema,
    email: z.email("Adresse e-mail invalide."),
    password: passwordSchema,
    phone: z.string().optional().nullable().or(z.literal("")),
    accountType: z.enum(["INDIVIDUAL", "COMPANY"]),
    companyName: z.string().optional().nullable().or(z.literal("")),
  })
  .refine(
    (data) => data.accountType !== "COMPANY" || data.companyName?.trim(),
    {
      message: "Le nom de l'entreprise/association est requis.",
      path: ["companyName"],
    }
  );

export const loginSchema = z.object({
  identifier: z.string().min(1, "Entrez votre nom d'utilisateur ou e-mail."),
  password: z.string().min(1, "Entrez votre mot de passe."),
});

export const requestResetSchema = z.object({
  email: z.email("Adresse e-mail invalide."),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});

export const productSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères.").max(120),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères."),
  price: z.coerce.number().positive("Le prix doit être supérieur à 0."),
  category: z.string().min(1, "Choisissez une catégorie."),
  location: z.string().min(1, "Indiquez une localisation."),
  type: z.enum(["PHYSICAL", "DIGITAL", "SERVICE"]),
  image: z.url("URL d'image invalide.").optional().nullable().or(z.literal("")),
  quantity: z.coerce.number().int().min(0, "La quantité ne peut pas être négative."),
  shippingAvailable: z.boolean(),
  shippingDelay: z.string().optional().nullable().or(z.literal("")),
  // Réservé à l'admin : permet d'assigner/réassigner un produit à un membre.
  ownerId: z.string().optional().nullable().or(z.literal("")),
});
