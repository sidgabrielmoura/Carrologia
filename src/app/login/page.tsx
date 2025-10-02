"use client"
import { Mail, Lock, Car } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import { Button } from '@/components/ui/button';

export default function LoginPage() {
    const route = useRouter()
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    })

    const handleLogin = async () => {
        setLoading(true);
        try {
            const result = await signIn("credentials", {
                redirect: true,
                email: userData.email,
                password: userData.password,
                callbackUrl: '/'
            });

            if (result?.error) {
                toast.error("Credenciais inválidas");
            } else {
                toast.success("Login realizado com sucesso");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro ao realizar login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-full min-h-screen bg-neutral-900 overflow-hidden">
            <div className="flex w-full min-h-screen mx-auto shadow-2xl shadow-neutral-950/70">
                <section className="hidden lg:flex flex-col justify-center items-start p-16 w-1/2 relative bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1542362567-b50a042782ec?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-amber-700/60 backdrop-blur-sm"></div>

                    <div className="relative z-10 text-white p-6 rounded-xl">
                        <Car className="w-12 h-12 text-amber-300 mb-4" />
                        <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                            Seu catálogo <span className="text-amber-300">automotivo</span> inteligente.
                        </h1>
                        <p className="text-xl opacity-90 border-l-4 border-amber-300 pl-4 italic">
                            A tecnologia que transforma a busca pelo seu próximo veículo em uma experiência premium e personalizada.
                        </p>
                        <div className="mt-12 text-sm opacity-70">
                            © 2025 Carrologia. Todos os direitos reservados.
                        </div>
                    </div>
                </section>

                <section className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-10 bg-white">
                    <div className="w-full max-w-xl h-[30rem] flex flex-col justify-center p-8 sm:p-12 rounded-3xl shadow-neutral-400/30 border border-zinc-300">

                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Bem-vindo de Volta
                            </h2>
                            <p className="text-gray-500">
                                Faça login para continuar a busca.
                            </p>
                        </div>

                        <form className="space-y-6" action={handleLogin}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 sr-only">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                        placeholder="Seu email"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 sr-only">
                                    Senha
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="password"
                                        type="password"
                                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                        placeholder="Sua senha"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full cursor-pointer bg-gradient-to-r from-amber-600 to-red-600 text-white py-5 rounded-xl font-semibold shadow-lg shadow-amber-500/50 hover:from-amber-700 hover:to-red-700 transition-all duration-200"
                            >
                                Entrar no Catálogo
                            </Button>
                        </form>
                    </div>
                </section>
            </div>
        </main>
    );
}