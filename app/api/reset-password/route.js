import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { resetPasswordSchema } from "@/lib/validation";

export async function POST(request) {
  const body = await request.json();
  const result = resetPasswordSchema.safeParse(body);

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message || "Datos no válidos." },
      { status: 400 }
    );
  }

  const { token, password } = result.data;

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Este enlace de restablecimiento no es válido o ha caducado." },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.member.update({
      where: { id: resetToken.memberId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.deleteMany({
      where: { memberId: resetToken.memberId },
    }),
  ]);

  return NextResponse.json({
    message: "Tu contraseña se ha actualizado. Ya puedes iniciar sesión.",
  });
}
