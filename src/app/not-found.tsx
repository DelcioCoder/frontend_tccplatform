"use client"
import Goback from "@/components/GoBack";
import { Search, Home, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion } from 'framer-motion';


export default function NotFound() {
    return (
        <main className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-green-500 p-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-lg rounded-lg bg-white p-8 shadow-2xl"
            >
                <div className="relative mb-8 flex justify-center">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <AlertTriangle size={64} className="text-yellow-500" />
                    </motion.div>
                    <Search size={36} className="absolute bottom-0 right-1/3 text-blue-500" strokeWidth={2.5} />
                </div>

                <h1 className="mb-2 text-6xl font-bold text-gray-800">404</h1>
                <h2 className="mb-6 text-2xl font-semibold text-gray-700">Página não encontrada</h2>

                <p className="mb-4 text-gray-600">
                    Oops! Parece que você está em um lugar desconhecido.
                </p>
                <p className="mb-8 text-gray-600">
                    A página que você está procurando não foi encontrada. Talvez ela tenha sido movida ou o endereço esteja incorreto.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Goback />

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-white transition-all hover:bg-blue-600 hover:shadow-lg"
                    >
                        <Home size={16} />
                        <span>Ir para página inicial</span>
                    </Link>
                </div>
            </motion.div>

            <div className="mt-8 text-sm text-white">
                <p>Se você acredita que isso é um erro, por favor entre em contato com nosso suporte.</p>
            </div>
        </main>
    );
}