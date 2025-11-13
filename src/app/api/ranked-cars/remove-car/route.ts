import { db } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(req: Request) {
    try {
        const body = await req.json()

        if (!body.carId) {
            return NextResponse.json({
                error: "carId não enviado na requisição",
                status: 400
            })
        }

        const response = await db.topCars.delete({
            where: {
                carId: body.carId
            }
        })

        if (!response) {
            return NextResponse.json({
                error: "não foi possível remover o carro do rank",
                status: 400
            })
        }

        return NextResponse.json(response)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Erro interno', status: 500 })
    }
}