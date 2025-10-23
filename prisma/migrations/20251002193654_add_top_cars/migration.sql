-- CreateTable
CREATE TABLE "public"."TopCars" (
    "id" TEXT NOT NULL,
    "order" INTEGER,
    "carId" TEXT NOT NULL,

    CONSTRAINT "TopCars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TopCars_carId_key" ON "public"."TopCars"("carId");

-- AddForeignKey
ALTER TABLE "public"."TopCars" ADD CONSTRAINT "TopCars_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."Cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
