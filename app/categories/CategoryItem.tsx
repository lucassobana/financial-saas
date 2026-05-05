"use client";

import { useState } from "react";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { updateCategory, deleteCategory } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  color: string;
}

export function CategoryItem({ category }: { category: Category }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [color, setColor] = useState(category.color);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("O nome da categoria não pode ser vazio.", { duration: 2000 });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("color", color);

      await updateCategory(category.id, formData);
      toast.success("Categoria atualizada com sucesso!", { duration: 1500 });
      setIsEditing(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message, { duration: 2000 });
      } else {
        toast.error("Erro ao atualizar categoria.", { duration: 2000 });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    toast("Tem certeza que deseja deletar esta categoria?", {
      action: {
        label: "Deletar",
        onClick: async () => {
          try {
            await deleteCategory(id);
            toast.success("Categoria deletada com sucesso!", { duration: 1500 });
          } catch (error: unknown) {
            if (error instanceof Error) {
              toast.error("Erro ao deletar: " + error.message, { duration: 2000 });
            } else {
              toast.error("Erro ao deletar categoria.", { duration: 2000 });
            }
          }
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm animate-in fade-in zoom-in-95">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 p-0 border-0 rounded overflow-hidden cursor-pointer shrink-0"
        />
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-10 bg-white"
          autoFocus
        />
        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsEditing(false)}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 h-9 w-9"
          >
            <X size={18} />
          </Button>
          <Button
            size="icon"
            onClick={handleUpdate}
            disabled={loading}
            className="bg-[#006a3e] hover:bg-[#00522f] text-white h-9 w-9"
          >
            <Check size={18} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-100 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] mb-3">
      <div className="flex items-center gap-3">
        <div
          className="w-4 h-4 rounded-full shadow-sm"
          style={{ backgroundColor: category.color }}
        />
        <span className="font-medium text-slate-700">{category.name}</span>
      </div>

      <div className="flex items-center gap-1 opacity-80">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="text-slate-400 hover:text-[#006a3e] hover:bg-green-50 h-8 w-8"
        >
          <Edit2 size={16} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleDelete(category.id)}
          disabled={loading}
          className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
