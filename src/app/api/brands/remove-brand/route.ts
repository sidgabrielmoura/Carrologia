import { db } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(req: Request) {
    try{
        const body = await req.json()

        const response = await db.brands.delete({
            where: {
                id: body.id
            }
        })

        return NextResponse.json({message: 'Marca deletada com sucesso', response})
    }catch (error){
        console.log(error)
        return NextResponse.json({message: 'Erro ao deletar marca', status: 400})
    }
}