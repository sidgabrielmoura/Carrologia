-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "public"."FuelType" AS ENUM ('GASOLINE', 'ETHANOL', 'DIESEL', 'ELECTRIC', 'HYBRID');

-- CreateEnum
CREATE TYPE "public"."TransmissionType" AS ENUM ('MANUAL', 'AUTOMATIC', 'CVT', 'SEMI_AUTOMATIC');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cars" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL DEFAULT '',
    "model" TEXT NOT NULL DEFAULT '',
    "fipe" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "year" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Specifications" (
    "id" TEXT NOT NULL,
    "fuel" "public"."FuelType" NOT NULL DEFAULT 'GASOLINE',
    "engine" TEXT NOT NULL DEFAULT '',
    "power" TEXT NOT NULL DEFAULT '',
    "torque" TEXT,
    "consumption" TEXT NOT NULL DEFAULT '',
    "transmission" "public"."TransmissionType" NOT NULL DEFAULT 'MANUAL',
    "traction" TEXT,
    "seats" INTEGER,
    "doors" INTEGER,
    "trunkCapacity" TEXT,
    "weight" TEXT,
    "maxSpeed" TEXT,
    "acceleration" TEXT,
    "carId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Specifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Features" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "airBag" BOOLEAN NOT NULL DEFAULT false,
    "absBrakes" BOOLEAN NOT NULL DEFAULT false,
    "electricWindows" BOOLEAN NOT NULL DEFAULT false,
    "airConditioning" BOOLEAN NOT NULL DEFAULT false,
    "alarm" BOOLEAN NOT NULL DEFAULT false,
    "centralLocking" BOOLEAN NOT NULL DEFAULT false,
    "powerSteering" BOOLEAN NOT NULL DEFAULT false,
    "rearCamera" BOOLEAN NOT NULL DEFAULT false,
    "bluetooth" BOOLEAN NOT NULL DEFAULT false,
    "usbPort" BOOLEAN NOT NULL DEFAULT false,
    "gps" BOOLEAN NOT NULL DEFAULT false,
    "alloyWheels" BOOLEAN NOT NULL DEFAULT false,
    "fogLights" BOOLEAN NOT NULL DEFAULT false,
    "sunroof" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Features_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cars_name_key" ON "public"."Cars"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Specifications_carId_key" ON "public"."Specifications"("carId");

-- CreateIndex
CREATE UNIQUE INDEX "Features_carId_key" ON "public"."Features"("carId");

-- AddForeignKey
ALTER TABLE "public"."Specifications" ADD CONSTRAINT "Specifications_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."Cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Features" ADD CONSTRAINT "Features_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."Cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
