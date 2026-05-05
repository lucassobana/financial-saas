"use client";

import { deleteTransaction } from "@/app/actions/transactions";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ArrowUpCircle, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: "INCOME" | "EXPENSE";
  category_id?: string | null; 
  categories: { name: string; color: string } | null;
}

export function TransactionList({
  transactions,
  onEdit,
}: {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void; 
}) {
  
  const handleDelete = (id: string) => {
    toast("Tem certeza que deseja deletar esta transação?", {
      action: {
        label: "Deletar",
        onClick: async () => {
          try {
            await deleteTransaction(id);
            toast.success("Transação deletada com sucesso!");
          } catch (error: unknown) {
            if (error instanceof Error) {
              toast.error("Erro ao deletar: " + error.message);
            } else {
              toast.error("Erro ao deletar transação.");
            }
          }
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-300 text-slate-400">
        Nenhuma transação encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors py-2"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              {t.type === "INCOME" ? (
                <ArrowDownCircle className="text-emerald-500" size={24} />
              ) : (
                <ArrowUpCircle className="text-red-500" size={24} />
              )}
            </div>
            <div className="w-20">
              <p className="font-bold text-slate-800">{t.description}</p>
              <div className="flex flex-col gap-1 text-xs text-slate-500 mt-1">
                <span>
                  {new Date(t.date).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: t.categories?.color }}
                  ></span>
                  {t.categories?.name}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`font-bold ${t.type == "INCOME" ? "text-emerald-600 bg-emerald-200" : "text-red-600 bg-red-200"} px-3 py-1 rounded-full whitespace-nowrap`}
            >
              {t.type === "INCOME" ? "+" : "-"} R$ {Number(t.amount).toFixed(2)}
            </span>
            
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-[#006a3e] hover:bg-green-50 rounded-full h-8 w-8 transition-colors"
                onClick={() => onEdit(t)}
              >
                <Edit2 size={18} />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full h-8 w-8 transition-colors"
              onClick={() => handleDelete(t.id)}
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}