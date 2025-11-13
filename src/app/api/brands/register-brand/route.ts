import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!body.brand_name || !body.logo) {
            return NextResponse.json(
                { message: "Campos obrigatórios não foram enviados" },
                { status: 400 }
            );
        }

        const brand = await db.brands.create({
            data: {
                logo_img: body.logo,
                name: body.brand_name,
            }
        });

        return NextResponse.json({ brand });
    } catch (error) {
        console.error("Erro ao criar marca:", error);
        return NextResponse.json(
            { message: "Erro interno ao criar marca" },
            { status: 500 }
        );
    }
}
