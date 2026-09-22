import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { requestResetSchema } from "@/lib/validation";
import { sendPasswordResetEmail } from "@/lib/email";

const GENERIC_MESSAGE =
  "Si un compte existe avec cette adresse e-mail, un lien de réinitialisation vient d'être envoyé.";

export async function POST(request) {
  const body = await request.json();
  const result = requestResetSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Adresse e-mail invalide." },
      { status: 400 }
    );
  }

  const { email } = result.data;
  const member = await prisma.member.findUnique({ where: { email } });

  // Toujours la même réponse, que le compte existe ou non, pour ne pas
  // révéler si une adresse e-mail est enregistrée chez nous.
  if (!member) {
    return NextResponse.json({ message: GENERIC_MESSAGE });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

  await prisma.passwordResetToken.create({
    data: { token, memberId: member.id, expiresAt },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  await sendPasswordResetEmail(member.email, resetUrl);

  return NextResponse.json({ message: GENERIC_MESSAGE });
}
