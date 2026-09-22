import { prisma } from "@/lib/prisma";
import HomeContent from "@/components/HomeContent";

export default async function Home() {
  const products = (
    await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { id: true, username: true, companyName: true } },
      },
    })
  ).map((product) => ({ ...product, price: Number(product.price) }));

  return <HomeContent products={products} />;
}
