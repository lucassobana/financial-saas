import Link from "next/link";
import {
  Grid,
  LogOut,
  User,
  ShieldCheck,
  CircleHelp,
  Bell,
} from "lucide-react";
import { signOut } from "@/app/actions/auth";

export default function SettingsPage() {
  const settingsOptions = [
    {
      name: "Categorias",
      description: "Adicione ou edite as suas categorias de gastos",
      href: "/categories",
      icon: Grid,
    },
    {
      name: "Perfil",
      description: "Edite suas informações pessoais",
      href: "/profile",
      icon: User,
    },
    {
      name: "Notificações",
      description: "Configure seus alertas de gastos",
      href: "/notification",
      icon: Bell,
    },
    {
      name: "Segurança",
      description: "Proteja sua conta e altere sua senha",
      href: "/security",
      icon: ShieldCheck,
    },
    {
      name: "Ajuda & Suporte",
      description: "Dúvidas ou problemas com o Beta?",
      href: "/help",
      icon: CircleHelp,
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-32 font-sans">
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white border-b border-slate-200 shadow-sm">
        <h1 className="text-lg font-bold text-slate-700">Configurações</h1>
      </header>

      <main className="pt-20 px-6">
        {settingsOptions.map((option) => {
          const Icon = option.icon;

          return (
            <Link
              key={option.name}
              href={option.href}
              className="block bg-white border border-slate-200 shadow-sm rounded-lg p-4 mb-4 hover:bg-emerald-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
                  <Icon size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    {option.name}
                  </h2>
                  <p className="text-xs text-slate-500">{option.description}</p>
                </div>
              </div>
            </Link>
          );
        })}

        <form action={signOut} className="mt-8">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-white border border-red-100 text-red-600 p-4 rounded-lg shadow-sm hover:bg-red-50 transition-colors font-semibold text-sm"
          >
            <LogOut size={18} />
            Sair da Conta
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            FinFlow Beta v1.0.0
          </p>
        </div>
      </main>
    </div>
  );
}
