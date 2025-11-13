import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cars = await db.cars.findMany({
      include: {
        specifications: true,
        features: true
      }
    })

    return NextResponse.json(cars);
  } catch (error) {
    console.error("💥 Erro no POST /api/tasks:", error);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}