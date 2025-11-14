import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    const body = await req.json()
    try {
        const bodywork = await db.bodyworkType.delete({
            where: {
                id: body.id,
            }
        })

        return NextResponse.json(bodywork);
    } catch (error) {
        console.error("💥 Erro no POST /api/tasks:", error);
        return NextResponse.json({ message: "Erro interno" }, { status: 500 });
    }
}