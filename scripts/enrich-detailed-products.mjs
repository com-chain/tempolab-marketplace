// Complète le lot de produits "détaillés" ajouté pour la démo :
// 1) remplace le générique "Communication" de Kultura par les 10 services
//    détaillés fournis par Deborah (fichier ods, prix réels inclus) ;
// 2) ajoute des produits supplémentaires pour que chaque association ait au
//    moins 3 produits au total (certaines n'en avaient que 2) ; les nouveaux
//    items ajoutés au-delà de ce qui était explicitement fourni par
//    Robin/Deborah sont des extensions plausibles de la mission de
//    l'association — à faire valider par eux avant la démo ;
// 3) régénère une image "de marque" (dégradé + vrai logo + titre) pour tous
//    les produits de ce lot, au lieu de photos génériques.
import { config } from "dotenv";
config({ path: ".env.local" });
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../app/generated/prisma/client.ts";
import ws from "ws";
import path from "node:path";
import { generateProductArt } from "./lib/productArt.mjs";

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const OUT_DIR = path.resolve(import.meta.dirname, "../public/generated/products");

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Organisation -> identité visuelle (dégradé + vrai logo).
const ORG_STYLE = {
  Kultura: { logo: "/kultura-logo.svg", gradient: ["#006b32", "#3ea373"] },
  Flag21: { logo: "/logos/flag21.png", gradient: ["#ff7a45", "#ffb199"] },
  "Afro LGBTQIA+": { logo: "/logos/afro-lgbtqia.png", gradient: ["#d6336c", "#f783ac"] },
  "Apprentissage sans Frontières": {
    logo: "/logos/apprentissage-sans-frontieres.png",
    gradient: ["#1c7ed6", "#74c0fc"],
  },
  "Dem’Up": { logo: "/logos/dem-up.png", gradient: ["#5f3dc4", "#b197fc"] },
  "Elisa-Asile": { logo: "/logos/elisa-asile.png", gradient: ["#1864ab", "#4dabf7"] },
  "Agents de Santé": { logo: "/logos/agents-de-sante.png", gradient: ["#0f9b8e", "#63e6be"] },
  "Africa 21": { logo: "/logos/africa-21.svg", gradient: ["#e8590c", "#ffa94d"] },
  "Rookie Slash": { logo: "/logos/rookie-slash.png", gradient: ["#f08c00", "#ffd43b"] },
};

// Emoji par titre exact (couvre le lot existant + les nouveaux ajouts).
const EMOJI_BY_TITLE = {
  // Kultura — existants
  Secrétariat: "🗂️",
  "Installation de Linux sur ordinateurs": "🐧",
  "Support informatique (Help Desk)": "🛠️",
  "Installation et configuration d'Odoo": "🧩",
  "Gestion de projet": "📊",
  "Recherche de financement": "💰",
  // Kultura — communication détaillée (nouveaux, remplacent le générique)
  "Création de flyers": "📄",
  "Création de cartes de visite": "💳",
  "Création de roll-up / affiches": "🖼️",
  "Création de site internet": "🌐",
  "Mise à jour de site internet": "🔄",
  "Rédaction et envoi de newsletter": "📧",
  "Gestion des réseaux sociaux": "📱",
  "Création de logo": "🎨",
  "Rédaction de communiqués de presse": "📰",
  "Traduction de supports de communication": "🌍",
  // Flag21
  "Séance de yoga": "🧘",
  "Marche collective": "🥾",
  "Séance de course à pied": "🏃",
  // Afro LGBTQIA+
  "Permanence d'écoute LGBTQIA+": "💬",
  "Atelier droits et défense des personnes LGBT": "🏳️‍🌈",
  "Groupe de soutien entre pairs": "🤝",
  // Apprentissage sans Frontières
  "Formation de formateurs pour adultes": "🎓",
  "Cours de français pour adultes": "🗣️",
  "Alphabétisation et remise à niveau": "📖",
  // Dem'Up
  "Atelier sur la démocratie": "🗳️",
  "Atelier désinformation et esprit critique": "🧠",
  "Atelier sur la participation citoyenne": "🏛️",
  // Elisa-Asile
  "Consultation juridique asile et immigration": "⚖️",
  "Accompagnement dans les démarches administratives": "📋",
  "Séance d'information sur le droit d'asile": "ℹ️",
  // Agents de Santé
  "Atelier nutrition": "🥗",
  "Atelier prévention alcool": "⚕️",
  "Atelier santé et sport": "🏋️",
  // Africa 21
  "Atelier d'écriture journalistique": "📰",
  "Projection de films africains": "🎬",
  "Débat et rencontre citoyenne": "🗣️",
  // Rookie Slash
  "Initiation au skateboard": "🛹",
  "Initiation au snowboard": "🏂",
  "Initiation au roller/longboard": "🛼",
};

// Les 10 services de communication détaillés fournis par Deborah (ods),
// prix repris tel quel (borne basse de la fourchette indiquée).
const KULTURA_COMMUNICATION = [
  {
    title: "Création de flyers",
    description:
      "Flyer A5/A6, livraison en PDF haute définition, prêt à imprimer. Prix selon recto seul ou recto verso et le nombre de déclinaisons (CHF 250–400 ; rédaction de texte CHF 150.- en sus).",
    price: 250,
  },
  {
    title: "Création de cartes de visite",
    description:
      "Carte de visite recto verso, livraison en PDF haute définition, prêt à imprimer. Prix selon la complexité graphique (CHF 200–350).",
    price: 200,
  },
  {
    title: "Création de roll-up / affiches",
    description:
      "Support grand format (roll-up ou affiche A3 à A0), conception sur mesure. Prix selon le format final et le nombre de visuels (CHF 200–500).",
    price: 200,
  },
  {
    title: "Création de site internet",
    description:
      "Site vitrine sur mesure, design responsive, référencement de base inclus. Prix selon le nombre de pages (3 à 5) et les fonctionnalités ajoutées (CHF 2'000–4'500).",
    price: 2000,
  },
  {
    title: "Mise à jour de site internet",
    description:
      "Actualisation de contenu (textes, visuels) sur un site existant. Forfait selon le nombre de pages à modifier (CHF 250–500).",
    price: 250,
  },
  {
    title: "Rédaction et envoi de newsletter",
    description:
      "Conception graphique, rédaction et diffusion d'une newsletter via plateforme d'envoi. Prix selon le nombre de rubriques (CHF 200–400 / envoi).",
    price: 200,
  },
  {
    title: "Gestion des réseaux sociaux",
    description:
      "Animation de vos réseaux sociaux. Prix selon le nombre de réseaux gérés et la fréquence de publication, 8 à 20 posts/mois (CHF 900–1'500 / mois).",
    price: 900,
  },
  {
    title: "Création de logo",
    description:
      "Logo avec déclinaisons essentielles (couleurs, formats), livraison des fichiers sources. CHF 300.- sur la base d'éléments existants, CHF 600.- pour une création complète.",
    price: 300,
  },
  {
    title: "Rédaction de communiqués de presse",
    description:
      "Rédaction et mise en forme d'un communiqué prêt à diffuser aux médias. Prix selon la longueur du texte et si la diffusion aux contacts presse est incluse.",
    price: 0,
  },
  {
    title: "Traduction de supports de communication",
    description:
      "Traduction de vos supports (flyers, site, réseaux), relecture incluse. Prix selon la paire de langues et la technicité du contenu.",
    price: 0,
  },
];

// Compléments pour atteindre au moins 3 produits par association. Inférés
// à partir de la mission connue de chaque structure — pas issus directement
// des messages de Robin/Deborah, à confirmer avec eux.
const TOP_UP_BY_ORG = {
  "Afro LGBTQIA+": [
    {
      title: "Groupe de soutien entre pairs",
      description: "Groupe d'échange et de soutien entre pairs pour les personnes LGBTQIA+ d'origine africaine.",
      category: "Santé-Beauté",
      price: 50,
    },
  ],
  "Apprentissage sans Frontières": [
    {
      title: "Cours de français pour adultes",
      description: "Cours de français pour adultes, tous niveaux.",
      category: "Divers Inclassables",
      price: 30,
    },
    {
      title: "Alphabétisation et remise à niveau",
      description: "Atelier d'alphabétisation et de remise à niveau scolaire pour adultes.",
      category: "Divers Inclassables",
      price: 20,
    },
  ],
  "Dem’Up": [
    {
      title: "Atelier sur la participation citoyenne",
      description: "Atelier de sensibilisation à la participation citoyenne.",
      category: "Divers Inclassables",
      price: 30,
    },
  ],
  "Elisa-Asile": [
    {
      title: "Accompagnement dans les démarches administratives",
      description: "Accompagnement dans les démarches administratives liées à l'asile et à l'immigration.",
      category: "Divers Inclassables",
      price: 60,
    },
    {
      title: "Séance d'information sur le droit d'asile",
      description: "Séance d'information collective sur le droit d'asile.",
      category: "Divers Inclassables",
      price: 0,
    },
  ],
  "Africa 21": [
    {
      title: "Débat et rencontre citoyenne",
      description: "Soirée débat et rencontre citoyenne autour de l'actualité africaine.",
      category: "Divers Inclassables",
      price: 30,
    },
  ],
  "Rookie Slash": [
    {
      title: "Initiation au roller/longboard",
      description: "Séance d'initiation au roller et au longboard pour tous niveaux.",
      category: "Sports - Loisirs",
      price: 30,
    },
  ],
};

async function getOrg(companyName) {
  const member = await prisma.member.findFirst({ where: { companyName } });
  if (!member) throw new Error(`Organisation introuvable : ${companyName}`);
  return member;
}

function artFor(title, orgName) {
  const style = ORG_STYLE[orgName];
  const emoji = EMOJI_BY_TITLE[title] || "⭐";
  const outFile = path.join(OUT_DIR, `${slugify(orgName)}-${slugify(title)}.svg`);
  return generateProductArt({ title, emoji, logoPath: style.logo, gradient: style.gradient, outFile });
}

async function main() {
  const kultura = await getOrg("Kultura");

  // 1) Retirer le générique "Communication" (remplacé par le détail ci-dessous).
  const removed = await prisma.product.deleteMany({
    where: { ownerId: kultura.id, title: "Communication" },
  });
  console.log(`Ancien produit générique retiré : ${removed.count}`);

  // 2) Créer les 10 services de communication détaillés.
  for (const item of KULTURA_COMMUNICATION) {
    await prisma.product.create({
      data: {
        title: item.title,
        description: item.description,
        price: item.price,
        currency: "KKN/CHF",
        category: "Divers Inclassables",
        location: "Genève",
        type: "SERVICE",
        image: artFor(item.title, "Kultura"),
        quantity: 12,
        shippingAvailable: false,
        ownerId: kultura.id,
      },
    });
  }
  console.log(`Services de communication Kultura créés : ${KULTURA_COMMUNICATION.length}`);

  // 3) Compléments par association.
  let topUps = 0;
  for (const [orgName, items] of Object.entries(TOP_UP_BY_ORG)) {
    const owner = await getOrg(orgName);
    for (const item of items) {
      await prisma.product.create({
        data: {
          title: item.title,
          description: item.description,
          price: item.price,
          currency: "KKN/CHF",
          category: item.category,
          location: "Genève",
          type: "SERVICE",
          image: artFor(item.title, orgName),
          quantity: 12,
          shippingAvailable: false,
          ownerId: owner.id,
        },
      });
      topUps++;
    }
  }
  console.log(`Produits complémentaires créés : ${topUps}`);

  // 4) Régénérer l'image "de marque" pour les 23 produits déjà créés lors
  // du lot précédent (remplace les photos picsum génériques).
  let regenerated = 0;
  for (const [orgName] of Object.entries(ORG_STYLE)) {
    const owner = await getOrg(orgName);
    const products = await prisma.product.findMany({
      where: { ownerId: owner.id, image: { contains: "picsum" } },
      select: { id: true, title: true },
    });
    for (const p of products) {
      const image = artFor(p.title, orgName);
      await prisma.product.update({ where: { id: p.id }, data: { image } });
      regenerated++;
    }
  }
  console.log(`Images régénérées pour les produits existants du lot : ${regenerated}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
