"use client";

import { useSnapshot } from "valtio";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useBrandsStore } from "@/stores/brands";
import { use, useMemo, useState } from "react";
import { Link, SearchX, Video } from "lucide-react";
import { CarModal } from "@/components/car-modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatMoney } from "@/app/actions/utils";

export default function BrandCarsPage({ params }: { params: Promise<{ id: string }> }) {
    const [selectedCar, setSelectedCar] = useState<any | null>(null)
    const resolvedParams = use(params)
    const { brands } = useSnapshot(useBrandsStore)
    const brand = brands.find((b) => b.id === resolvedParams.id)
    const [search, setSearch] = useState("")

    const filteredCars = useMemo(() => {
        if (!brand?.cars) return [];
        const query = search.toLowerCase();
        return brand.cars.filter(
            (car) =>
                car.name.toLowerCase().includes(query) ||
                car.model.toLowerCase().includes(query)
        );
    }, [search, brand]);

    const handleOpenCarInformations = (car: any) => {
        console.log(car)
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

    if (!brand) return window.history.back()

    return (
        <main className="flex flex-col items-center min-h-[calc(100vh-100px)]">
            <section className="relative w-full py-10 bg-gradient-to-br from-amber-500 via-red-600 to-amber-700 flex items-center justify-center overflow-hidden">
                <button
                    onClick={() => window.history.back()}
                    className="absolute z-[999] top-6 left-6 flex cursor-pointer bg-zinc-300/30 backdrop-blur-sm border border-zinc-300 px-2 py-1 rounded-full items-center gap-2 text-white/80 hover:text-white transition"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="size-4"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-medium">Voltar</span>
                </button>
                <div className="relative z-10 flex flex-col w-full items-center text-center text-white">
                    <div className="relative">
                        <img
                            src={brand.logo_img || ''}
                            alt={brand.name || ''}
                            className="rounded-full bg-white/90 p-2 shadow-2xl object-cover size-28 min-w-28 min-h-28 ring-4 ring-white/20 hover:ring-white/40 transition-all duration-300"
                        />
                        <div className="absolute inset-0 rounded-full blur-2xl bg-white/10 animate-pulse" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold mt-5 drop-shadow-lg">
                        {brand.name}
                    </h1>
                    <p className="text-sm md:text-base text-gray-200/90 mt-2 max-w-[320px]">
                        Modelos disponíveis para comparar e investir
                    </p>

                    <div className="mt-6 w-full max-w-lg! relative px-4">
                        <input
                            type="text"
                            placeholder="Filtrar modelos..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-2 rounded-full bg-zinc-300/30 backdrop-blur-sm border border-zinc-300/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </section>

            <section className="max-w-[1500px] w-full px-6 py-10 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredCars.length > 0 ? filteredCars.map((car) => (
                    <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 p-0">
                        <div className="relative w-full max-h-48">
                            <img
                                src={car.imageUrl || ''}
                                alt={car.name}
                                className="object-cover h-full w-full"
                            />

                            <Button asChild size="icon" variant="secondary" className="absolute top-1 right-1">
                                <a href={car.videoUrl || ''} target="_blank"><Video /></a>
                            </Button>
                        </div>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>{car.name}</span>
                                {car.popular && <Badge>Popular</Badge>}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{car.model}</p>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 text-sm line-clamp-2">{car.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center pb-4">
                            <span className="font-semibold text-lg text-primary">
                                {formatMoney(car.fipe)}
                            </span>

                            <Button
                                onClick={() => handleOpenCarInformations(car)}
                                className="bg-accent cursor-pointer hover:bg-accent/90 text-accent-foreground"
                            >
                                Especificações
                            </Button>
                        </CardFooter>
                    </Card>
                )) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                        <div className="bg-zinc-300/20 backdrop-blur-sm border border-zinc-300/30 rounded-2xl p-8 max-w-sm w-full shadow-inner">
                            <SearchX className="size-20 mx-auto text-amber-500" />

                            <h2 className="text-xl font-semibold text-amber-500 mb-2">Nenhum carro encontrado</h2>
                            <p className="text-sm text-amber-500">
                                Tente ajustar o filtro ou verifique se essa marca possui modelos disponíveis.
                            </p>
                        </div>
                    </div>
                )}
            </section>

            {selectedCar && (

                <Dialog open={selectedCar} onOpenChange={() => setSelectedCar(null)}>
                    <DialogContent className="!max-w-7xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <DialogTitle className="text-2xl font-bold">
                                    {selectedCar.brand} {selectedCar.name}
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    Especificações técnicas completas
                                </DialogDescription>
                            </div>
                        </DialogHeader>

                        <div className="p-2">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <img
                                        src={selectedCar.imageUrl || "/placeholder.svg"}
                                        alt={`${selectedCar.brand} ${selectedCar.name}`}
                                        className="w-full h-64 object-cover rounded-lg border border-border"
                                    />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-sm uppercase">
                                                {selectedCar.specifications?.fuel === 'ELECTRIC' ? 'Eletricidade'
                                                    : selectedCar.specifications?.fuel === 'DIESEL' ? 'Diesel'
                                                        : selectedCar.specifications?.fuel === 'GASOLINE' ? 'Gasolina'
                                                            : selectedCar.specifications?.fuel === 'ETHANOL' ? 'Etanol'
                                                                : 'Híbrido'}
                                            </Badge>
                                            {selectedCar.popular && (
                                                <Badge className="bg-sky-700 text-zinc-50 text-sm uppercase">Popular</Badge>
                                            )}
                                        </div>
                                        <span className="text-2xl font-bold text-accent">
                                            {formatMoney(selectedCar.fipe)}
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full h-64 md:h-64 relative">
                                    <iframe
                                        className="w-full h-full rounded-lg border border-border"
                                        src={`${selectedCar.videoUrl}`}
                                        title={`${selectedCar.brand} ${selectedCar.name} video`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>

                            <div className="px-2">
                                <div className="flex gap-2">
                                    <h3 className="text-lg font-semibold text-card-foreground mb-4">
                                        Sobre o {`${selectedCar.brand} ${selectedCar.name}`}
                                    </h3>

                                    <h1 className="text-lg px-5 bg-blue-500 rounded-full text-zinc-50 font-semibold mb-4">
                                        {selectedCar.year}
                                    </h1>
                                </div>

                                <div className="text-justify py-5 subpixel-antialiased text-zinc-600 px-3 border border-zinc-400/80 rounded-lg border-dashed">
                                    {selectedCar.description}
                                </div>
                            </div>

                            <div className="p-6 border-t border-border bg-muted/30">
                                <p className="text-center text-muted-foreground text-sm w-full">
                                    Este é um site informativo. Não realizamos vendas de veículos.
                                </p>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </main>
    );
}
