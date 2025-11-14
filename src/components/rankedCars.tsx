"use client"

import { useSnapshot } from "valtio"
import { Card, CardContent } from "./ui/card"
import { useRankedCars } from "@/stores/rankedCars"
import { motion } from "framer-motion"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { useLayout } from "@/stores/layout"
import { formatMoney } from "@/app/actions/utils"

export default function RankedCars() {
  const topCars = useSnapshot(useRankedCars)
  const layout = useSnapshot(useLayout)

  const scrollLeft = () => {
    const container = document.getElementById("ranked-scroll")
    if (container) container.scrollBy({ left: -350, behavior: "smooth" })
  }

  const scrollRight = () => {
    const container = document.getElementById("ranked-scroll")
    if (container) container.scrollBy({ left: 350, behavior: "smooth" })
  }

  if (layout.isSearching) return null

  return (
    <main className="w-full p-10 max-sm:p-1! relative">
      <section className="flex items-center justify-center py-6">
        <h1
          className="text-center font-extrabold text-4xl tracking-tight"
        >
          Top 10 Melhores Investimentos 2025
        </h1>
      </section>

      <button
        onClick={scrollLeft}
        className="absolute left-2 md:left-10 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-md"
      >
        ◀
      </button>

      <button
        onClick={scrollRight}
        className="absolute right-2 md:right-10 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-md"
      >
        ▶
      </button>

      <section
        id="ranked-scroll"
        className="flex gap-10 overflow-x-auto snap-x snap-mandatory p-8 scroll-smooth scrollbar-none"
      >
        {topCars.rank.map((rank, i) => (
          <motion.div
            key={rank.id}
            className="snap-center flex-shrink-0 max-w-[350px] relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ scale: 1.05 }}
          >
            <span
              className={cn(
                "absolute -right-6 top-40 z-20 text-[150px] font-black opacity-95 text-shadow-black/20 text-shadow-lg leading-none select-none",
                i === 0 && "text-red-600",
                i === 1 && "text-red-500",
                i === 2 && "text-red-400",
                i >= 3 && "text-red-400/80"
              )}
            >
              {rank.order}
            </span>

            <motion.div
              className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-100 shadow-2xl group"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <Card className="border-none bg-transparent p-0">
                <CardContent className="!p-0">
                  <div className="relative overflow-hidden">
                    <motion.img
                      src={rank.car.imageUrl || "/placeholder.svg"}
                      alt={`${rank.car.brand} ${rank.car.name}`}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-all duration-500"
                      whileHover={{}}
                    />

                    <div className="absolute top-3 right-3 space-x-1 z-10">
                      <Badge className="bg-red-600 text-white shadow-lg">
                        {rank.car.year}
                      </Badge>
                      {rank.car.popular && (
                        <Badge className="bg-yellow-500 text-black shadow-lg font-semibold">
                          Popular
                        </Badge>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-950/80" />
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold truncate mb-1">
                      {rank.car.brand} {rank.car.name}
                    </h3>
                    <p className="text-red-400 font-semibold text-lg mb-4">
                      {formatMoney(rank.car.fipe)}
                    </p>

                    <div className="space-y-1 text-sm mb-4">
                      <div className="flex justify-between gap-5">
                        <span>Motor:</span>
                        <span className="text-zinc-800/80 font-medium truncate">
                          {rank.car.specifications?.engine}
                        </span>
                      </div>
                      <div className="flex justify-between gap-5">
                        <span>Potência:</span>
                        <span className="text-zinc-800/80 font-medium truncate">
                          {rank.car.specifications?.power}
                        </span>
                      </div>
                      <div className="flex justify-between gap-5">
                        <span>Consumo:</span>
                        <span className="text-zinc-800/80 font-medium truncate">
                          {rank.car.specifications?.consumption}
                        </span>
                      </div>
                    </div>

                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold">
                      Ver Especificações Completas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </section>
    </main>
  )
}