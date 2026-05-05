"use client";

import { deleteTransaction } from "@/app/actions/transactions";
import { Button } from "@/components/ui/button";
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Trash2, 
  Edit2, 
  Receipt, 
  PlusCircle 
} from "lucide-react";
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
  onEdit?: (transaction: Transaction | null) => void; 
}) {
  
  const handleDelete = (id: string) => {
    toast("Tem certeza que deseja apagar esta transação?", {
      action: {
        label: "Apagar",
        onClick: async () => {
          try {
            await deleteTransaction(id);
            toast.success("Transação apagada com sucesso!", { duration: 1500 });
          } catch (error: unknown) {
            if (error instanceof Error) {
              toast.error("Erro ao apagar: " + error.message, { duration: 2000 });
            } else {
              toast.error("Erro ao apagar transação.", { duration: 2000 });
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
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 my-4">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
          <Receipt className="text-slate-400" size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-2">Nenhum movimento ainda</h3>
        <p className="text-sm text-slate-500 mb-6 max-w-xs">
          Comece a registar as suas entradas e saídas para ter o controlo do seu dinheiro.
        </p>
        
        {onEdit && (
          <Button 
            onClick={() => onEdit(null)} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-semibold h-11 px-6 rounded-xl"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Registar Agora
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors py-3"
        >
          <div className="flex items-center gap-3 mr-2 flex-1 min-w-0">
            <div className="shrink-0">
              {t.type === "INCOME" ? (
                <ArrowDownCircle className="text-emerald-500" size={24} />
              ) : (
                <ArrowUpCircle className="text-red-500" size={24} />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-sm sm:text-base wrap-break-words">
                {t.description}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-2 text-[12px] sm:text-xs text-slate-500 mt-0.5">
                <span>
                  {new Date(t.date).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}
                </span>
                <span className="hidden sm:inline opacity-30">|</span>
                <span className="flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: t.categories?.color }}
                  ></span>
                  <span className="truncate text-[12px]">{t.categories?.name}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <span
              className={`font-bold text-[14px] sm:text-sm ${t.type == "INCOME" ? "text-emerald-600 bg-emerald-100" : "text-red-600 bg-red-100"} px-2 py-1 rounded-full whitespace-nowrap`}
            >
              {t.type === "INCOME" ? "+" : "-"} R$ {Number(t.amount).toFixed(2)}
            </span>
            
            <div className="flex items-center">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-[#006a3e] hover:bg-green-50 rounded-full h-8 w-8 transition-colors shrink-0"
                  onClick={() => onEdit(t)}
                >
                  <Edit2 size={14} />
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full h-8 w-8 transition-colors shrink-0"
                onClick={() => handleDelete(t.id)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}