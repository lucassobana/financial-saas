"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Usuário não autenticado");
  }

  const name = formData.get("name") as string;
  const color = formData.get("color") as string;

  const { error } = await supabase.from("categories").insert([
    {
      name,
      color,
      user_id: user.id,
    },
  ]);

  if (error) {
    console.error("Erro ao criar categoria:", error);
    throw new Error(error.message);
  }

  revalidatePath("/categories");
  revalidatePath("/");
  revalidatePath("/new");
}
