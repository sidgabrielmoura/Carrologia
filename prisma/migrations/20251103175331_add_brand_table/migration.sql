-- CreateTable
CREATE TABLE "public"."Brands" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "logo_img" TEXT,
    "carId" TEXT NOT NULL,

    CONSTRAINT "Brands_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brands_name_key" ON "public"."Brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Brands_carId_key" ON "public"."Brands"("carId");

-- AddForeignKey
ALTER TABLE "public"."Brands" ADD CONSTRAINT "Brands_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."Cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
