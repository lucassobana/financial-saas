"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, Receipt, Settings } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: LayoutDashboard },
    { name: "Gráficos", href: "/charts", icon: BarChart3 },
    { name: "Histórico", href: "/history", icon: Receipt },
    { name: "Config", href: "/settings", icon: Settings },
  ];

  const hiddenRoutes = ["/login", "/admin/create-user"];

  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 py-3 bg-white/90 backdrop-blur-md border-t border-slate-200">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (pathname.startsWith(`${item.href}/`) && item.href !== "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              isActive
                ? "text-emerald-600 bg-emerald-50"
                : "text-slate-400 hover:text-emerald-500"
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-bold">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
