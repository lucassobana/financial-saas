"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, LogIn, Eye, EyeOff, Wallet } from "lucide-react";
// import { ArrowRightCircle } from "lucide-react"; // Import para quando habilitar o cadastro
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Mantemos o estado isSignUp como false para a Beta
  //   const [isSignUp] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      /* LÓGICA DE CADASTRO COMENTADA PARA BETA 
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // toast.success("Verifique seu e-mail para confirmar o cadastro!");
      } else {
      */

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Login realizado com sucesso!", { duration: 1500 });

      router.push("/");
      router.refresh();

      // } // Fechamento do else do isSignUp
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message, { duration: 2000 });
      } else {
        toast.error("Erro na autenticação", { duration: 2000 });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff] font-sans antialiased">
      <div className="fixed top-0 left-0 w-full h-1 bg-linear-to-r from-[#006a3e] via-[#0e8551] to-[#005ea1] z-50" />

      <main className="grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="border-gray-100 shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_1px_2px_rgba(0,0,0,0.03)] rounded-xl bg-white overflow-hidden">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col items-center mb-10">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className="w-14 h-14 bg-[#006a3e] rounded-xl flex items-center justify-center shadow-sm">
                    <Wallet className="text-white w-8 h-8" />
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight antialiased">
                    FinFlow
                  </h1>
                </div>
                <p className="text-gray-500 text-center text-[16px]">
                  {/* Comentado o texto dinâmico para Beta */}
                  {/* isSignUp ? "Crie sua conta gratuita." : "Bem-vindo ao futuro da sua gestão financeira." */}
                  Bem-vindo ao futuro da sua gestão financeira.
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="font-semibold text-[#121c2c] ml-1"
                  >
                    E-mail
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-12 py-6 border-gray-200 focus-visible:ring-[#006a3e] rounded-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <Label htmlFor="password" className="font-semibold">
                      Senha
                    </Label>

                    {/* BOTÃO ESQUECEU SENHA OCULTO PARA BETA */}
                    {/* {!isSignUp && (
                      <button type="button" className="text-[12px] text-[#006a3e] hover:underline font-medium">
                        Esqueceu a senha?
                      </button>
                    )} */}
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-12 py-6 border-gray-200 focus-visible:ring-[#006a3e] rounded-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-13 bg-[#006a3e] hover:bg-[#00522f] text-white font-bold text-lg rounded-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {loading ? "Carregando..." : "Entrar"}
                  {!loading && <LogIn size={20} />}

                  {/* ÍCONE DE CADASTRO COMENTADO */}
                  {/* !loading && (isSignUp ? <ArrowRightCircle size={20} /> : <LogIn size={20} />) */}
                </Button>
              </form>

              {/* SEÇÃO DE CRIAR CONTA COMENTADA PARA BETA */}
              {/* <div className="mt-10 pt-8 border-t border-gray-50 flex flex-col items-center gap-4">
                <p className="text-[12px] text-gray-500 font-medium">
                  {isSignUp ? 'Já possui uma conta?' : 'Ainda não tem uma conta?'}
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="w-full h-13 border-gray-200 text-[#121c2c] font-bold rounded-lg hover:bg-gray-50 transition-all"
                >
                  {isSignUp ? 'Fazer Login' : 'Criar uma conta'}
                </Button>
              </div> 
              */}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
