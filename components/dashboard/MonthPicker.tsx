"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays } from "lucide-react";

export function MonthPicker() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMonth =
    searchParams.get("month") || new Date().toISOString().slice(0, 7);

  const handleChange = (value: string | null) => {
    if (value) {
      router.push(`/?month=${value}`);
    }
  };

  // Gera uma lista simples dos últimos 6 meses para o MVP
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    // CRITICAL: Definimos o dia como 1 ANTES de mudar o mês
    // Isso evita o erro de transbordamento em meses curtos (ex: Fevereiro)
    d.setDate(1) 
    d.setMonth(d.getMonth() - i)
    
    return {
      value: d.toISOString().slice(0, 7),
      label: d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    }
  })

  return (
    <Select value={currentMonth} onValueChange={handleChange}>
      <SelectTrigger className="w-50 rounded-full bg-slate-50 border-slate-200">
        <CalendarDays className="mr-2 h-4 w-4 text-slate-500" />
        <SelectValue placeholder="Selecionar mês" />
      </SelectTrigger>

      <SelectContent>
        {months.map((m) => (
          <SelectItem key={m.value} value={m.value} className="capitalize">
            {m.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
