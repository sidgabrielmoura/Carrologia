-- DropForeignKey
ALTER TABLE "public"."Cars" DROP CONSTRAINT "Cars_brandId_fkey";

-- AlterTable
ALTER TABLE "public"."Brands" ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Cars" ADD COLUMN     "bodyworkId" TEXT,
ALTER COLUMN "brandId" DROP NOT NULL,
ALTER COLUMN "brandId" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."BodyworkType" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,

    CONSTRAINT "BodyworkType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Cars" ADD CONSTRAINT "Cars_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cars" ADD CONSTRAINT "Cars_bodyworkId_fkey" FOREIGN KEY ("bodyworkId") REFERENCES "public"."BodyworkType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
