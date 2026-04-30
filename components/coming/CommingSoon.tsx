"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Hammer, ArrowLeft, Construction } from "lucide-react";

interface ComingSoonProps {
  featureName: string;
}

export default function ComingSoon({ featureName }: ComingSoonProps) {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
        <Construction className="text-emerald-600 w-10 h-10" />
      </div>
      
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        {featureName}
      </h1>
      
      <p className="text-slate-500 max-w-70 mb-8">
        Estamos trabalhando nisso! Esta funcionalidade estará disponível em breve na versão oficial.
      </p>

      <Button 
        variant="outline" 
        onClick={() => router.back()}
        className="gap-2 border-slate-200 text-slate-600"
      >
        <ArrowLeft size={18} />
        Voltar
      </Button>
      
      <div className="fixed bottom-32 opacity-20 pointer-events-none">
        <Hammer size={120} className="text-emerald-600 rotate-12" />
      </div>
    </div>
  );
}