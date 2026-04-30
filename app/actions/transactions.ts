"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTransaction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Erro de autenticação:", authError);
    return { error: "Usuário não autenticado" };
  }

  const amount = parseFloat(formData.get("amount") as string);
  const date = formData.get("date") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;

  const category_id_raw = formData.get("category_id") as string;
  const category_id = category_id_raw ? category_id_raw : null;

  const { error } = await supabase.from("transactions").insert([
    {
      user_id: user.id,
      amount,
      date,
      description,
      category_id: category_id,
      type,
    },
  ]);

  if (error) {
    console.error("Erro detalhado:", error);
    return { error: "Falha ao salvar no banco" };
  }

  revalidatePath("/");
  return { success: true };
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar transação:", error);
    return { error: "Falha ao deletar" };
  }

  revalidatePath("/");
  revalidatePath("/history");
  return { success: true };
}
