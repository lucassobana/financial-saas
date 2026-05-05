import { createClient } from "@/lib/supabase/server";
import { createCategory } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import NextLink from "next/link";
import { CategoryItem } from "./CategoryItem";
import { CategoryCreateForm } from "@/components/categories/CategoryCreateForm";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");

  const categories = data || [];



  return (
    <div className="bg-slate-50 min-h-screen p-6 pb-32">
      <div className="max-w-xl mx-auto space-y-8 mt-12">
        <Button
          variant="link"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          <NextLink href="/settings">&larr; Voltar para Configurações</NextLink>
        </Button>
        <h1 className="text-3xl font-bold text-slate-800">
          Gerenciar Categorias
        </h1>

        <CategoryCreateForm />

        <div className="space-y-3">
          <h2 className="font-bold text-slate-600 uppercase text-xs tracking-widest">
            Suas Categorias
          </h2>
          {categories.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">
              Nenhuma categoria cadastrada ainda.
            </p>
          ) : (
            categories.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
