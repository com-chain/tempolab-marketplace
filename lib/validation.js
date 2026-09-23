import { z } from "zod";

// Nombre de usuario: 3 a 20 caracteres, letras/números/puntos/guiones bajos,
// sin espacios.
export const usernameSchema = z
  .string()
  .min(3, "El nombre de usuario debe tener al menos 3 caracteres.")
  .max(20, "El nombre de usuario no puede superar los 20 caracteres.")
  .regex(
    /^[a-zA-Z0-9._]+$/,
    "Solo se permiten letras, números, puntos y guiones bajos."
  );

// Contraseña: al menos 8 caracteres, una mayúscula, una minúscula, un número.
export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres.")
  .regex(/[a-z]/, "La contraseña debe contener al menos una minúscula.")
  .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula.")
  .regex(/[0-9]/, "La contraseña debe contener al menos un número.");

export const registerSchema = z
  .object({
    username: usernameSchema,
    email: z.email("Correo electrónico no válido."),
    password: passwordSchema,
    phone: z.string().optional().nullable().or(z.literal("")),
    accountType: z.enum(["INDIVIDUAL", "COMPANY"]),
    companyName: z.string().optional().nullable().or(z.literal("")),
  })
  .refine(
    (data) => data.accountType !== "COMPANY" || data.companyName?.trim(),
    {
      message: "El nombre de la empresa/organización es obligatorio.",
      path: ["companyName"],
    }
  );

export const loginSchema = z.object({
  identifier: z.string().min(1, "Introduce tu nombre de usuario o correo electrónico."),
  password: z.string().min(1, "Introduce tu contraseña."),
});

export const requestResetSchema = z.object({
  email: z.email("Correo electrónico no válido."),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});

export const productSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres.").max(120),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres."),
  price: z.coerce.number().positive("El precio debe ser mayor que 0."),
  category: z.string().min(1, "Elige una categoría."),
  location: z.string().min(1, "Indica una ubicación."),
  type: z.enum(["PHYSICAL", "DIGITAL", "SERVICE"]),
  image: z.url("URL de imagen no válida.").optional().nullable().or(z.literal("")),
  quantity: z.coerce.number().int().min(0, "La cantidad no puede ser negativa."),
  shippingAvailable: z.boolean(),
  shippingDelay: z.string().optional().nullable().or(z.literal("")),
  // Reservado al admin: permite asignar/reasignar un producto a un miembro.
  ownerId: z.string().optional().nullable().or(z.literal("")),
});
