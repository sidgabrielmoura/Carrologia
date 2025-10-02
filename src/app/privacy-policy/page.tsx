import { Footer } from "@/components/footer";

export default function PrivacyPolicyPage() {
    return (
        <main className="flex flex-col items-center justify-center bg-gradient-to-b from-white to-neutral-50 w-full min-h-screen">
            <section className="flex flex-col items-center justify-center min-h-screen py-20">
                <div className="flex flex-col items-center border-2 px-7 py-20 rounded-2xl border-amber-500 bg-amber-500/10 max-w-4xl">
                    <section className="text-center max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900">
                            Política de Privacidade
                        </h1>
                        <p className="mt-4 text-lg text-neutral-600">
                            Sua privacidade é importante para nós. Esta Política explica como o{" "}
                            <strong>Carrologia</strong> coleta, usa e protege suas informações ao utilizar nosso site.
                        </p>
                    </section>

                    <section className="mt-10 w-full space-y-10 text-neutral-700 leading-relaxed">
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800">1. Coleta de Informações</h2>
                            <p className="mt-2">
                                Não solicitamos dados sensíveis ou financeiros. As informações coletadas são apenas para melhorar a navegação e a experiência do usuário, como cookies e dados anônimos de uso.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800">2. Uso das Informações</h2>
                            <p className="mt-2">
                                As informações são utilizadas exclusivamente para fins estatísticos e de melhoria contínua da plataforma. Nós <strong>não</strong> vendemos ou compartilhamos seus dados com terceiros.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800">3. Cookies</h2>
                            <p className="mt-2">
                                Utilizamos cookies apenas para lembrar preferências de navegação e facilitar sua experiência. Você pode desativá-los a qualquer momento nas configurações do navegador.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800">4. Segurança</h2>
                            <p className="mt-2">
                                Adotamos medidas técnicas e organizacionais para proteger suas informações contra acessos não autorizados, alterações ou destruição.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800">5. Alterações na Política</h2>
                            <p className="mt-2">
                                Podemos atualizar esta Política de Privacidade periodicamente. Recomendamos que você a consulte regularmente para estar ciente de possíveis mudanças.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800">6. Contato</h2>
                            <p className="mt-2">
                                Caso tenha dúvidas ou preocupações sobre esta política, entre em contato conosco pelo e-mail:{" "}
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
