import { createClient } from "@/lib/supabase/server";
import { TransactionList } from "@/components/transactions/TransactionsList";
import { SpendingDonut } from "@/components/charts/SpendingDonut";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import { MonthFilter } from "@/components/dashboard/MonthFilter";
import Link from "next/link";
import { NewTransactionModal } from "@/components/transactions/NewTransactionModal";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const supabase = await createClient();

  const isAllMonths = !month || month === "all";

  let query = supabase
    .from("transactions")
    .select(`*, categories(name, color)`)
    .order("date", { ascending: false });

  if (!isAllMonths && month) {
    const [year, monthStr] = month.split("-");
    const lastDay = new Date(Number(year), Number(monthStr), 0).getDate();
    query = query.gte("date", `${month}-01`).lte("date", `${month}-${lastDay}`);
  }

  const { data: transactions } = await query;
  const { data: categories } = await supabase.from("categories").select("*").order("name");

  const incomes = transactions?.filter((t) => t.type === "INCOME").reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const expenses = transactions?.filter((t) => t.type === "EXPENSE").reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const balance = incomes - expenses;

  return (
    <div className="bg-slate-50 min-h-screen pb-32 font-sans">
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Wallet className="text-emerald-600" size={24} />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            FinFlow
          </h1>
        </div>
        <MonthFilter />
      </header>

      <main className="mt-24 px-4 max-w-5xl mx-auto space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <Card className="md:col-span-8 bg-emerald-700 text-white overflow-hidden relative border-none shadow-md">
            <CardContent className="p-8 relative z-10">
              <p className="text-emerald-100 text-sm font-medium opacity-90 uppercase">
                {isAllMonths ? "Saldo Acumulado Total" : "Saldo do Mês"}
              </p>
              <h2 className="text-4xl font-bold mt-2">
                R${" "}
                {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </h2>
            </CardContent>
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </Card>

          <div className="md:col-span-4 grid grid-cols-1 gap-4">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">
                    Entradas
                  </p>
                  <p className="text-xl font-bold text-emerald-600 mt-1">
                    R$ {incomes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <ArrowDownCircle size={20} />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">
                    Saídas
                  </p>
                  <p className="text-xl font-bold text-red-600 mt-1">
                    R$ {expenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                  <ArrowUpCircle size={20} />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <h3 className="font-bold text-slate-800 mb-6">
                Gastos por Categoria
              </h3>
              <SpendingDonut transactions={transactions || []} />
            </CardContent>
          </Card>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800">Atividade Recente</h3>
              <Button variant="link" className="text-emerald-600 text-sm p-0">
                <Link href="/history">Ver tudo</Link>
              </Button>
            </div>
            <TransactionList transactions={transactions?.slice(0, 5) || []} />
          </div>
        </section>
      </main>
      <NewTransactionModal categories={categories || []} />
    </div>
  );
}