import { db } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST() {
    try{
        const response = await db.bodyworkType.findMany({
            include: {
                cars: true
            }
        })

        return NextResponse.json(response)
    }catch (error){
        console.log(error)
        return NextResponse.json({error: 'erro interno', status: 500})
    }
}