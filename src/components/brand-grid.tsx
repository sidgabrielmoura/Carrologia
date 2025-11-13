"use client"

import { useBrandsStore } from "@/stores/brands"
import { useSnapshot } from "valtio"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"
import { useLayout } from "@/stores/layout"
import { useRouter } from "next/navigation"

export default function BrandGrid() {
    const brandStore = useSnapshot(useBrandsStore)
    const trackRef = useRef<HTMLDivElement>(null)
    const layout = useSnapshot(useLayout)
    const route = useRouter()

    const scrollAmount = 250

    const handleScroll = (dir: "left" | "right") => {
        if (!trackRef.current) return
        const direction = dir === "left" ? -scrollAmount : scrollAmount

        trackRef.current.scrollTo({
            left: trackRef.current.scrollLeft + direction,
            behavior: "smooth"
        })
    }

    const handleNavigateBrandCarsPage = (id: string) => {
        route.push(`/brand/${id}`)
    }

    if (layout.isSearching) return null

    return (
        <main className="relative w-full">
            <motion.button
                onClick={() => handleScroll("left")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 
                   bg-zinc-900 p-3 rounded-full border border-zinc-700 shadow-lg"
            >
                <ChevronLeft className="text-white" />
            </motion.button>

            <motion.button
                onClick={() => handleScroll("right")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 
                   bg-zinc-900 p-3 rounded-full border border-zinc-700 shadow-lg"
            >
                <ChevronRight className="text-white" />
            </motion.button>

            <div
                ref={trackRef}
                className="overflow-x-auto hide-scrollbar w-full px-6 py-10"
            >
                <div className="flex gap-6">
                    {brandStore.brands.map((item, index) => (
                        <motion.div
                            onClick={() => handleNavigateBrandCarsPage(item.id)}
                            key={item.id || index}
                            className="min-w-[160px] h-44 bg-zinc-200 rounded-xl border border-t-zinc-600/20 shadow-lg flex flex-col items-center justify-center hover:scale-105 hover:shadow-xl transition-all cursor-pointer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <img
                                src={item.logo_img || ''}
                                alt={item.name || ''}
                                className="w-20 h-20 object-contain"
                            />
                            <p className="mt-3 text-sm text-zinc-900 font-bold">
                                {item.name}
                            </p>
                        </motion.div>
                    ))}

                    <div className="min-w-[20px]" />
                </div>
            </div>

            <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </main>
    )
}
