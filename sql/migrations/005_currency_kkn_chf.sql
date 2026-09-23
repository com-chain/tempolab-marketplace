-- AlterTable
-- Note: superseded by 006 below (intermediate typo fixed there); kept
-- to mirror the real Prisma migration history in prisma/migrations.
ALTER TABLE "Product" ALTER COLUMN "currency" SET DEFAULT 'KNN/CHF';
