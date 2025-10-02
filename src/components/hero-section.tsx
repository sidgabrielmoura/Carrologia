import { useLayout } from "@/stores/layout";
import { useSnapshot } from "valtio";

export function HeroSection() {
  const layout = useSnapshot(useLayout)
  
  return (
    <>
      {!layout.isSearching && (
        <section className="pt-24 pb-16 bg-gradient-to-br from-background via-background to-accent/5">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
                Explore Modelos e Especificações de Carros
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
                Descubra informações detalhadas sobre os mais diversos modelos de carros. Uma vitrine digital completa para
                você explorar especificações técnicas e características.
              </p>
              <div className="inline-flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm text-accent font-medium">Apenas consulta • Não vendemos carros</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}