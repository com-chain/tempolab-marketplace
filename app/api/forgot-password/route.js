import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { requestResetSchema } from "@/lib/validation";
import { sendPasswordResetEmail } from "@/lib/email";

const GENERIC_MESSAGE =
  "Si existe una cuenta con este correo electrónico, se acaba de enviar un enlace de restablecimiento.";

export async function POST(request) {
  const body = await request.json();
  const result = requestResetSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Correo electrónico no válido." },
      { status: 400 }
    );
  }

  const { email } = result.data;
  const member = await prisma.member.findUnique({ where: { email } });

  // Siempre la misma respuesta, exista o no la cuenta, para no revelar
  // si tenemos registrada una dirección de correo electrónico.
  if (!member) {
    return NextResponse.json({ message: GENERIC_MESSAGE });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await prisma.passwordResetToken.create({
    data: { token, memberId: member.id, expiresAt },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  await sendPasswordResetEmail(member.email, resetUrl);

  return NextResponse.json({ message: GENERIC_MESSAGE });
}
