import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logActivity, ActivityAction } from "@/lib/activityLog";

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await request.json();
  const items = Array.isArray(body.items) ? body.items : [];
  const message = typeof body.message === "string" ? body.message : null;

  if (items.length === 0) {
    return NextResponse.json(
      { error: "Le panier est vide." },
      { status: 400 }
    );
  }

  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });
  const productMap = new Map(products.map((product) => [product.id, product]));

  const ordersToCreate = [];
  for (const item of items) {
    const product = productMap.get(item.productId);
    const quantity = Number(item.quantity) || 1;

    if (!product) {
      return NextResponse.json(
        { error: "Un des produits du panier n'existe plus." },
        { status: 400 }
      );
    }
    if (product.ownerId === session.user.id) {
      return NextResponse.json(
        { error: `Vous ne pouvez pas commander votre propre produit "${product.title}".` },
        { status: 400 }
      );
    }
    if (quantity < 1) {
      return NextResponse.json(
        { error: "Quantité invalide." },
        { status: 400 }
      );
    }

    ordersToCreate.push({
      productId: product.id,
      buyerId: session.user.id,
      sellerId: product.ownerId,
      quantity,
      message,
    });
  }

  const orders = await prisma.$transaction(
    ordersToCreate.map((data) => prisma.order.create({ data }))
  );

  await Promise.all(
    orders.map((order) =>
      logActivity({
        actorId: session.user.id,
        action: ActivityAction.ORDER_CREATED,
        targetType: "Order",
        targetId: order.id,
        metadata: { productId: order.productId, sellerId: order.sellerId },
      })
    )
  );

  return NextResponse.json({ orders }, { status: 201 });
}
