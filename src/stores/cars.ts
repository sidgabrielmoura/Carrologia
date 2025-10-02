import { Prisma } from "@/generated/prisma"
import { proxy } from "valtio"

type CarsWithSpecificationsAndFeatures = Prisma.CarsGetPayload<{include: {specifications: true, features: true}}>

export const useCarsStore = proxy({
    cars: [] as CarsWithSpecificationsAndFeatures[],
    searchedCars: [] as CarsWithSpecificationsAndFeatures[]
})