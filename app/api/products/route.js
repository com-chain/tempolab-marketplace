import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validation";
import { logActivity, ActivityAction } from "@/lib/activityLog";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
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

  let ownerId = session.user.id;
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

  const product = await prisma.product.create({
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
    action: ActivityAction.PRODUCT_CREATED,
    targetType: "Product",
    targetId: product.id,
    metadata: { title: product.title, ownerId },
  });

  return NextResponse.json({ product }, { status: 201 });
}
