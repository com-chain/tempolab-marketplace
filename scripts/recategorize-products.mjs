// Ré-applique la nouvelle taxonomie de catégories définie par Jean à tous
// les produits existants. Chaque produit a été examiné individuellement
// (titre + description) pour lui attribuer la catégorie la plus fidèle à
// sa nature réelle parmi les 16 nouvelles catégories.
import { config } from "dotenv";
config({ path: ".env.local" });
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../app/generated/prisma/client.ts";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// id du produit -> nouvelle catégorie.
const CATEGORY_BY_ID = {
  cmtmysd0g000eacsb2j18w12m: "Administration", // Accompagnement dans les démarches administratives
  cmtihgtgl001kxlsbxxl5rjuy: "Événementiel", // Accompagnement et activités pour seniors
  cmtihgoge000sxlsbhkdrc2kc: "Administration", // Accompagnement et soutien psychosocial
  cmtihgjfs0000xlsbs9sx1dei: "Administration", // Accompagnement pour bourses d'études
  cmtihgrhm0019xlsb5g0xql7n: "Administration", // Accompagnement social et écoute
  cmtihgp64000wxlsbf5e2krgh: "Administration", // Accompagnement social pour requérants d'asile
  cmtihgqrw0015xlsbe4rke85r: "Service de ressources humaines", // Accompagnement vers l'emploi et la formation
  cmtihgndy000mxlsbu83bk9r7: "Événementiel", // Activités communautaires et culturelles
  cmtihgvrs001xxlsb7jxc5tj5: "Événementiel", // Activités de groupe et cohésion communautaire
  cmtmyscnp000cacsb7x38smz7: "Événementiel", // Alphabétisation et remise à niveau
  cmtihgqyb0016xlsbfil57r8e: "Événementiel", // Atelier créatif et espace de rencontre
  cmtihgtn1001lxlsbrypp9hwo: "Événementiel", // Atelier culturel et communautaire
  cmtihgn7h000lxlsbxr89sid8: "Événementiel", // Atelier d'artisanat interculturel
  cmtihgt3t001ixlsbnknn8jb8: "Événementiel", // Atelier d'empowerment et de leadership
  cmtihglrz000dxlsbm60ky0jr: "Événementiel", // Atelier d'intégration et de citoyenneté
  cmtihgq270011xlsbmyw32a7e: "Événementiel", // Atelier d'intégration pour femmes migrantes
  cmtihgr4r0017xlsbwpnrceym: "Écriture et média", // Atelier d'écriture et expression artistique
  cmtmy7men000krqsbxg101azt: "Écriture et média", // Atelier d'écriture journalistique
  cmtihgupg001rxlsb5moxqn3e: "Événementiel", // Atelier de bien-être et santé mentale
  cmtihgmbb000gxlsbblyuu4cq: "Production culinaire", // Atelier de cuisine dominicaine
  cmtihgppc000zxlsbq2agnmby: "Événementiel", // Atelier de danse et spiritualité
  cmtihgoms000txlsbopaupn4a: "Événementiel", // Atelier de développement personnel pour jeunes
  cmtihgttf001mxlsb6hd5nft4: "Événementiel", // Atelier de jardin partagé de quartier
  cmtihgkcd0005xlsbfkdzo6ug: "Événementiel", // Atelier de médiation et communication pacifique
  cmtihgta8001jxlsby719j8py: "Production culinaire", // Atelier de permaculture urbaine
  cmtihgu69001oxlsb3wi8933q: "Événementiel", // Atelier de résilience et bien-être
  cmtihgoa0000rxlsb4ls5vxw3: "Événementiel", // Atelier de sensibilisation contre le racisme
  cmtihgjml0001xlsbq591mhns: "Événementiel", // Atelier de sensibilisation interculturelle Afrique
  cmtihgjzj0003xlsba03jcgok: "Événementiel", // Atelier de sensibilisation à la santé communautaire
  cmtihgw4n001zxlsbf4fz52b6: "Événementiel", // Atelier de soutien pour la communauté ukrainienne
  cmtmy7l8s000crqsbnsp6sysu: "Juridique", // Atelier droits et défense des personnes LGBT
  cmtmy7lou000frqsbw9mz8n8y: "Écriture et média", // Atelier désinformation et esprit critique
  cmtihgpiy000yxlsbpia3bpfc: "Événementiel", // Atelier ludique interculturel (jeu Ethnopoly)
  cmtmy7m1u000hrqsbluxyl99e: "Production culinaire", // Atelier nutrition
  cmtmy7m51000irqsbefypet91: "Événementiel", // Atelier prévention alcool
  cmtmy7m89000jrqsbl7s77vfn: "Événementiel", // Atelier santé et sport
  cmtihguvt001sxlsb81ugsxo8: "Événementiel", // Atelier santé, environnement et art
  cmtihgozm000vxlsbj68b2spa: "Événementiel", // Atelier sur la diversité et l'inclusion
  cmtmy7llm000erqsb6i84w2ag: "Événementiel", // Atelier sur la démocratie
  cmtmyscu3000dacsba4ydi6es: "Événementiel", // Atelier sur la participation citoyenne
  cmtihgq8o0012xlsbnxlv8bom: "Événementiel", // Billet — Festival International de l'Humour
  cmtihgvy8001yxlsb2t6ivv8b: "Bénévolat", // Bénévolat et entraide communautaire
  cmtihglyf000exlsbueuce15z: "Événementiel", // Café de solidarité interculturelle
  cmtihgo3m000qxlsbnd1a3lro: "Événementiel", // Cercle de dialogue interculturel et interreligieux
  cmtihgro1001axlsb42fl3hl3: "Promotion artistique & édition", // Club de lecture et échange littéraire
  cmtihglf6000bxlsb6xd0f9uq: "Événementiel", // Conférence et réseau de chercheurs colombiens
  cmtmy7lvb000grqsb78qewg0q: "Juridique", // Consultation juridique asile et immigration
  cmtihgot7000uxlsbcsx0zci6: "Événementiel", // Cours d'allemand et rencontres culturelles
  cmtihgv8k001uxlsb3fav0ewz: "Événementiel", // Cours d'arabe et calligraphie
  cmtihgmo5000ixlsbdrffjqmj: "Production culinaire", // Cours de cuisine ivoirienne
  cmtihgm4u000fxlsb0yn95vhw: "Événementiel", // Cours de danse traditionnelle alévie (semah)
  cmtihgl8r000axlsbto5xsiho: "Événementiel", // Cours de flamenco et danse espagnole
  cmtmysckg000bacsbol5fd11a: "Événementiel", // Cours de français pour adultes
  cmtihgwd20020xlsbtri304u0: "Événementiel", // Cours de l'Université Populaire Africaine
  cmtihgnqt000oxlsbvrw2p5gn: "Événementiel", // Cours de langue arménienne
  cmtihgkp70007xlsbeyvqsrks: "Événementiel", // Cours de langue et soutien scolaire
  cmtihglli000cxlsbl3gp2ge8: "Événementiel", // Cours de portugais et culture lusophone
  cmtihgqf20013xlsba399oqog: "Événementiel", // Cours de sport et intégration par le mouvement
  cmtmysbhk0001acsb86qj0yo8: "Graphisme & design", // Création de cartes de visite
  cmtmysbe50000acsb2oyrf421: "Graphisme & design", // Création de flyers
  cmtmysc140007acsbn0iv9iwk: "Graphisme & design", // Création de logo
  cmtmysbkt0002acsbic1kvfat: "Graphisme & design", // Création de roll-up / affiches
  cmtmysbo40003acsbytobxz8s: "IT", // Création de site internet
  cmtihgs12001cxlsbgk0imved: "Promotion artistique & édition", // Don et échange de livres d'occasion
  cmtmysd9z000gacsbgjhg5jo6: "Événementiel", // Débat et rencontre citoyenne
  cmtihgsdv001exlsb2q2iaqqf: "Événementiel", // Débat et rencontre — collectif juif décolonial
  cmtihgnke000nxlsb0v0vbmfj: "Événementiel", // Excursion et échange interculturel
  cmtmy7lf9000drqsbc765lmlg: "Service de ressources humaines", // Formation de formateurs pour adultes
  cmtmy7kii0006rqsbbydg6140: "Projets", // Gestion de projet
  cmtmysbxu0006acsb47fzztr6: "Communication", // Gestion des réseaux sociaux
  cmtihgjt00002xlsb6ol7fro2: "Administration", // Groupe de parole et soutien communautaire
  cmtmyscdz000aacsbj4a7q2yk: "Administration", // Groupe de soutien entre pairs
  cmtihgpvs0010xlsbylxpyr27: "Administration", // Groupe de soutien pour familles monoparentales
  cmtmysdge000hacsbkidklfat: "Événementiel", // Initiation au roller/longboard
  cmtmy7mob000mrqsbt5b2nykg: "Événementiel", // Initiation au skateboard
  cmtmy7mrl000nrqsba4uavm1n: "Événementiel", // Initiation au snowboard
  cmtihgmuj000jxlsbkt2y2v0t: "Événementiel", // Initiation à la culture nomade mongole
  cmtmy7k8q0003rqsbhiqa9vav: "IT", // Installation de Linux sur ordinateurs
  cmtmy7kf80005rqsbsixxzq6f: "IT", // Installation et configuration d'Odoo
  cmtihgrul001bxlsb788s1zb6: "Promotion artistique & édition", // Livre — collection Les Idées
  cmtmy7kvt0009rqsbly5t45jh: "Événementiel", // Marche collective
  cmtmysbrc0004acsbzm819e0y: "IT", // Mise à jour de site internet
  cmtihgsx6001hxlsburducx7h: "Production culinaire", // Panier de légumes de saison
  cmtihgvlf001wxlsbchlz9ow6: "Administration", // Permanence d'accompagnement pour travailleurs précaires
  cmtihgk600004xlsbno9paii4: "Administration", // Permanence d'aide et d'accompagnement social
  cmtmy7l5k000brqsbmbzobcfi: "Administration", // Permanence d'écoute LGBTQIA+
  cmtihgvf0001vxlsbh4zvkqli: "Administration", // Programme de coaching bien-être
  cmtihgucn001pxlsbm45xie7j: "Service de ressources humaines", // Programme de mentorat pour jeunes
  cmtmy7mhv000lrqsb9vtvldnk: "Événementiel", // Projection de films africains
  cmtihgskb001fxlsbijnnqwhf: "Événementiel", // Projection et atelier cinéma
  cmtmy7kls0007rqsbz1fkr1t8: "Financement", // Recherche de financement
  cmtihgwqm0021xlsbvteqs5bm: "Événementiel", // Rencontre culturelle et solidarité yéménite
  cmtihgn11000kxlsbudwr7up4: "Événementiel", // Rencontre culturelle gambienne
  cmtmysc4g0008acsbirr0ixhy: "Relations publiques", // Rédaction de communiqués de presse
  cmtmysbuk0005acsbxkyx9hv0: "Communication", // Rédaction et envoi de newsletter
  cmtmy7k210001rqsbuepmxxx6: "Administration", // Secrétariat
  cmtihgkir0006xlsb8towf4gf: "Événementiel", // Soirée culturelle et accueil communautaire
  cmtihgmhp000hxlsbd4ccmcv9: "Événementiel", // Soirée culturelle guinéenne
  cmtihgpci000xxlsbtxrsob82: "Événementiel", // Soirée de rencontre interculturelle
  cmtihgsqp001gxlsboesly8f8: "Événementiel", // Soirée musicale et culture méridionale
  cmtihgv26001txlsb553i8y4b: "Événementiel", // Soirée solidaire Guinée-Bissau
  cmtihguj2001qxlsb31jt3skw: "Événementiel", // Sortie plein air et atelier jeunesse
  cmtihgs7g001dxlsb28boz537: "Administration", // Soutien communautaire et entraide
  cmtihgqlh0014xlsbbr82ccka: "Administration", // Soutien humanitaire pour familles ukrainiennes
  cmtihgkvl0008xlsbyuif91mh: "Événementiel", // Soutien scolaire et cours de rattrapage
  cmtmy7kbz0004rqsb16tptbh7: "IT", // Support informatique (Help Desk)
  cmtmysd3m000facsbpverxe4k: "Juridique", // Séance d'information sur le droit d'asile
  cmtihgnx9000pxlsbf0003pct: "Juridique", // Séance d'information sur les droits humains
  cmtihgl200009xlsb28623p43: "Administration", // Séance d'information sur les démarches d'asile
  cmtihgtzw001nxlsbsg24dh9u: "Administration", // Séance de coaching et accompagnement
  cmtmy7kz4000arqsbzqtlezdg: "Événementiel", // Séance de course à pied
  cmtmy7ksl0008rqsb83g66de4: "Événementiel", // Séance de yoga
  cmtihgrb70018xlsb2w6z62cq: "Mobilier", // Tabouret-escabeau artisanal en bois
  cmtmysc7m0009acsbo1i3uy3f: "Écriture et média", // Traduction de supports de communication
};

async function main() {
  const entries = Object.entries(CATEGORY_BY_ID);
  let updated = 0;
  const missing = [];

  for (const [id, category] of entries) {
    const result = await prisma.product
      .update({ where: { id }, data: { category } })
      .catch(() => null);
    if (result) {
      updated++;
    } else {
      missing.push(id);
    }
  }

  const total = await prisma.product.count();
  console.log(`Produits recatégorisés : ${updated} / ${entries.length} (base contient ${total} produits au total).`);
  if (missing.length > 0) {
    console.log("IDs introuvables (à vérifier) :", missing);
  }

  const distribution = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });
  console.log("Répartition finale :");
  for (const row of distribution.sort((a, b) => b._count - a._count)) {
    console.log(`  ${row.category}: ${row._count}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
