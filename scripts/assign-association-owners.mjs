// Crée un compte Member (placeholder) pour chaque association membre qui a
// une annonce, et réassigne cette annonce à ce compte au lieu de l'admin.
// Ainsi chaque produit affiche/filtre correctement "vendu par [association]".
//
// Ces comptes n'ont pas d'e-mail réel ni de mot de passe connu — ils
// existent uniquement pour représenter l'association comme vendeur dans
// les données. Si une association s'inscrit elle-même plus tard, un admin
// pourra transférer ses produits vers son vrai compte.
import { config } from "dotenv";
config({ path: ".env.local" });
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../app/generated/prisma/client.ts";
import bcrypt from "bcryptjs";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DIACRITICS_PATTERN = new RegExp("[\\u0300-\\u036f]", "g");

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(DIACRITICS_PATTERN, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function makeUniqueUsername(name, takenUsernames) {
  let base = slugify(name).slice(0, 16);
  if (base.length < 3) base = base.padEnd(3, "0");
  let candidate = base;
  let i = 2;
  while (
    takenUsernames.has(candidate) ||
    (await prisma.member.findUnique({ where: { username: candidate } }))
  ) {
    const suffix = String(i);
    candidate = `${base.slice(0, 20 - suffix.length)}${suffix}`;
    i++;
  }
  takenUsernames.add(candidate);
  return candidate;
}

async function main() {
  // Titre -> nom d'association, tel que généré par seed-association-products.mjs
  const products = await prisma.product.findMany({
    include: { owner: { select: { id: true, username: true, role: true } } },
  });

  const takenUsernames = new Set();
  let created = 0;
  let reassigned = 0;
  let skipped = 0;

  for (const product of products) {
    // Le nom de l'association est entre parenthèses à la fin de la description.
    const match = product.description.match(/\((.+), association membre de Kultura\.\)\s*$/);
    if (!match) {
      skipped++;
      continue;
    }
    const assocName = match[1];

    let member = await prisma.member.findFirst({
      where: { companyName: assocName, accountType: "COMPANY" },
    });

    if (!member) {
      const username = await makeUniqueUsername(assocName, takenUsernames);
      const passwordHash = await bcrypt.hash(
        `placeholder-${username}-${Date.now()}`,
        10
      );
      member = await prisma.member.create({
        data: {
          username,
          email: `${username}@membres.kultura.ch`,
          passwordHash,
          accountType: "COMPANY",
          companyName: assocName,
          role: "MEMBER",
          status: "APPROVED",
        },
      });
      created++;
    }

    const cleanDescription = product.description
      .replace(/\s*\(.+, association membre de Kultura\.\)\s*$/, "")
      .trim();

    await prisma.product.update({
      where: { id: product.id },
      data: { ownerId: member.id, description: cleanDescription },
    });
    reassigned++;
  }

  console.log(
    `Comptes association créés : ${created}. Produits réassignés : ${reassigned}. Ignorés (pas d'association détectée) : ${skipped}.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
