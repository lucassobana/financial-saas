"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter } from "lucide-react";

export function MonthFilter() {
  const router = useRouter();
  const pathname = usePathname(); // Descobre se estamos em / ou /history ou /charts
  const searchParams = useSearchParams();
  const currentMonth = searchParams.get("month") || "all";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // Mantém o utilizador na mesma página, apenas altera o parâmetro ?month=
    if (value === "all") {
      router.push(pathname);
    } else {
      router.push(`${pathname}?month=${value}`);
    }
  };

  return (
    <div className="relative flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
      <Filter size={16} className="text-emerald-600 mr-2" />
      <select
        value={currentMonth}
        onChange={handleChange}
        className="bg-transparent text-sm font-bold text-slate-700 outline-none appearance-none"
      >
        <option value="all">Todos os meses</option>
        {Array.from({ length: 12 }).map((_, i) => {
          const d = new Date();
          d.setDate(1);
          d.setMonth(d.getMonth() - i);
          const value = d.toISOString().slice(0, 7);
          const label = d.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          });
          return (
            <option key={value} value={value}>
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </option>
          );
        })}
      </select>
    </div>
  );
}
