import { NextResponse } from "next/server"
import { db } from "@/lib/prisma";

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

export async function DELETE(req: Request) {
  try {
    const body = await req.json()

    await db.features.delete({
      where: {
        carId: body.id
      }
    })

    await db.specifications.delete({
      where: {
        carId: body.id
      }
    })

    const cars = await db.cars.delete({
      where: {
        id: body.id
      }
    })

    return NextResponse.json(cars);
  } catch (error) {
    console.error("💥 Erro no POST /api/cars:", error);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}

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

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const videoUrl = body.carData.videoUrl
      ? getYoutubeEmbedUrl(body.carData.videoUrl)
      : null;

    const car = await db.cars.update({
      where: { id: body.id },
      data: {
        name: body.carData.name,
        brand: body.carData.brand,
        model: body.carData.model,
        fipe: body.carData.fipe,
        year: body.carData.year,
        imageUrl: body.carData.imageUrl,
        videoUrl,
        description: body.carData.description,
        popular: body.carData.popular
      },
    });

    const specifications = await db.specifications.upsert({
      where: { carId: body.id },
      create: {
        fuel: body.carData.specifications?.fuel,
        engine: body.carData.specifications?.engine,
        power: body.carData.specifications?.power,
        torque: body.carData.specifications?.torque,
        consumption: body.carData.specifications?.consumption,
        transmission: body.carData.specifications?.transmission,
        traction: body.carData.specifications?.traction,
        seats: body.carData.specifications?.seats,
        doors: body.carData.specifications?.doors,
        trunkCapacity: body.carData.specifications?.trunkCapacity,
        weight: body.carData.specifications?.weight,
        maxSpeed: body.carData.specifications?.maxSpeed,
        acceleration: body.carData.specifications?.acceleration,
        carId: body.id,
      },
      update: {
        fuel: body.carData.specifications?.fuel,
        engine: body.carData.specifications?.engine,
        power: body.carData.specifications?.power,
        torque: body.carData.specifications?.torque,
        consumption: body.carData.specifications?.consumption,
        transmission: body.carData.specifications?.transmission,
        traction: body.carData.specifications?.traction,
        seats: body.carData.specifications?.seats,
        doors: body.carData.specifications?.doors,
        trunkCapacity: body.carData.specifications?.trunkCapacity,
        weight: body.carData.specifications?.weight,
        maxSpeed: body.carData.specifications?.maxSpeed,
        acceleration: body.carData.specifications?.acceleration,
      },
    });

    const features = await db.features.upsert({
      where: { carId: body.id },
      create: {
        airBag: body.carData.features?.airBag ?? false,
        absBrakes: body.carData.features?.absBrakes ?? false,
        electricWindows: body.carData.features?.electricWindows ?? false,
        airConditioning: body.carData.features?.airConditioning ?? false,
        alarm: body.carData.features?.alarm ?? false,
        centralLocking: body.carData.features?.centralLocking ?? false,
        powerSteering: body.carData.features?.powerSteering ?? false,
        rearCamera: body.carData.features?.rearCamera ?? false,
        bluetooth: body.carData.features?.bluetooth ?? false,
        usbPort: body.carData.features?.usbPort ?? false,
        gps: body.carData.features?.gps ?? false,
        alloyWheels: body.carData.features?.alloyWheels ?? false,
        fogLights: body.carData.features?.fogLights ?? false,
        sunroof: body.carData.features?.sunroof ?? false,
        carId: body.id,
      },
      update: {
        airBag: body.carData.features?.airBag ?? false,
        absBrakes: body.carData.features?.absBrakes ?? false,
        electricWindows: body.carData.features?.electricWindows ?? false,
        airConditioning: body.carData.features?.airConditioning ?? false,
        alarm: body.carData.features?.alarm ?? false,
        centralLocking: body.carData.features?.centralLocking ?? false,
        powerSteering: body.carData.features?.powerSteering ?? false,
        rearCamera: body.carData.features?.rearCamera ?? false,
        bluetooth: body.carData.features?.bluetooth ?? false,
        usbPort: body.carData.features?.usbPort ?? false,
        gps: body.carData.features?.gps ?? false,
        alloyWheels: body.carData.features?.alloyWheels ?? false,
        fogLights: body.carData.features?.fogLights ?? false,
        sunroof: body.carData.features?.sunroof ?? false,
      },
    });

    return NextResponse.json({ car, specifications, features });
  } catch (error) {
    console.error("💥 Erro no PUT /api/cars/[id]:", error);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}