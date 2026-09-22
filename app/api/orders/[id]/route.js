import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logActivity, ActivityAction } from "@/lib/activityLog";

const SELLER_STATUSES = ["ACCEPTED", "DECLINED", "COMPLETED"];
const BUYER_STATUSES = ["CANCELLED"];

export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  const isSeller = order.sellerId === session.user.id;
  const isBuyer = order.buyerId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isSeller && !isBuyer && !isAdmin) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const allowed = isAdmin
    ? [...SELLER_STATUSES, ...BUYER_STATUSES]
    : isSeller
      ? SELLER_STATUSES
      : BUYER_STATUSES;

  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
  });

  await logActivity({
    actorId: session.user.id,
    action: ActivityAction.ORDER_STATUS_CHANGED,
    targetType: "Order",
    targetId: updated.id,
    metadata: { from: order.status, to: status },
  });

  return NextResponse.json({ order: updated });
}
