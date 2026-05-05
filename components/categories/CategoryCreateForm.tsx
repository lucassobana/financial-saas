"use client";

import { useRef, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createCategory } from "@/app/actions/categories";
import { toast } from "sonner";

export function CategoryCreateForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const toastId = toast.loading("Criando categoria...");

    try {
      await createCategory(formData);

      formRef.current?.reset();

      toast.success("Categoria criada com sucesso!", { id: toastId });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message, {
          id: toastId,
        });
      } else {
        toast.error("Erro ao criar categoria.", {
          id: toastId,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Categoria</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Mercado, Lazer..."
              disabled={loading}
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
                className="w-16 h-10 p-1 cursor-pointer"
                defaultValue="#10b981"
                disabled={loading}
              />
              <Input
                name="color_text"
                placeholder="#10b981"
                className="flex-1"
                disabled={loading}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all text-white font-semibold h-10"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Plus className="mr-2 h-5 w-5" />
            )}
            {loading ? "Criando..." : "Criar Categoria"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
