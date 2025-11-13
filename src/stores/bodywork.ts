import { Prisma } from "@/generated/prisma";
import { proxy } from "valtio";

type Bodywork = Prisma.BodyworkTypeGetPayload<{ include: { cars: true } }>

export const useBodyworkStore = proxy({
    bodyworks: [] as Bodywork[]
})