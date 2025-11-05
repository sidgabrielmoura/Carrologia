import { Prisma } from "@/generated/prisma";
import { proxy } from "valtio";

type BrandType = Prisma.BrandsGetPayload<{ include: { cars: true } }>

export const useBrandsStore = proxy({
    brands: [] as BrandType[]
})