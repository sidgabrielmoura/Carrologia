import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user = await db.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const validPassword = await bcrypt.compare(body.password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { message: "Senha incorreta" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("💥 Erro no POST /api/login:", error);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
