"use client"
import { CarGrid } from "@/components/car-grid";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { useEffect } from "react";
import { getBodyworks, getBrands, GetCars, GetRankedCars } from "./actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import RankedCars from "@/components/rankedCars";
import BrandGrid from "@/components/brand-grid";
import BodyworkComponent from "@/components/BodyworkComponent";

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return

    GetCars()
    GetRankedCars()
    getBrands()
    getBodyworks()
    
  }, [session, status]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="w-full max-w-[1500px] mx-auto">
        <HeroSection />
        <BrandGrid />
        <RankedCars />
        <BodyworkComponent />
        <CarGrid />
      </main>
      <Footer />
    </div>
  );
}
