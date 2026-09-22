// Remplace les produits de démonstration génériques par une offre par
// association membre de Kultura, inspirée de leur nom/mission réels.
// Contenu volontairement générique/prudent (ateliers, cours, événements
// communautaires) — à considérer comme un point de départ que chaque
// association pourra éditer une fois inscrite elle-même sur le site.
import { config } from "dotenv";
config({ path: ".env.local" });
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../app/generated/prisma/client.ts";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Titres des 12 anciens produits de démo génériques à retirer s'ils existent encore.
const OLD_DEMO_TITLES = [
  "VTT reconditionné",
  "Table basse en chêne massif",
  "Manteau d'hiver en laine vintage",
  "Création de logo",
  "Pack de e-books pour apprendre le français",
  "Ordinateur portable reconditionné (14 pouces)",
  "Lot de 3 pots en céramique",
  "Comptabilité pour petites associations (cours en ligne)",
  "Vélo enfant (roues 16 pouces)",
  "Bibliothèque d'occasion (5 étagères)",
  "Écharpe en laine tricotée main",
  "Consultation site web (1 heure)",
];

const listings = [
  { assoc: "ABCD", title: "Accompagnement pour bourses d'études", description: "Séance d'information et d'accompagnement pour les demandes de bourses d'études, proposée par ABCD.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Africa 21", title: "Atelier de sensibilisation interculturelle Afrique", description: "Atelier de découverte des cultures africaines animé par Africa 21.", category: "Divers Inclassables", price: 20, type: "SERVICE" },
  { assoc: "Afro LGBTQIA+", title: "Groupe de parole et soutien communautaire", description: "Espace d'écoute et de soutien pour la communauté afro-LGBTQIA+ à Genève.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Agents de Santé", title: "Atelier de sensibilisation à la santé communautaire", description: "Atelier d'information sur la santé et la prévention, animé par des agents de santé communautaires.", category: "Santé-Beauté", price: 15, type: "SERVICE" },
  { assoc: "Aidez-nous à Aider", title: "Permanence d'aide et d'accompagnement social", description: "Accompagnement social et administratif pour les personnes en difficulté.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Aipazcomun", title: "Atelier de médiation et communication pacifique", description: "Atelier de résolution de conflits et communication non-violente.", category: "Divers Inclassables", price: 25, type: "SERVICE" },
  { assoc: "Akwaba", title: "Soirée culturelle et accueil communautaire", description: "Soirée conviviale d'accueil et d'échange culturel organisée par Akwaba.", category: "Divers Inclassables", price: 10, type: "SERVICE" },
  { assoc: "Amouzesh", title: "Cours de langue et soutien scolaire", description: "Cours de langue et soutien scolaire pour enfants et adultes.", category: "Divers Inclassables", price: 20, type: "SERVICE" },
  { assoc: "Apprentissage sans Frontières", title: "Soutien scolaire et cours de rattrapage", description: "Séances de soutien scolaire pour élèves, animées par des bénévoles.", category: "Divers Inclassables", price: 15, type: "SERVICE" },
  { assoc: "Asile.ch", title: "Séance d'information sur les démarches d'asile", description: "Séance d'information générale sur les démarches liées à l'asile en Suisse.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Arte Andaluz de España-Flamenca", title: "Cours de flamenco et danse espagnole", description: "Initiation à la danse flamenco et à la culture andalouse.", category: "Sports - Loisirs", price: 30, type: "SERVICE" },
  { assoc: "Asociación Colombiana de Investigadores en Suiza ACIS", title: "Conférence et réseau de chercheurs colombiens", description: "Rencontre scientifique et mise en réseau pour chercheurs colombiens en Suisse.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Association culturelle Luso Suisse Laços", title: "Cours de portugais et culture lusophone", description: "Cours de langue portugaise et activités culturelles lusophones.", category: "Divers Inclassables", price: 25, type: "SERVICE" },
  { assoc: "Association Érythréeenne pour l’integration et la Démocracie", title: "Atelier d'intégration et de citoyenneté", description: "Atelier d'accompagnement à l'intégration pour la communauté érythréenne.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Association de solidarité de peuples Genève – ASOP", title: "Café de solidarité interculturelle", description: "Rencontre conviviale et solidaire entre communautés, organisée par l'ASOP.", category: "Divers Inclassables", price: 5, type: "SERVICE" },
  { assoc: "Association des Alevis (AAG)", title: "Cours de danse traditionnelle alévie (semah)", description: "Initiation à la danse rituelle semah de la culture alévie.", category: "Sports - Loisirs", price: 20, type: "SERVICE" },
  { assoc: "Association des Dominicains de Suisse ADES", title: "Atelier de cuisine dominicaine", description: "Atelier de découverte de la cuisine traditionnelle dominicaine.", category: "Divers Inclassables", price: 35, type: "SERVICE" },
  { assoc: "Association des Guinéens de Genève et de France voisine (AGGF)", title: "Soirée culturelle guinéenne", description: "Soirée de musique et culture guinéenne ouverte à tous.", category: "Divers Inclassables", price: 15, type: "SERVICE" },
  { assoc: "Association des Ivoiriens de Genève et de France voisine- AIG", title: "Cours de cuisine ivoirienne", description: "Atelier de cuisine traditionnelle ivoirienne animé par l'AIG.", category: "Divers Inclassables", price: 35, type: "SERVICE" },
  { assoc: "Association des Nomades – Mongolie", title: "Initiation à la culture nomade mongole", description: "Découverte de la culture et des traditions nomades de Mongolie.", category: "Divers Inclassables", price: 20, type: "SERVICE" },
  { assoc: "Association gambienne de Genève", title: "Rencontre culturelle gambienne", description: "Rencontre conviviale autour de la culture gambienne.", category: "Divers Inclassables", price: 10, type: "SERVICE" },
  { assoc: "Boma culture d’ici et d’ailleurs", title: "Atelier d'artisanat interculturel", description: "Atelier de création artisanale mêlant traditions d'ici et d'ailleurs.", category: "Art – Antiquités", price: 25, type: "SERVICE" },
  { assoc: "Bumba", title: "Activités communautaires et culturelles", description: "Activités communautaires et culturelles proposées par Bumba.", category: "Divers Inclassables", price: 10, type: "SERVICE" },
  { assoc: "Caravane sans frontières", title: "Excursion et échange interculturel", description: "Sortie/excursion favorisant les échanges interculturels, organisée par Caravane sans frontières.", category: "Sports - Loisirs", price: 20, type: "SERVICE" },
  { assoc: "Centre Arménien de Genève", title: "Cours de langue arménienne", description: "Cours d'initiation à la langue et à la culture arménienne.", category: "Divers Inclassables", price: 25, type: "SERVICE" },
  { assoc: "Centre Kurde des Droits de l’Homme", title: "Séance d'information sur les droits humains", description: "Séance d'information et de sensibilisation aux droits humains.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Cercle Martin Buber", title: "Cercle de dialogue interculturel et interreligieux", description: "Rencontre de dialogue interculturel et interreligieux inspirée de la pensée de Martin Buber.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Contre le Racisme Anti Noir CRAN", title: "Atelier de sensibilisation contre le racisme", description: "Atelier de sensibilisation et de formation contre le racisme anti-Noir.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "DARE", title: "Accompagnement et soutien psychosocial", description: "Accompagnement et soutien psychosocial proposé par DARE.", category: "Santé-Beauté", price: 0, type: "SERVICE" },
  { assoc: "Dem’Up", title: "Atelier de développement personnel pour jeunes", description: "Atelier de développement personnel et de confiance en soi pour les jeunes.", category: "Divers Inclassables", price: 20, type: "SERVICE" },
  { assoc: "Deutscher Internationaler Club in Genf", title: "Cours d'allemand et rencontres culturelles", description: "Cours de langue allemande et rencontres culturelles germanophones.", category: "Divers Inclassables", price: 25, type: "SERVICE" },
  { assoc: "DiversCité", title: "Atelier sur la diversité et l'inclusion", description: "Atelier de sensibilisation à la diversité et à l'inclusion en ville.", category: "Divers Inclassables", price: 15, type: "SERVICE" },
  { assoc: "Elisa-Asile", title: "Accompagnement social pour requérants d'asile", description: "Accompagnement social et administratif pour requérants d'asile.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Encontro Rencontre", title: "Soirée de rencontre interculturelle", description: "Soirée conviviale de rencontre entre cultures, organisée par Encontro Rencontre.", category: "Divers Inclassables", price: 10, type: "SERVICE" },
  { assoc: "Ethnopoly", title: "Atelier ludique interculturel (jeu Ethnopoly)", description: "Animation autour du jeu Ethnopoly pour découvrir les cultures en s'amusant.", category: "Jeux-Jouets", price: 15, type: "SERVICE" },
  { assoc: "Faith and Movement", title: "Atelier de danse et spiritualité", description: "Atelier combinant mouvement, danse et spiritualité.", category: "Sports - Loisirs", price: 20, type: "SERVICE" },
  { assoc: "Familles Monoparentales Immigrées AFMI", title: "Groupe de soutien pour familles monoparentales", description: "Groupe d'entraide et de soutien pour familles monoparentales immigrées.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Femmes et Intégration", title: "Atelier d'intégration pour femmes migrantes", description: "Atelier d'accompagnement à l'intégration destiné aux femmes migrantes.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Festival International de l’Humour", title: "Billet — Festival International de l'Humour", description: "Billet d'entrée pour une soirée du Festival International de l'Humour de Genève.", category: "Divers Inclassables", price: 35, type: "SERVICE" },
  { assoc: "Flag21", title: "Cours de sport et intégration par le mouvement", description: "Cours sportif favorisant l'intégration par le mouvement, proposé par Flag21.", category: "Sports - Loisirs", price: 20, type: "SERVICE" },
  { assoc: "Ge Care Ukraine", title: "Soutien humanitaire pour familles ukrainiennes", description: "Accompagnement et soutien humanitaire pour les familles ukrainiennes à Genève.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Horizon", title: "Accompagnement vers l'emploi et la formation", description: "Accompagnement à la recherche d'emploi et à la formation professionnelle.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Interstices", title: "Atelier créatif et espace de rencontre", description: "Atelier créatif dans un espace d'échange et de rencontre convivial.", category: "Art – Antiquités", price: 20, type: "SERVICE" },
  { assoc: "Josephine Zola", title: "Atelier d'écriture et expression artistique", description: "Atelier d'écriture créative et d'expression artistique.", category: "Divers Inclassables", price: 25, type: "SERVICE" },
  { assoc: "Le Petit Escabeau", title: "Tabouret-escabeau artisanal en bois", description: "Tabouret-escabeau en bois fabriqué à la main, pratique et durable.", category: "Meubles", price: 45, type: "PHYSICAL", quantity: 4, shippingAvailable: true, shippingDelay: "1-2 semaines" },
  { assoc: "Le Pont", title: "Accompagnement social et écoute", description: "Espace d'écoute et d'accompagnement social proposé par Le Pont.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Lecture et Compagnie", title: "Club de lecture et échange littéraire", description: "Rencontre autour de la lecture et échange littéraire convivial.", category: "Livres-BDs-Revues", price: 10, type: "SERVICE" },
  { assoc: "LES IDEES – éditions", title: "Livre — collection Les Idées", description: "Ouvrage de la collection Les Idées, pour un développement écologique et social.", category: "Livres-BDs-Revues", price: 22, type: "PHYSICAL", quantity: 6, shippingAvailable: true, shippingDelay: "3-5 jours" },
  { assoc: "Livre moi", title: "Don et échange de livres d'occasion", description: "Lot de livres d'occasion à donner ou échanger, via Livre moi.", category: "Livres-BDs-Revues", price: 5, type: "PHYSICAL", quantity: 10, shippingAvailable: false },
  { assoc: "Maman N’Deye Diallo AMND", title: "Soutien communautaire et entraide", description: "Actions de soutien communautaire et d'entraide portées par l'AMND.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "MARAD", title: "Débat et rencontre — collectif juif décolonial", description: "Soirée de débat et de rencontre organisée par le collectif MARAD.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Media Film ( AMF)", title: "Projection et atelier cinéma", description: "Projection de film suivie d'un atelier/débat, organisé par Media Film AMF.", category: "Photographie", price: 15, type: "SERVICE" },
  { assoc: "Meridional", title: "Soirée musicale et culture méridionale", description: "Soirée musicale mettant à l'honneur les cultures du sud, par Meridional.", category: "Musique", price: 20, type: "SERVICE" },
  { assoc: "Mouvement pour une agriculture paysanne et citoyenne (MAPC)", title: "Panier de légumes de saison", description: "Panier de légumes de saison issus de l'agriculture paysanne locale.", category: "Jardin-Jardinage", price: 28, type: "PHYSICAL", quantity: 15, shippingAvailable: false },
  { assoc: "Now We Are Rising NWAR", title: "Atelier d'empowerment et de leadership", description: "Atelier de développement du leadership et de l'empowerment communautaire.", category: "Divers Inclassables", price: 25, type: "SERVICE" },
  { assoc: "Permalife", title: "Atelier de permaculture urbaine", description: "Initiation à la permaculture et au jardinage urbain durable.", category: "Jardin-Jardinage", price: 30, type: "SERVICE" },
  { assoc: "Pervenches", title: "Accompagnement et activités pour seniors", description: "Activités et accompagnement social destinés aux personnes âgées.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "PICCA", title: "Atelier culturel et communautaire", description: "Atelier culturel et communautaire proposé par PICCA.", category: "Divers Inclassables", price: 15, type: "SERVICE" },
  { assoc: "Quartiers Collaboratifs", title: "Atelier de jardin partagé de quartier", description: "Atelier participatif de jardin partagé entre voisins.", category: "Jardin-Jardinage", price: 10, type: "SERVICE" },
  { assoc: "Relier", title: "Séance de coaching et accompagnement", description: "Séance de coaching individuel ou collectif proposée par Relier.", category: "Santé-Beauté", price: 40, type: "SERVICE" },
  { assoc: "Resilire", title: "Atelier de résilience et bien-être", description: "Atelier de développement de la résilience personnelle et du bien-être.", category: "Santé-Beauté", price: 30, type: "SERVICE" },
  { assoc: "Rock your life", title: "Programme de mentorat pour jeunes", description: "Programme de mentorat individuel destiné aux jeunes, par Rock your life.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Rookie Slash", title: "Sortie plein air et atelier jeunesse", description: "Sortie en plein air et atelier créatif destinés aux jeunes.", category: "Sports - Loisirs", price: 20, type: "SERVICE" },
  { assoc: "Salmaa", title: "Atelier de bien-être et santé mentale", description: "Atelier de sensibilisation au bien-être et à la santé mentale.", category: "Santé-Beauté", price: 25, type: "SERVICE" },
  { assoc: "Santé, Environnent et Art – HEVEA", title: "Atelier santé, environnement et art", description: "Atelier combinant sensibilisation à la santé, à l'environnement et à l'art, par HEVEA.", category: "Santé-Beauté", price: 20, type: "SERVICE" },
  { assoc: "Solidarité Guinée-Bissau Suisse- SGBS", title: "Soirée solidaire Guinée-Bissau", description: "Soirée culturelle et solidaire en faveur de la Guinée-Bissau.", category: "Divers Inclassables", price: 15, type: "SERVICE" },
  { assoc: "Swiss Arab – Cultural Alliance Platform", title: "Cours d'arabe et calligraphie", description: "Cours de langue arabe et initiation à la calligraphie.", category: "Divers Inclassables", price: 25, type: "SERVICE" },
  { assoc: "THRIVE", title: "Programme de coaching bien-être", description: "Programme d'accompagnement et de coaching bien-être proposé par THRIVE.", category: "Santé-Beauté", price: 45, type: "SERVICE" },
  { assoc: "Travailleurs Invisibles Genève TIG", title: "Permanence d'accompagnement pour travailleurs précaires", description: "Permanence d'écoute et d'accompagnement pour travailleurs en situation précaire.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Tripulantes", title: "Activités de groupe et cohésion communautaire", description: "Activités de groupe favorisant la cohésion communautaire, par Tripulantes.", category: "Sports - Loisirs", price: 15, type: "SERVICE" },
  { assoc: "U4U Volunteers", title: "Bénévolat et entraide communautaire", description: "Actions de bénévolat et d'entraide coordonnées par U4U Volunteers.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Ukrain Reborn", title: "Atelier de soutien pour la communauté ukrainienne", description: "Atelier de soutien et de reconstruction pour la communauté ukrainienne.", category: "Divers Inclassables", price: 0, type: "SERVICE" },
  { assoc: "Université Populaire Africaine UPAF", title: "Cours de l'Université Populaire Africaine", description: "Cours ouvert proposé par l'Université Populaire Africaine (UPAF).", category: "Divers Inclassables", price: 15, type: "SERVICE" },
  { assoc: "Yemen Y30", title: "Rencontre culturelle et solidarité yéménite", description: "Rencontre culturelle et solidaire en faveur de la communauté yéménite.", category: "Divers Inclassables", price: 10, type: "SERVICE" },
];

async function main() {
  const admin = await prisma.member.findFirst({ where: { role: "ADMIN" } });
  if (!admin) {
    throw new Error("Aucun compte admin trouvé — lancez d'abord npm run create-admin.");
  }

  const deleted = await prisma.product.deleteMany({
    where: { title: { in: OLD_DEMO_TITLES }, ownerId: admin.id },
  });
  console.log(`Anciens produits de démo supprimés : ${deleted.count}`);

  let created = 0;
  let skipped = 0;
  let seed = 0;

  for (const item of listings) {
    seed += 1;
    const existing = await prisma.product.findFirst({
      where: { title: item.title, ownerId: admin.id },
    });
    if (existing) {
      skipped++;
      continue;
    }

    await prisma.product.create({
      data: {
        title: item.title,
        description: `${item.description} (${item.assoc}, association membre de Kultura.)`,
        price: item.price,
        currency: "KKN/CHF",
        category: item.category,
        location: "Genève",
        type: item.type,
        image: `https://picsum.photos/seed/kultura-assoc-${seed}/600/400`,
        quantity: item.quantity ?? 12,
        shippingAvailable: item.shippingAvailable ?? false,
        shippingDelay: item.shippingAvailable ? item.shippingDelay || null : null,
        ownerId: admin.id,
      },
    });
    created++;
  }

  console.log(`Créés : ${created}, déjà présents (ignorés) : ${skipped}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
