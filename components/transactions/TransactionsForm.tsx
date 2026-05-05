"use client";

import { useRef, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Tag,
  AlignLeft,
  CheckCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createTransaction,
  updateTransaction,
} from "@/app/actions/transactions";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: "INCOME" | "EXPENSE";
  category_id?: string | null;
}

type TransactionFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  categories: Category[];
  initialData?: Transaction | null;
};

export function TransactionForm({
  onSuccess,
  onCancel,
  categories = [],
  initialData,
}: TransactionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = !!initialData;

  const [type, setType] = useState<"INCOME" | "EXPENSE">(
    initialData?.type || "EXPENSE",
  );
  const [categoryId, setCategoryId] = useState<string>(
    initialData?.category_id || "",
  );
  const [loading, setLoading] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);

  const selectedCategory = categories.find((c) => String(c.id) === categoryId);

  const handleSubmit = async (formData: FormData) => {
    if (type === "EXPENSE" && !categoryId) {
      toast.info("Por favor, selecione uma categoria.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading(
      isEditing ? "Atualizando transação..." : "Guardando transação...",
    );

    try {
      formData.append("type", type);
      if (categoryId) {
        formData.append("category_id", categoryId);
      }

      let result;
      if (isEditing && initialData) {
        result = await updateTransaction(initialData.id, formData);
      } else {
        result = await createTransaction(formData);
      }

      if (result?.error) {
        toast.error("Erro ao salvar: " + result.error, {
          id: toastId,
          duration: 2000,
        });
      } else {
        toast.success(
          isEditing ? "Transação atualizada!" : "Transação salva com sucesso!",
          {
            id: toastId,
            duration: 1500,
          },
        );

        if (keepOpen && !isEditing) {
          const amountInput = formRef.current?.elements.namedItem(
            "amount",
          ) as HTMLInputElement;
          const descInput = formRef.current?.elements.namedItem(
            "description",
          ) as HTMLInputElement;

          if (amountInput) amountInput.value = "";
          if (descInput) descInput.value = "";

          amountInput?.focus();
        } else {
          formRef.current?.reset();
          if (!isEditing) setCategoryId("");
          onSuccess?.();
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message, {
          id: toastId,
          duration: 2000,
        });
      } else {
        toast.error("Erro inesperado ao salvar.", {
          id: toastId,
          duration: 2000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-6 md:p-8 rounded-2xl">
      <form ref={formRef} action={handleSubmit} className="space-y-6">
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 gap-1">
          <Button
            type="button"
            variant={type === "INCOME" ? "default" : "ghost"}
            onClick={() => setType("INCOME")}
            className={`flex-1 h-12 rounded-lg font-semibold text-base transition-all ${
              type === "INCOME"
                ? "bg-white text-emerald-700 hover:bg-white hover:text-emerald-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            <ArrowDownCircle className="mr-2 h-5 w-5" />
            Entrada
          </Button>
          <Button
            type="button"
            variant={type === "EXPENSE" ? "default" : "ghost"}
            onClick={() => setType("EXPENSE")}
            className={`flex-1 h-12 rounded-lg font-semibold text-base transition-all ${
              type === "EXPENSE"
                ? "bg-white text-red-700 hover:bg-white hover:text-red-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            <ArrowUpCircle className="mr-2 h-5 w-5" />
            Saída
          </Button>
        </div>

        <div className="text-center">
          <Label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Valor da Transação
          </Label>
          <div className="relative flex items-center justify-center group mt-2">
            <span className="text-2xl font-bold text-slate-400 mr-2">R$</span>
            <Input
              name="amount"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              step="0.01"
              placeholder="0,00"
              defaultValue={initialData?.amount}
              required
              autoFocus={!isEditing}
              className="border-none shadow-none p-0 text-2xl font-bold text-slate-800 focus-visible:ring-0 placeholder:text-slate-200 w-full max-w-70 text-center h-auto"
            />
          </div>
          <div className="h-px w-full bg-linear-to-r from-transparent via-slate-300 to-transparent opacity-50"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label className="font-semibold text-sm text-slate-600 flex items-center gap-2">
              <Calendar size={18} />
              Data
            </Label>
            <Input
              name="date"
              type="date"
              required
              defaultValue={
                initialData?.date || new Date().toISOString().split("T")[0]
              }
              className="h-10 bg-slate-50 border-slate-200 rounded-xl px-4 focus-visible:ring-emerald-500 text-slate-700"
            />
          </div>

          <div className="space-y-3">
            <Label className="font-semibold text-sm text-slate-600 flex items-center gap-2">
              <Tag size={18} />
              Categoria{" "}
              {type === "INCOME" && (
                <span className="text-xs font-normal text-slate-400">
                  (Opcional)
                </span>
              )}
            </Label>

            <Select
              value={categoryId}
              onValueChange={(val: string | null) => setCategoryId(val || "")}
            >
              <SelectTrigger className="h-10 bg-slate-50 border-slate-200 rounded-xl px-6 focus:ring-emerald-500 text-slate-700">
                <SelectValue placeholder="Selecione uma categoria">
                  {selectedCategory ? (
                    <span className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: selectedCategory.color }}
                      ></span>
                      {selectedCategory.name}
                    </span>
                  ) : undefined}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {categories.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    Nenhuma categoria criada
                  </SelectItem>
                ) : (
                  categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      <span className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        ></span>
                        {cat.name}
                      </span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 md:col-span-2">
            <Label className="font-semibold text-sm text-slate-600 flex items-center gap-2">
              <AlignLeft size={18} />
              Descrição
            </Label>
            <Textarea
              name="description"
              rows={3}
              required
              defaultValue={initialData?.description}
              placeholder="Ex: Conta da luz, Supermercado, etc."
              className="bg-slate-50 border-slate-200 rounded-xl px-4 focus-visible:ring-emerald-500 text-slate-700 resize-none"
            />
          </div>
        </div>

        <div className="pt-2 space-y-3">
          {!isEditing && (
            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id="keepOpen"
                checked={keepOpen}
                onCheckedChange={(c) => setKeepOpen(c as boolean)}
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
              <Label
                htmlFor="keepOpen"
                className="text-sm font-medium text-slate-500 cursor-pointer select-none"
              >
                Manter aberto para adicionar outra transação
              </Label>
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm text-lg transition-all"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-5 w-5" />
            )}
            {loading
              ? isEditing
                ? "Atualizando..."
                : "Guardando..."
              : isEditing
                ? "Atualizar"
                : "Guardar"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            disabled={loading}
            className="w-full h-10 text-slate-500 font-semibold hover:bg-slate-100 rounded-xl"
            onClick={() => onCancel?.()}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
