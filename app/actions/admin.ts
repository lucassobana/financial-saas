'use server'

import { createClient } from '@supabase/supabase-js' 
import { revalidatePath } from 'next/cache'

export async function adminCreateUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { 
        full_name: formData.get('full_name') || '' 
    }
  })

  if (error) {
    console.error('Erro ao criar usuário:', error.message)
    throw new Error(error.message)
  }

  revalidatePath('/admin/create-user')
  return { success: true }
}