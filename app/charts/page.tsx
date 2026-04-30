import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyBarChart } from "@/components/charts/MonthlyBarChart";
import { MonthFilter } from "@/components/dashboard/MonthFilter";

export default async function ChartsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const supabase = await createClient();
  const isAllMonths = !month || month === "all";

  let query = supabase.from("transactions").select("amount, date, type");

  if (!isAllMonths && month) {
    const [year, monthStr] = month.split("-");
    const lastDay = new Date(Number(year), Number(monthStr), 0).getDate();
    query = query.gte("date", `${month}-01`).lte("date", `${month}-${lastDay}`);
  }

  const { data: transactions } = await query;

  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const monthlyDataMap: Record<string, number> = {};
  meses.forEach((m) => (monthlyDataMap[m] = 0));

  transactions
    ?.filter((t) => t.type === "EXPENSE")
    .forEach((t) => {
      const monthIndex = parseInt(t.date.split("-")[1]) - 1;
      monthlyDataMap[meses[monthIndex]] += Number(t.amount);
    });

  const chartData = meses.map((m) => ({ month: m, value: monthlyDataMap[m] }));

  return (
    <div className="bg-slate-50 min-h-screen pb-32 pt-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Análise de Gastos</h1>
        <MonthFilter />
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">
            {isAllMonths ? "Gastos por Mês (Ano Atual)" : `Gastos em ${month}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyBarChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
