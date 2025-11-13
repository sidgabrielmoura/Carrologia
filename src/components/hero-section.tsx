"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSnapshot } from "valtio"
import { useLayout } from "@/stores/layout"

const banners = [
  {
    url: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
    title: "Explore modelos incríveis",
    subtitle: "Descubra detalhes completos de carros modernos e clássicos"
  },
  {
    url: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
    title: "Especificações detalhadas",
    subtitle: "Tudo o que você precisa saber para comparar modelos"
  },
  {
    url: "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg",
    title: "Seu guia automotivo",
    subtitle: "Uma vitrine digital para apaixonados por carros"
  }
]

export function HeroSection() {
  const layout = useSnapshot(useLayout)
  const [index, setIndex] = useState(0)

  const nextSlide = () => setIndex((i) => (i + 1) % banners.length)
  const prevSlide = () => setIndex((i) => (i - 1 + banners.length) % banners.length)

  useEffect(() => {
    const interval = setInterval(nextSlide, 8000)
    return () => clearInterval(interval)
  }, [])

  if (layout.isSearching) return null

  return (
    <section className="relative w-full h-[420px] md:h-[520px] overflow-hidden rounded-b-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${banners[index].url})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >

          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-white px-4">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold drop-shadow-lg truncate"
            >
              {banners[index].title}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-lg md:text-xl text-zinc-200 mt-3 max-w-xl mx-auto"
            >
              {banners[index].subtitle}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-3 rounded-full text-white backdrop-blur-sm transition cursor-pointer"
      >
        <ChevronLeft className="size-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-3 rounded-full text-white backdrop-blur-sm transition cursor-pointer"
      >
        <ChevronRight className="size-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300
              ${index === i ? "bg-white w-5!" : "bg-white/40"}`}
          />
        ))}
      </div>
    </section>
  )
}
