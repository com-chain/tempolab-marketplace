import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logActivity, ActivityAction } from "@/lib/activityLog";

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const items = Array.isArray(body.items) ? body.items : [];
  const message = typeof body.message === "string" ? body.message : null;

  if (items.length === 0) {
    return NextResponse.json(
      { error: "El carrito está vacío." },
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
        { error: "Uno de los productos del carrito ya no existe." },
        { status: 400 }
      );
    }
    if (product.ownerId === session.user.id) {
      return NextResponse.json(
        { error: `No puedes pedir tu propio producto "${product.title}".` },
        { status: 400 }
      );
    }
    if (quantity < 1) {
      return NextResponse.json(
        { error: "Cantidad no válida." },
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
