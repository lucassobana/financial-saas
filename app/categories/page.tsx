import { createClient } from "@/lib/supabase/server";
import { createCategory } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tag, Plus, } from "lucide-react";
import NextLink from "next/link";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

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

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <form action={createCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Mercado, Lazer..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Cor (Hexadecimal)</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    name="color"
                    type="color"
                    className="w-16 h-10 p-1"
                    defaultValue="#10b981"
                  />
                  <Input
                    name="color_text"
                    placeholder="#10b981"
                    className="flex-1"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="mr-2" size={18} /> Criar Categoria
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="font-bold text-slate-600 uppercase text-xs tracking-widest">
            Suas Categorias
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {categories?.map((cat) => (
              <div
                key={cat.id}
                className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-semibold text-slate-700">
                    {cat.name}
                  </span>
                </div>
                <Tag size={16} className="text-slate-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
