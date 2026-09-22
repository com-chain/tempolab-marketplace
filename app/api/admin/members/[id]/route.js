import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logActivity, ActivityAction } from "@/lib/activityLog";

const VALID_STATUSES = ["APPROVED", "REJECTED"];

export async function PATCH(request, { params }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await request.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const member = await prisma.member.update({
    where: { id },
    data: { status },
    omit: { passwordHash: true },
  });

  await logActivity({
    actorId: session.user.id,
    action:
      status === "APPROVED"
        ? ActivityAction.MEMBER_APPROVED
        : ActivityAction.MEMBER_REJECTED,
    targetType: "Member",
    targetId: member.id,
    metadata: { username: member.username },
  });

  return NextResponse.json({ member });
}
