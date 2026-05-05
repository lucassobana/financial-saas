'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Erro ao encerrar sessão:', error.message)
    return
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const fullName = formData.get("full_name") as string;

  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  if (error) {
    console.error("Erro ao atualizar perfil:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/settings");
  return { success: true };
}