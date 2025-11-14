"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Prisma } from "@/generated/prisma"
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog"
import { formatMoney } from "@/app/actions/utils"

type CarWithSpacificationsAndFeatures = Prisma.CarsGetPayload<{ include: { specifications: true, features: true } }>

interface CarDialogProps {
  open: boolean
  onClose: () => void
  car: CarWithSpacificationsAndFeatures
}

const featureLabels: Record<string, string> = {
  airBag: "Air Bag",
  absBrakes: "Freios ABS",
  airConditioning: "Ar-condicionado",
  alarm: "Alarme",
  alloyWheels: "Rodas de Liga Leve",
  bluetooth: "Bluetooth",
  centralLocking: "Trava Elétrica",
  electricWindows: "Vidros Elétricos",
  fogLights: "Faróis de Neblina",
  gps: "GPS",
  powerSteering: "Direção Hidráulica",
  rearCamera: "Câmera de Ré",
  sunroof: "Teto Solar",
  usbPort: "Entrada USB",
};

export function CarModal({ car, onClose, open }: CarDialogProps) {
  if (!car) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <DialogTitle className="text-2xl font-bold">
              {car.brand} {car.name} {car.year}
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
                src={car.imageUrl || "/placeholder.svg"}
                alt={`${car.brand} ${car.name}`}
                className="w-full h-64 object-cover rounded-lg border border-border"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm uppercase">
                    {car.specifications?.fuel === 'ELECTRIC' ? 'Eletricidade'
                      : car.specifications?.fuel === 'DIESEL' ? 'Diesel'
                        : car.specifications?.fuel === 'GASOLINE' ? 'Gasolina'
                          : car.specifications?.fuel === 'ETHANOL' ? 'Etanol'
                            : 'Híbrido'}
                  </Badge>
                  {car.popular && (
                    <Badge className="bg-sky-700 text-zinc-50 text-sm uppercase">Popular</Badge>
                  )}
                </div>
                <span className="text-2xl font-bold text-accent">
                  {formatMoney(car.fipe)}
                </span>
              </div>
            </div>

            <div className="w-full h-64 md:h-64 relative">
              <iframe
                className="w-full h-full rounded-lg border border-border"
                src={`${car.videoUrl}`}
                title={`${car.brand} ${car.name} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground my-4">
                Especificações Técnicas
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Motor</span>
                  <span className="font-medium text-card-foreground">
                    {car.specifications?.engine}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Combustível</span>
                  <span className="font-medium text-card-foreground">
                    {car.specifications?.fuel === 'ELECTRIC' ? 'Eletricidade'
                      : car.specifications?.fuel === 'DIESEL' ? 'Diesel'
                        : car.specifications?.fuel === 'GASOLINE' ? 'Gasolina'
                          : car.specifications?.fuel === 'ETHANOL' ? 'Etanol'
                            : 'Híbrido'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Potência</span>
                  <span className="font-medium text-card-foreground">
                    {car.specifications?.power}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Consumo</span>
                  <span className="font-medium text-card-foreground">
                    {car.specifications?.consumption}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Transmissão</span>
                  <span className="font-medium text-card-foreground">
                    {car.specifications?.transmission === 'AUTOMATIC' ? 'Automático'
                      : car.specifications?.transmission === 'MANUAL' ? 'Manual'
                        : car.specifications?.transmission === 'SEMI_AUTOMATIC' ? 'Semi-Automático'
                          : car.specifications?.transmission}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-card-foreground my-4">
              Principais Características
            </h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(car.features || {})
                .filter(([key, value]) => typeof value === "boolean")
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="flex min-w-[250px] flex-1 items-center justify-between p-2 border rounded-lg text-sm"
                  >
                    <span className="text-muted-foreground">
                      {featureLabels[key] || key}
                    </span>
                    {value ? (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                        Sim
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-500/20 text-red-700">
                        Não
                      </Badge>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="px-2">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Sobre o {`${car.brand} ${car.name}`}
          </h3>

          <div className="text-justify py-5 subpixel-antialiased text-zinc-600 px-3 border border-zinc-400/80 rounded-lg border-dashed">
            {car.description}
          </div>
        </div>

        <div className="p-6 border-t border-border bg-muted/30">
          <p className="text-center text-muted-foreground text-sm w-full">
            Este é um site informativo. Não realizamos vendas de veículos.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
