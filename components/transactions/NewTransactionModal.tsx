"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionForm, Category } from "./TransactionsForm";

export function NewTransactionModal({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="fixed bottom-24 right-6 z-50 flex items-center justify-center h-14 px-6 rounded-full shadow-2xl bg-emerald-600 hover:bg-emerald-700 text-white gap-2 transition-transform active:scale-95">
        <Plus size={24} strokeWidth={3} />
        <span className="font-bold">Nova Transação</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl p-0 bg-white border-none rounded-[32px] shadow-2xl [&>button]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>

        <div>
          <TransactionForm
            categories={categories}
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
