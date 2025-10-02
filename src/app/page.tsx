"use client"
import { CarGrid } from "@/components/car-grid";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { useEffect } from "react";
import { GetCars } from "./actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login");
    } else {
      GetCars();
    }
  }, [session, status]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <CarGrid />
      </main>
      <Footer />
    </div>
  );
}
