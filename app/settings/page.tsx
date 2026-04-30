import Link from "next/link";
import { Grid } from "lucide-react";

export default function SettingsPage() {
  const settingsOptions = [
    {
      name: "Categorias",
      description: "Adicione ou edite as suas categorias de gastos",
      href: "/categories",
      icon: Grid,
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
              className="block bg-white border border-slate-200 shadow-sm rounded-lg p-4 mb-4 hover:bg-emerald-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Icon size={24} className="text-emerald-600" />
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
      </main>
    </div>
  );
}
