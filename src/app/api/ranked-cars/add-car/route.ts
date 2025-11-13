import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const orders = await db.topCars.findMany({
            select: {
                order: true
            }
        })

        const lastOrder = orders.length + 1

        if(lastOrder > 10){
            return NextResponse.json({error: 'Só é permitido 10 carros no rank, remova algum para adicionar outro!', status: 400});
        }

        const carToRank = await db.topCars.create({
            data: {
                carId: body.car_id,
                order: lastOrder
            }
        })

        return NextResponse.json(carToRank);
    } catch (error) {
        console.error("💥 Erro no POST /api/register:", error);
        return NextResponse.json({ message: "Erro interno" }, { status: 500 });
    }
}