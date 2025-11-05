import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const brands = await db.brands.findMany({
      include: {
        cars: true,
      },
    });

    return NextResponse.json(brands);
  } catch (error: any) {
    console.error("Erro ao carregar marcas:", error);
    return NextResponse.json(
      { message: "Erro ao carregar as marcas", error: error.message },
      { status: 500 }
    );
  }
}
