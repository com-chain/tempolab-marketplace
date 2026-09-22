// Ajoute des produits/services détaillés pour Kultura et 8 associations
// membres, à partir des informations transmises par Robin Rudaz et Deborah
// Polasek (ticket HT00556) pour la démo. Les produits existants ne sont pas
// touchés — ce script ne fait qu'ajouter de nouvelles entrées.
//
// Les images utilisent picsum.photos (photos aléatoires mais fiables) plutôt
// qu'un service par mot-clé : loremflickr a été testé et s'est révélé trop
// instable (erreurs 500 fréquentes, y compris sur des mots-clés simples) —
// inacceptable pour une démo en direct.
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

function img(seed) {
  return `https://picsum.photos/seed/kultura-detail-${seed}/600/400`;
}

// companyName -> liste de nouveaux produits/services.
const listingsByOrg = {
  Kultura: [
    {
      title: "Secrétariat",
      description: "Service de secrétariat administratif pour associations et particuliers.",
      category: "Divers Inclassables",
      price: 0,
      image: img("secretariat"),
    },
    {
      title: "Communication",
      description: "Accompagnement en communication : visuels, réseaux sociaux, supports de présentation.",
      category: "Divers Inclassables",
      price: 0,
      image: img("communication"),
    },
    {
      title: "Installation de Linux sur ordinateurs",
      description: "Installation du système d'exploitation Linux sur ordinateurs.",
      category: "Informatique",
      price: 0,
      image: img("linux"),
    },
    {
      title: "Support informatique (Help Desk)",
      description: "Assistance informatique de premier niveau pour la résolution de problèmes techniques.",
      category: "Informatique",
      price: 0,
      image: img("helpdesk"),
    },
    {
      title: "Installation et configuration d'Odoo",
      description: "Installation et configuration du logiciel de gestion Odoo.",
      category: "Informatique",
      price: 0,
      image: img("odoo"),
    },
    {
      title: "Gestion de projet",
      description: "Accompagnement dans la gestion et le suivi de projets associatifs.",
      category: "Divers Inclassables",
      price: 0,
      image: img("gestion-projet"),
    },
    {
      title: "Recherche de financement",
      description: "Aide à la recherche de financements et de subventions pour projets associatifs.",
      category: "Divers Inclassables",
      price: 0,
      image: img("fundraising"),
    },
  ],
  Flag21: [
    {
      title: "Séance de yoga",
      description: "Séance de yoga en groupe, ouverte à toutes et tous.",
      category: "Sports - Loisirs",
      price: 30,
      image: img("yoga"),
    },
    {
      title: "Marche collective",
      description: "Sortie de marche collective en plein air.",
      category: "Sports - Loisirs",
      price: 30,
      image: img("marche"),
    },
    {
      title: "Séance de course à pied",
      description: "Séance de course à pied encadrée, pour tous les niveaux.",
      category: "Sports - Loisirs",
      price: 30,
      image: img("course-a-pied"),
    },
  ],
  "Afro LGBTQIA+": [
    {
      title: "Permanence d'écoute LGBTQIA+",
      description: "Service d'écoute sans rendez-vous pour les personnes LGBTQIA+ d'origine africaine.",
      category: "Santé-Beauté",
      price: 50,
      image: img("ecoute-lgbtqia"),
    },
    {
      title: "Atelier droits et défense des personnes LGBT",
      description: "Atelier d'information sur les droits et la défense des personnes LGBT.",
      category: "Santé-Beauté",
      price: 50,
      image: img("droits-lgbt"),
    },
  ],
  "Apprentissage sans Frontières": [
    {
      title: "Formation de formateurs pour adultes",
      description: "Cycle de formation de formateurs pour adultes, sur 10 jours.",
      category: "Divers Inclassables",
      price: 50,
      image: img("formation-formateurs"),
    },
  ],
  "Dem’Up": [
    {
      title: "Atelier sur la démocratie",
      description: "Atelier de sensibilisation et de réflexion sur la démocratie.",
      category: "Divers Inclassables",
      price: 30,
      image: img("democratie"),
    },
    {
      title: "Atelier désinformation et esprit critique",
      description: "Atelier sur la désinformation et le développement de l'esprit critique.",
      category: "Divers Inclassables",
      price: 30,
      image: img("desinformation"),
    },
  ],
  "Elisa-Asile": [
    {
      title: "Consultation juridique asile et immigration",
      description: "Information et assistance juridique en droit d'asile et de l'immigration.",
      category: "Divers Inclassables",
      price: 60,
      image: img("juridique-asile"),
    },
  ],
  "Agents de Santé": [
    {
      title: "Atelier nutrition",
      description: "Atelier de sensibilisation à une alimentation saine.",
      category: "Santé-Beauté",
      price: 50,
      image: img("nutrition"),
    },
    {
      title: "Atelier prévention alcool",
      description: "Atelier de prévention des risques liés à l'alcool.",
      category: "Santé-Beauté",
      price: 50,
      image: img("prevention-alcool"),
    },
    {
      title: "Atelier santé et sport",
      description: "Atelier autour de la santé et de l'activité sportive.",
      category: "Santé-Beauté",
      price: 50,
      image: img("sante-sport"),
    },
  ],
  "Africa 21": [
    {
      title: "Atelier d'écriture journalistique",
      description: "Atelier d'initiation à l'écriture journalistique.",
      category: "Divers Inclassables",
      price: 50,
      image: img("ecriture-journalistique"),
    },
    {
      title: "Projection de films africains",
      description: "Séance de projection de films africains, suivie d'un échange.",
      category: "Divers Inclassables",
      price: 50,
      image: img("films-africains"),
    },
  ],
  "Rookie Slash": [
    {
      title: "Initiation au skateboard",
      description: "Séance d'initiation au skateboard pour tous niveaux.",
      category: "Sports - Loisirs",
      price: 30,
      image: img("skateboard"),
    },
    {
      title: "Initiation au snowboard",
      description: "Séance d'initiation au snowboard pour tous niveaux.",
      category: "Sports - Loisirs",
      price: 30,
      image: img("snowboard"),
    },
  ],
};

async function getOrCreateKultura() {
  let member = await prisma.member.findFirst({
    where: { companyName: "Kultura", accountType: "COMPANY" },
  });
  if (member) return member;

  const passwordHash = await bcrypt.hash(`placeholder-kultura-${Date.now()}`, 10);
  return prisma.member.create({
    data: {
      username: "kultura",
      email: "kultura@membres.kultura.ch",
      passwordHash,
      accountType: "COMPANY",
      companyName: "Kultura",
      role: "MEMBER",
      status: "APPROVED",
    },
  });
}

async function main() {
  const kultura = await getOrCreateKultura();

  let created = 0;
  let missingOrgs = [];

  for (const [orgName, listings] of Object.entries(listingsByOrg)) {
    let owner;
    if (orgName === "Kultura") {
      owner = kultura;
    } else {
      owner = await prisma.member.findFirst({ where: { companyName: orgName } });
    }

    if (!owner) {
      missingOrgs.push(orgName);
      continue;
    }

    for (const listing of listings) {
      await prisma.product.create({
        data: {
          title: listing.title,
          description: listing.description,
          price: listing.price,
          currency: "KKN/CHF",
          category: listing.category,
          location: "Genève",
          type: "SERVICE",
          image: listing.image,
          quantity: 12,
          shippingAvailable: false,
          ownerId: owner.id,
        },
      });
      created++;
    }
  }

  console.log(`Produits créés : ${created}.`);
  if (missingOrgs.length > 0) {
    console.log(`Associations introuvables (ignorées) : ${missingOrgs.join(", ")}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
