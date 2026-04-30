import { createClient } from '@/lib/supabase/server'
import { TransactionForm } from '@/components/transactions/TransactionsForm'

export default async function NewTransactionPage() {
  const supabase = await createClient()
  
  // Busca as categorias diretamente na página
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="bg-slate-50 min-h-screen p-6 pb-32">
      <div className="max-w-xl mx-auto space-y-8 mt-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">Nova Transação</h1>
          <p className="text-slate-500 mt-2">Preencha os dados abaixo</p>
        </div>

        {/* Chamamos o formulário e passamos as categorias! */}
        {/* Como não é mais uma gaveta, não precisamos do onSuccess para fechar */}
        <TransactionForm categories={categories || []} />
      </div>
    </div>
  )
}