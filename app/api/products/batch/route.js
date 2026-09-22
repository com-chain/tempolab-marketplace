import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ids = (searchParams.get("ids") || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (ids.length === 0) {
    return NextResponse.json({ products: [] });
  }

  const products = (
    await prisma.product.findMany({
      where: { id: { in: ids } },
      include: {
        owner: { select: { id: true, username: true, companyName: true } },
      },
    })
  ).map((product) => ({ ...product, price: Number(product.price) }));

  return NextResponse.json({ products });
}
