'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()
  
  // COLE O ID QUE VOCÊ COPIOU AQUI:
  const user_id = 'ef5a1e0e-29cd-4c3f-9515-06a28c8c3f0f'
    
  // Captura os dados do formulário
  const amount = parseFloat(formData.get('amount') as string)
  const date = formData.get('date') as string
  const description = formData.get('description') as string
  const category_id = formData.get('category_id') as string
  const type = formData.get('type') as string // 'INCOME' ou 'EXPENSE'
    
  const { error } = await supabase
    .from('transactions')
    .insert([
      { 
        amount, 
        date, 
        description, 
        category_id: category_id,
        type, 
        user_id 
      }
    ])

  if (error) {
    console.error('Erro detalhado:', error)
    return { error: 'Falha ao salvar no banco' }
  }

  // Atualiza a página automaticamente para mostrar a nova transação
  revalidatePath('/')
  return { success: true }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao deletar transação:', error)
    return { error: 'Falha ao deletar' }
  }
  
  revalidatePath('/')
  revalidatePath('/history')
  return { success: true }
}