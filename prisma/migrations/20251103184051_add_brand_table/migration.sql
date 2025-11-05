/*
  Warnings:

  - You are about to drop the column `carId` on the `Brands` table. All the data in the column will be lost.
  - Made the column `name` on table `Brands` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Brands" DROP CONSTRAINT "Brands_carId_fkey";

-- DropIndex
DROP INDEX "public"."Brands_carId_key";

-- AlterTable
ALTER TABLE "public"."Brands" DROP COLUMN "carId",
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Cars" ADD COLUMN     "brandId" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "public"."Cars" ADD CONSTRAINT "Cars_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
