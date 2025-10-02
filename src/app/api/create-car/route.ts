import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (parsedUrl.hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.replace("/", "");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    return url; 
  } catch {
    return url;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const videoUrl = body.videoUrl
      ? getYoutubeEmbedUrl(body.videoUrl)
      : null;

    const car = await db.cars.create({
      data: {
        name: body.name,
        brand: body.brand,
        model: body.model,
        fipe: body.fipe,
        year: body.year,
        imageUrl: body.imageUrl,
        videoUrl,
        description: body.description,
      },
    });

    const specifications = await db.specifications.create({
      data: {
        fuel: body.specifications.fuel,
        engine: body.specifications.engine,
        power: body.specifications.power,
        torque: body.specifications.torque,
        consumption: body.specifications.consumption,
        transmission: body.specifications.transmission,
        traction: body.specifications.traction,
        seats: body.specifications.seats,
        doors: body.specifications.doors,
        trunkCapacity: body.specifications.trunkCapacity,
        weight: body.specifications.weight,
        maxSpeed: body.specifications.maxSpeed,
        acceleration: body.specifications.acceleration,
        carId: car.id,
      },
    });

    const features = await db.features.create({
      data: {
        airBag: body.features.airBag,
        absBrakes: body.features.absBrakes,
        electricWindows: body.features.electricWindows,
        airConditioning: body.features.airConditioning,
        alarm: body.features.alarm,
        centralLocking: body.features.centralLocking,
        powerSteering: body.features.powerSteering,
        rearCamera: body.features.rearCamera,
        bluetooth: body.features.bluetooth,
        usbPort: body.features.usbPort,
        gps: body.features.gps,
        alloyWheels: body.features.alloyWheels,
        fogLights: body.features.fogLights,
        sunroof: body.features.sunroof,
        carId: car.id, 
      },
    });

    return NextResponse.json({
      car,
      specifications,
      features,
    });
  } catch (error) {
    console.error("💥 Erro no POST /api/cars:", error);
    return NextResponse.json(
      { message: "Erro interno ao criar carro" },
      { status: 500 }
    );
  }
}
