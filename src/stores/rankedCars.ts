import { Prisma } from "@/generated/prisma";
import { proxy } from "valtio";

type RankWithCars = Prisma.TopCarsGetPayload<{ include: { car: { include: { specifications: true, features: true } } } }>

export const useRankedCars = proxy({
    rank: [] as RankWithCars[]
})