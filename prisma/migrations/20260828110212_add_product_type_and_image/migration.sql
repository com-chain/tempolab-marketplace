-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PHYSICAL', 'DIGITAL', 'SERVICE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "image" TEXT,
ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'PHYSICAL';
