"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const supabase = await createClient();

  // COLE O ID QUE VOCÊ COPIOU AQUI:
  const user_id = "ef5a1e0e-29cd-4c3f-9515-06a28c8c3f0f";

  // Captura os dados do formulário
  const data = {
    name: formData.get("name") as string,
    color: formData.get("color") as string,
    user_id,
  };

  const { error } = await supabase.from("categories").insert([data]);
  if (error) throw new Error(error.message);

  // Atualiza a página automaticamente para mostrar a nova transação
  revalidatePath("/categories");

  revalidatePath("/"); // Para atualizar a lista de categorias na página principal
}
