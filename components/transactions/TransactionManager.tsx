"use client";

import { useState } from "react";
import { TransactionList, Transaction } from "./TransactionsList"; 
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Category, TransactionForm } from "./TransactionsForm";

interface TransactionManagerProps {
  transactions: Transaction[];
  categories: Category[];
}

export function TransactionManager({ transactions, categories }: TransactionManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };

  return (
    <>
      <TransactionList 
        transactions={transactions} 
        onEdit={handleEditTransaction} 
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[106.25] p-0 border-none bg-transparent shadow-none">
          <TransactionForm 
            categories={categories}
            initialData={transactionToEdit}
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}