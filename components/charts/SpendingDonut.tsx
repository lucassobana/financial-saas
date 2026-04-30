"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface Transaction {
  amount: number;
  type: "INCOME" | "EXPENSE";
  categories: { name: string; color: string } | null;
}

export function SpendingDonut({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const expensesByCategory = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce(
      (acc, t) => {
        const categoryName = t.categories?.name || "Outros";
        const categoryColor = t.categories?.color || "#cbd5e1";

        if (!acc[categoryName]) {
          acc[categoryName] = {
            name: categoryName,
            value: 0,
            fill: categoryColor,
          };
        }
        acc[categoryName].value += Number(t.amount);
        return acc;
      },
      {} as Record<string, { name: string; value: number; fill: string }>,
    );

  const data = Object.values(expensesByCategory);
  const totalExpenses = data.reduce((acc, curr) => acc + curr.value, 0);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400">
        Sem dados de gastos
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <ResponsiveContainer width="100%" height={340}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => {
              if (typeof value === "number") {
                return `R$ ${value.toFixed(2)}`;
              }
              return value;
            }}
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-sm text-slate-700">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
        <span className="text-xs text-slate-500 font-medium uppercase">
          Total
        </span>
        <span className="text-xl font-bold text-slate-800">
          R${" "}
          {totalExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}