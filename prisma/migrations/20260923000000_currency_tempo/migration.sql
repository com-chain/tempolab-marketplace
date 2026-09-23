-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "currency" SET DEFAULT 'TEMPO';

-- Normalize existing rows
UPDATE "Product" SET "currency" = 'TEMPO' WHERE "currency" <> 'TEMPO';
