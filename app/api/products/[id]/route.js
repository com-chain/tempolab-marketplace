import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validation";
import { logActivity, ActivityAction } from "@/lib/activityLog";

async function assertAccess(id, session) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return null;
  if (product.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    return null;
  }
  return product;
}

export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await assertAccess(id, session);
  if (!existing) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  const body = await request.json();
  const result = productSchema.safeParse(body);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message || "Données invalides." },
      { status: 400 }
    );
  }

  const data = result.data;

  // Un admin peut réassigner un produit à un autre membre.
  let ownerId = existing.ownerId;
  if (session.user.role === "ADMIN" && data.ownerId) {
    const owner = await prisma.member.findUnique({
      where: { id: data.ownerId },
    });
    if (!owner) {
      return NextResponse.json(
        { error: "Membre introuvable." },
        { status: 400 }
      );
    }
    ownerId = owner.id;
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      location: data.location,
      type: data.type,
      image: data.image || null,
      quantity: data.quantity,
      shippingAvailable: data.shippingAvailable,
      shippingDelay: data.shippingAvailable ? data.shippingDelay || null : null,
      ownerId,
    },
  });

  await logActivity({
    actorId: session.user.id,
    action:
      ownerId !== existing.ownerId
        ? ActivityAction.PRODUCT_REASSIGNED
        : ActivityAction.PRODUCT_UPDATED,
    targetType: "Product",
    targetId: product.id,
    metadata:
      ownerId !== existing.ownerId
        ? { title: product.title, fromOwnerId: existing.ownerId, toOwnerId: ownerId }
        : { title: product.title },
  });

  return NextResponse.json({ product });
}

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await assertAccess(id, session);
  if (!existing) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  await prisma.product.delete({ where: { id } });

  await logActivity({
    actorId: session.user.id,
    action: ActivityAction.PRODUCT_DELETED,
    targetType: "Product",
    targetId: existing.id,
    metadata: { title: existing.title, ownerId: existing.ownerId },
  });

  return NextResponse.json({ ok: true });
}
