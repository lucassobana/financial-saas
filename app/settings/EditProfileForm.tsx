"use client";

import { useState } from "react";
import { User, Loader2, Check } from "lucide-react";
import { updateProfile } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";

interface EditProfileFormProps {
  initialName: string;
}

export function EditProfileForm({ initialName }: EditProfileFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao atualizar perfil.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User size={20} className="text-emerald-600" />
          Informações Pessoais
        </CardTitle>
        <CardDescription>
          Como você deseja ser chamado dentro do FinFlow.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nome Completo</Label>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={initialName}
              placeholder="Ex: John Doe"
              required
              className="focus-visible:ring-emerald-600"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#006a3e] hover:bg-[#0e8551] text-white font-semibold gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check size={18} />
            )}
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
