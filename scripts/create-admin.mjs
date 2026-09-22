// Crée (ou met à jour) un compte administrateur, déjà approuvé.
// Usage : node scripts/create-admin.js <username> <email> <password>
import { config } from "dotenv";
config({ path: ".env.local" });
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../app/generated/prisma/client.ts";
import bcrypt from "bcryptjs";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const [username, email, password] = process.argv.slice(2);

if (!username || !email || !password) {
  console.error(
    "Usage : node scripts/create-admin.js <username> <email> <password>"
  );
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.member.upsert({
    where: { email },
    update: { role: "ADMIN", status: "APPROVED", passwordHash, username },
    create: {
      username,
      email,
      passwordHash,
      role: "ADMIN",
      status: "APPROVED",
      accountType: "INDIVIDUAL",
    },
  });

  console.log(`Compte administrateur prêt : ${admin.username} (${admin.email})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
