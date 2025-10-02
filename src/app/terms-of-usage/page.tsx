import { Footer } from "@/components/footer";

export default function TermsOfUsePage() {
    return (
        <main className="flex flex-col items-center justify-center bg-gradient-to-b from-white to-neutral-50 w-full min-h-screen">
            <section className="flex flex-col items-center justify-center min-h-screen py-20">
                <div className="flex flex-col items-center border-2 px-7 py-20 rounded-2xl border-amber-500 bg-amber-500/10 max-w-4xl">
                    <section className="text-center max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900">
                            Termos de Uso
                        </h1>
                        <p className="mt-4 text-lg text-neutral-600">
                            Estes Termos regulam o uso do <strong>Carrologia</strong>. 
                            Ao acessar nosso site, você concorda com as condições descritas abaixo.
                        </p>
                    </section>

                    <section className="mt-10 w-full space-y-10 text-neutral-700 leading-relaxed">
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800">1. Finalidade do Site</h2>
                            <p className="mt-2">
                                O <strong>Carrologia</strong> é uma plataforma digital de consulta que fornece informações
                                sobre modelos de carros, suas especificações técnicas e características. 
                                Não realizamos vendas ou intermediações de veículos.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800">2. Uso Correto</h2>
                            <p className="mt-2">
                                O usuário se compromete a utilizar o site apenas para fins de consulta e pesquisa,
                                respeitando as leis vigentes e não praticando atividades que possam comprometer a
                                segurança ou funcionamento da plataforma.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800">3. Conteúdo Informativo</h2>
                            <p className="mt-2">
                                As informações apresentadas são de caráter consultivo e podem variar de acordo com as
                                fontes utilizadas. O <strong>Carrologia</strong> não se responsabiliza por decisões tomadas
                                exclusivamente com base nos dados exibidos.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800">4. Direitos Autorais</h2>
                            <p className="mt-2">
                                Todo o conteúdo exibido no site, incluindo textos, imagens e layout, é protegido por direitos
                                autorais e não pode ser reproduzido ou utilizado sem autorização prévia.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800">5. Alterações nos Termos</h2>
                            <p className="mt-2">
                                Podemos atualizar estes Termos de Uso periodicamente. O uso contínuo da plataforma
                                após alterações implica na aceitação das novas condições.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800">6. Contato</h2>
                            <p className="mt-2">
                                Em caso de dúvidas sobre estes Termos, entre em contato pelo e-mail:{" "}
                                <a href="mailto:contato@carrologia.com" className="text-amber-600 underline">
                                    contato@carrologia.com
                                </a>.
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
