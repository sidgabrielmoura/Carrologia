"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CarModal } from "./car-modal"
import { useCarsStore } from "@/stores/cars"
import { useSnapshot } from "valtio"
import { useLayout } from "@/stores/layout"
import { motion } from 'framer-motion'

interface Car {
  id: number
  name: string
  brand: string
  year: number
  image: string
  price: string
  engine: string
  fuel: string
  power: string
  consumption: string
  transmission: string
  features: string[]
}

const cars: Car[] = [
  {
    id: 1,
    name: "Civic",
    brand: "Honda",
    year: 2024,
    image: "/honda-civic-2024-sedan-silver.jpg",
    price: "R$ 135.000",
    engine: "1.5 Turbo",
    fuel: "Flex",
    power: "177 cv",
    consumption: "12,5 km/l",
    transmission: "CVT",
    features: ["Honda Sensing", "Central multimídia", "Ar condicionado digital", "Bancos em couro"],
  },
  {
    id: 2,
    name: "Corolla",
    brand: "Toyota",
    year: 2024,
    image: "/toyota-corolla-2024-sedan-white.jpg",
    price: "R$ 142.000",
    engine: "2.0 Hybrid",
    fuel: "Híbrido",
    power: "122 cv",
    consumption: "15,1 km/l",
    transmission: "CVT",
    features: ["Toyota Safety Sense", "Painel digital", "Carregador wireless", "Faróis LED"],
  },
  {
    id: 3,
    name: "Onix",
    brand: "Chevrolet",
    year: 2024,
    image: "/chevrolet-onix-2024-hatchback-red.jpg",
    price: "R$ 78.000",
    engine: "1.0 Turbo",
    fuel: "Flex",
    power: "116 cv",
    consumption: "13,2 km/l",
    transmission: "Manual",
    features: ["MyLink", "Ar condicionado", "Direção elétrica", "Vidros elétricos"],
  },
  {
    id: 4,
    name: "HB20",
    brand: "Hyundai",
    year: 2024,
    image: "/hyundai-hb20-2024-hatchback-blue.jpg",
    price: "R$ 72.000",
    engine: "1.0 Turbo",
    fuel: "Flex",
    power: "120 cv",
    consumption: "12,8 km/l",
    transmission: "Automático",
    features: ["Bluelink", "Central multimídia", "Câmera de ré", "Sensor de estacionamento"],
  },
  {
    id: 5,
    name: "T-Cross",
    brand: "Volkswagen",
    year: 2024,
    image: "/volkswagen-t-cross-2024-suv-gray.jpg",
    price: "R$ 115.000",
    engine: "1.0 TSI",
    fuel: "Flex",
    power: "128 cv",
    consumption: "11,9 km/l",
    transmission: "Automático",
    features: ["VW Play", "Teto solar", "Controle de cruzeiro", "Bancos ajustáveis"],
  },
  {
    id: 6,
    name: "Compass",
    brand: "Jeep",
    year: 2024,
    image: "/jeep-compass-2024-suv-black.jpg",
    price: "R$ 165.000",
    engine: "1.3 Turbo",
    fuel: "Flex",
    power: "185 cv",
    consumption: "10,2 km/l",
    transmission: "Automático",
    features: ["Uconnect", "Tração 4x4", "Teto panorâmico", "Sistema de som premium"],
  },
]

export function CarGrid() {
  const [selectedCar, setSelectedCar] = useState<any | null>(null)
  const carsStore = useSnapshot(useCarsStore);
  const layout = useSnapshot(useLayout)
  const [letterSelected, setLetterSelected] = useState('')

  const carsToShow = carsStore.searchedCars.length ? carsStore.searchedCars : carsStore.cars;

  const quickSearch = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

  const handleQuickSearchCars = (startsWith: string) => {
    if (letterSelected === startsWith) {
      setLetterSelected('')
      useCarsStore.searchedCars = []
      return
    }

    setLetterSelected(startsWith)
    const currentFiltered = carsStore.searchedCars;
    if (currentFiltered.length && currentFiltered[0]?.name?.toLowerCase().startsWith(startsWith)) {
      useCarsStore.searchedCars = []
      return;
    }

    const filteredCars = carsStore.cars.filter((car: any) =>
      car.name.toLowerCase().startsWith(startsWith.toLowerCase()) ||
      car.brand.toLowerCase().startsWith(startsWith.toLowerCase())
    )

    useCarsStore.searchedCars = filteredCars
  }

  const handleOpenCarInformations = (car: any) => {
    if ((window as any)._fbq) {
      (window as any).fbq('trackCustom', 'ViewCarInformations', {
        car_brand: car.brand,
        car_name: car.name,
        car_id: car.id
      }, {
        eventID: crypto.randomUUID()
      })
    }
    setSelectedCar(car)
  }

  return (
    <>
      <section className="py-16 bg-background">
        {/* {!layout.isSearching && (
          <div className="flex flex-wrap w-full justify-center items-center gap-2 mb-8">
            {quickSearch.map((item, i) => (
              <Button onClick={() => handleQuickSearchCars(item)} key={i} variant={letterSelected === item ? 'default' : 'outline'} size={'icon'} className="cursor-pointer text-md size-12 uppercase">{item}</Button>
            ))}
          </div>
        )} */}
        <div className="container mx-auto">
          {!layout.isSearching && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Modelos em Destaque</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore nossa seleção de carros com informações detalhadas sobre especificações técnicas e
                características.
              </p>
            </div>
          )}

          <motion.div
            className="flex items-center gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2"
            whileTap={{ cursor: "grabbing" }}
          >
            {carsToShow.map((car) => (
              <motion.div
                key={car.id}
                className="snap-center flex-shrink-0 w-[300px]"
                whileHover={{ scale: 1.01 }}
              >
                <Card
                  key={car.id}
                  className="group hover:shadow-lg mt-6 transition-all duration-300 border-border hover:border-accent/50 p-0"
                >
                  <CardContent className="!p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={car.imageUrl || "/placeholder.svg"}
                        alt={`${car.brand} ${car.name}`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 space-x-1">
                        <Badge className="bg-accent text-accent-foreground">{car.year}</Badge>
                        {car.popular && (
                          <Badge className="bg-sky-500 text-accent-foreground">Popular</Badge>
                        )}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3 gap-2">
                        <h3 className="text-xl font-bold text-foreground truncate">
                          {car.brand} {car.name}
                        </h3>
                        <span className="text-lg font-semibold text-accent text-nowrap">R$ {car.fipe.toFixed(3)}</span>
                      </div>

                      <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                        <div className="flex justify-between gap-3">
                          <span>Motor:</span>
                          <span className="font-medium text-foreground truncate">{car.specifications?.engine}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span>Potência:</span>
                          <span className="font-medium text-foreground truncate">{car.specifications?.power}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span>Consumo:</span>
                          <span className="font-medium text-foreground truncate">{car.specifications?.consumption}</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleOpenCarInformations(car)}
                        className="w-full bg-accent cursor-pointer hover:bg-accent/90 text-accent-foreground"
                      >
                        Ver Especificações Completas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="w-full flex justify-center mt-8">
            <Button variant={'outline'} className="cursor-pointer px-10">Ver todos</Button>
          </div>
        </div>
      </section >

      <CarModal open car={selectedCar} onClose={() => setSelectedCar(null)} />
    </>
  )
}
