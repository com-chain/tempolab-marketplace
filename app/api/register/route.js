import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/validation";
import { logActivity, ActivityAction } from "@/lib/activityLog";

export async function POST(request) {
  const body = await request.json();
  const result = registerSchema.safeParse(body);

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message || "Données invalides." },
      { status: 400 }
    );
  }

  const { username, email, password, phone, accountType, companyName } =
    result.data;

  const existing = await prisma.member.findFirst({
    where: { OR: [{ username }, { email }] },
  });
  if (existing) {
    const field = existing.username === username ? "username" : "email";
    return NextResponse.json(
      {
        error:
          field === "username"
            ? "Ce nom d'utilisateur est déjà pris."
            : "Cette adresse e-mail est déjà utilisée.",
      },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  const member = await prisma.member.create({
    data: {
      username,
      email,
      passwordHash,
      phone: phone || null,
      accountType,
      companyName: accountType === "COMPANY" ? companyName : null,
    },
  });

  await logActivity({
    actorId: member.id,
    action: ActivityAction.MEMBER_REGISTERED,
    targetType: "Member",
    targetId: member.id,
    metadata: { username, accountType },
  });

  return NextResponse.json(
    {
      message:
        "Inscription reçue. Un administrateur doit valider votre compte avant que vous puissiez vous connecter.",
    },
    { status: 201 }
  );
}
