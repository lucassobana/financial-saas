'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PieChart, Receipt, Settings } from 'lucide-react'

export function BottomNav() {
  // Esse hook do Next.js descobre em qual URL o usuário está agora
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', href: '/', icon: LayoutDashboard },
    { name: 'Categorias', href: '/categories', icon: PieChart },
    { name: 'Histórico', href: '/history', icon: Receipt },
    { name: 'Config', href: '/settings', icon: Settings },
  ]

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 py-3 bg-white/90 backdrop-blur-md border-t border-slate-200">
      {navItems.map((item) => {
        const Icon = item.icon
        // Verifica se a rota atual é exatamente igual ao href do botão
        const isActive = pathname === item.href

        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              isActive 
                ? 'text-emerald-600 bg-emerald-50' 
                : 'text-slate-400 hover:text-emerald-500'
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-bold">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}