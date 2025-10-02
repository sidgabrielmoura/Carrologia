import { NextResponse } from "next/server"
import { db } from "@/lib/prisma";

export async function POST() {
  try {
    const users = await db.user.findMany()

    return NextResponse.json(users);
  } catch (error) {
    console.error("💥 Erro no POST /api/tasks:", error);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try{
    const body = await req.json()

    const user = await db.user.delete({
      where: {
        id: body.id
      }
    })

    return NextResponse.json(user);
  }catch(error){
    console.log(error)
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}