import { createClient } from "@/lib/supabase/server";
import { TransactionList } from "@/components/transactions/TransactionsList";
import { MonthPicker } from "@/components/dashboard/MonthPicker";
import { Receipt } from "lucide-react";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const supabase = await createClient();

  const selectedMonth = month || new Date().toISOString().slice(0, 7);

  // CORREÇÃO: Descobrindo o último dia do mês exato
  const [year, monthStr] = selectedMonth.split("-");
  // No JS, ao pedir o dia '0' do mês seguinte, ele retorna o último dia do mês atual!
  const lastDay = new Date(Number(year), Number(monthStr), 0).getDate();

  const startDate = `${selectedMonth}-01`;
  const endDate = `${selectedMonth}-${lastDay}`;

  // Busca todas as transações do mês selecionado
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select(`*, categories(name, color)`)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false });

  // Se der erro no banco, agora vai aparecer no seu terminal (npm run dev)
  if (error) {
    console.error("Erro na busca do Supabase:", error.message);
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-32 font-sans">
      {/* Header Focado no Histórico */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-6 h-16 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Receipt className="text-emerald-600" size={24} />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Histórico
          </h1>
        </div>

        {/* Reutilizamos o seletor de meses mágico que criamos antes! */}
        <MonthPicker />
      </header>

      <main className="mt-24 px-4 max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-800">Movimentações do Mês</h2>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {transactions?.length || 0} registros
            </span>
          </div>

          {/* O componente TransactionList já sabe como renderizar tudo bonito */}
          <TransactionList transactions={transactions || []} />
        </div>
      </main>
    </div>
  );
}
