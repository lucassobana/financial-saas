import { createClient } from "@/lib/supabase/server";
import { TransactionManager } from "@/components/transactions/TransactionManager";
import { SpendingDonut } from "@/components/charts/SpendingDonut";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { MonthFilter } from "@/components/dashboard/MonthFilter";
import Link from "next/link";
import { NewTransactionModal } from "@/components/transactions/NewTransactionModal";
import { redirect } from "next/navigation";
import { TypewriterText } from "@/components/animations/TypewriterText";

function calculateTrend(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

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
  let prevMonthQuery = supabase.from("transactions").select(`amount, type`);
  let hasPrevMonthData = false;

  if (!isAllMonths && month) {
    const [year, monthStr] = month.split("-");
    const lastDay = new Date(Number(year), Number(monthStr), 0).getDate();
    query = query.gte("date", `${month}-01`).lte("date", `${month}-${lastDay}`);

    const prevDate = new Date(Number(year), Number(monthStr) - 1, 1);
    prevDate.setMonth(prevDate.getMonth() - 1);
    const prevMonthTarget = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;
    const prevLastDay = new Date(
      prevDate.getFullYear(),
      prevDate.getMonth() + 1,
      0,
    ).getDate();

    prevMonthQuery = prevMonthQuery
      .gte("date", `${prevMonthTarget}-01`)
      .lte("date", `${prevMonthTarget}-${prevLastDay}`);
    hasPrevMonthData = true;
  }

  const [
    { data: transactions },
    { data: prevTransactions },
    { data: categories },
    {
      data: { user },
      error,
    },
  ] = await Promise.all([
    query,
    hasPrevMonthData ? prevMonthQuery : Promise.resolve({ data: null }),
    supabase.from("categories").select("*").order("name"),
    supabase.auth.getUser(),
  ]);

  if (error || !user) {
    redirect("/login");
  }

  const incomes =
    transactions
      ?.filter((t) => t.type === "INCOME")
      .reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const expenses =
    transactions
      ?.filter((t) => t.type === "EXPENSE")
      .reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const balance = incomes - expenses;

  const prevIncomes =
    prevTransactions
      ?.filter((t) => t.type === "INCOME")
      .reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const prevExpenses =
    prevTransactions
      ?.filter((t) => t.type === "EXPENSE")
      .reduce((acc, curr) => acc + curr.amount, 0) || 0;

  const incomeTrend = calculateTrend(incomes, prevIncomes);
  const expenseTrend = calculateTrend(expenses, prevExpenses);

  const userName = user.user_metadata?.full_name || "";

  return (
    <div className="min-h-screen pb-32 font-sans">
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 flex justify-center items-center gap-2 bg-[#006a3e] rounded-xl">
            <Wallet className="text-white w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            FinFlow
          </h1>
        </div>
        <MonthFilter />
      </header>

      <main className="mt-24 px-4 max-w-5xl mx-auto space-y-6">
        <p className="text-slate-500 text-lg font-light flex items-center h-7">
          Bem-vindo,{" "}
          <span className="text-emerald-700 font-bold ml-1.5">
            <TypewriterText text={userName} speed={80} />
          </span>
        </p>
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
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                    Entradas
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-emerald-600">
                      R${" "}
                      {incomes.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    {!isAllMonths && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                          incomeTrend >= 0
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {incomeTrend >= 0 ? (
                          <TrendingUp size={12} />
                        ) : (
                          <TrendingDown size={12} />
                        )}
                        {Math.abs(incomeTrend).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <ArrowDownCircle size={20} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                    Saídas
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-red-600">
                      R${" "}
                      {expenses.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    {!isAllMonths && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                          expenseTrend <= 0
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {expenseTrend > 0 ? (
                          <TrendingUp size={12} />
                        ) : (
                          <TrendingDown size={12} />
                        )}
                        {Math.abs(expenseTrend).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
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

            <TransactionManager
              transactions={transactions?.slice(0, 5) || []}
              categories={categories || []}
            />
          </div>
        </section>
      </main>
      <NewTransactionModal categories={categories || []} />
    </div>
  );
}
