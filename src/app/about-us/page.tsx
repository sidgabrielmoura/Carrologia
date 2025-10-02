import { Footer } from "@/components/footer";

export default function AboutPage() {
    return (
        <main className="flex flex-col items-center justify-center bg-gradient-to-b from-white to-neutral-50 w-full min-h-screen">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center h-screen">
                <div className="flex flex-col items-center border-2 px-7 py-20 rounded-2xl border-amber-500 bg-amber-500/10">
                    <section className="text-center max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900">
                            Sobre Nós
                        </h1>
                        <p className="mt-4 text-lg text-neutral-600">
                            Conheça a história por trás do <strong>Carrologia</strong>, uma vitrine
                            digital criada para apaixonados por carros que buscam informações
                            detalhadas sobre modelos, especificações e características.
                        </p>
                    </section>

                    {/* Aviso */}
                    <div className="mt-6 px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-medium">
                        🚗 Apenas consulta • Não vendemos carros
                    </div>

                    {/* Conteúdo */}
                    <section className="mt-8 max-w-4xl space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-neutral-800">
                                Nossa Missão
                            </h2>
                            <p className="mt-3 text-neutral-600 leading-relaxed">
                                Facilitar o acesso a informações automotivas confiáveis, permitindo
                                que você explore especificações técnicas e descubra detalhes que
                                ajudam na escolha e conhecimento sobre diferentes modelos.
                            </p>
                        </div>

                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-neutral-800">
                                Como Surgiu
                            </h2>
                            <p className="mt-3 text-neutral-600 leading-relaxed">
                                O <strong>Carrologia</strong> nasceu da paixão por carros e da
                                necessidade de reunir em um só lugar dados técnicos e históricos
                                sobre veículos. Criamos uma plataforma simples, bonita e acessível
                                para todos que compartilham desse interesse.
                            </p>
                        </div>

                        <div className="text-center mb-3">
                            <h2 className="text-2xl font-semibold text-neutral-800">
                                Nosso Compromisso
                            </h2>
                            <p className="mt-3 text-neutral-600 leading-relaxed">
                                Estamos sempre atualizando nossa base de dados para garantir que
                                você tenha acesso às informações mais completas e organizadas sobre
                                o mundo automotivo.
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
