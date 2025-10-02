import { NextResponse } from "next/server"
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const hashedPassword = body.password ? await bcrypt.hash(body.password, 10) : ''

    const user = await db.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword || '',
        role: body.role
      },
    })

    return NextResponse.json({ 
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    });
  } catch (error) {
    console.error("💥 Erro no POST /api/register:", error);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
