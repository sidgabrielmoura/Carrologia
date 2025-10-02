import { Footer } from "@/components/footer";

export default function HowToUsePage() {
    return (
        <main className="flex flex-col items-center justify-center bg-gradient-to-b from-white to-neutral-50 w-full min-h-screen">
            <section className="flex flex-col items-center justify-center min-h-screen py-20">
                <div className="flex flex-col items-center border-2 px-7 py-20 rounded-2xl border-amber-500 bg-amber-500/10 max-w-4xl">
                    <section className="text-center max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900">
                            Como Usar o Carrologia
                        </h1>
                        <p className="mt-4 text-lg text-neutral-600">
                            O <strong>Carrologia</strong> foi criado para ajudar você a encontrar informações detalhadas
                            sobre modelos de carros e responder às suas principais dúvidas automotivas.
                        </p>
                    </section>

                    <section className="mt-10 w-full space-y-10 text-neutral-700 leading-relaxed">
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800">1. Busque por Modelos</h2>
                            <p className="mt-2">
                                Utilize a barra de busca no topo da página para procurar pelo modelo de carro que deseja conhecer. 
                                Você pode pesquisar pelo nome, marca ou ano do veículo.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800">2. Explore Detalhes Técnicos</h2>
                            <p className="mt-2">
                                Cada carro possui uma página dedicada com informações sobre motor, desempenho,
                                consumo, ano de fabricação e características adicionais.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800">3. Tire Suas Dúvidas</h2>
                            <p className="mt-2">
                                Caso tenha dúvidas sobre especificações ou queira entender melhor determinado modelo, 
                                explore nossa seção de perguntas frequentes ou entre em contato com nossa equipe.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800">4. Navegue nos Destaques</h2>
                            <p className="mt-2">
                                Além da busca, você pode explorar nossa lista de <strong>Modelos em Destaque</strong> na página inicial,
                                onde apresentamos veículos populares e clássicos para consulta rápida.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800">5. Lembre-se</h2>
                            <p className="mt-2">
                                🚗 O <strong>Carrologia</strong> é apenas uma vitrine digital de informações. 
                                Não realizamos a venda de veículos, apenas fornecemos dados para consulta.
                            </p>
                        </div>
                    </section>
                </div>
            </section>

            <div className="w-full">
                <Footer />
            </div>
        </main>
    );
}
