import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

// Importe o seu novo componente
import { BottomNav } from "@/components/navigation/BottomNav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FinFlow - Controle Financeiro",
  description: "Seu MVP de controle financeiro pessoal.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* O children renderiza o conteúdo específico de cada página (Home, Categorias, etc) */}
        {children}
        
        {/* A barra de navegação fica fixa no final para todas as páginas */}
        <BottomNav />
      </body>
    </html>
  )
}