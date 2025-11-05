import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const brand = db.brands.create({
            data: {
                logo_img: body.logo,
                name: body.brand_name,
            }
        })

        return NextResponse.json({
            brand
        })
    } catch (error) {
        return NextResponse.json(
            { message: "Erro interno ao criar marca" },
            { status: 500 }
        )
    }
}