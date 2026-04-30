import { createClient } from "@/lib/supabase/server";
import { TransactionList } from "@/components/transactions/TransactionsList";
import { MonthFilter } from "@/components/dashboard/MonthFilter";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const supabase = await createClient();

  const isAllMonths = !month || month === "all";

  // 1. Construção da Query
  let query = supabase
    .from("transactions")
    .select(`*, categories(name, color)`)
    .order("date", { ascending: false });

  // 2. Aplica filtro apenas se não for "Todos"
  if (!isAllMonths && month) {
    const [year, monthStr] = month.split("-");
    const lastDay = new Date(Number(year), Number(monthStr), 0).getDate();
    query = query.gte("date", `${month}-01`).lte("date", `${month}-${lastDay}`);
  }

  const { data: transactions } = await query;

  return (
    <div className="bg-slate-50 min-h-screen pb-32 pt-6 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Histórico</h1>
          <p className="text-sm text-slate-500">
            {isAllMonths
              ? "Todas as transações registadas"
              : `Transações de ${month}`}
          </p>
        </div>
        <MonthFilter />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-2">
        {transactions && transactions.length > 0 ? (
          <TransactionList transactions={transactions} />
        ) : (
          <div className="p-12 text-center text-slate-400">
            Nenhuma transação encontrada para este período.
          </div>
        )}
      </div>
    </div>
  );
}
