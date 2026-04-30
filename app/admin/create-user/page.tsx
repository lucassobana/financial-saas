"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

export default function AdmincreateUserPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      toast.success("Conta criada! Verifique seu e-mail para confirmar.");
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao criar conta.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff] font-sans antialiased relative">
      <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-2 text-[#006a3e] hover:opacity-80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold text-xl tracking-tight">FinFlow</span>
          </Link>
        </div>
      </header>

      <div className="fixed inset-0 -z-10 bg-linear-to-br from-slate-50 to-[#e7eeff] opacity-50" />

      <main className="grow flex flex-col items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-md">
          <Card className="border-gray-100 shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_1px_2px_rgba(0,0,0,0.03)] rounded-xl bg-white overflow-hidden">
            <CardContent className="p-8 md:p-10">
              <div className="text-center mb-8">
                <h1 className="text-[30px] font-bold text-[#121c2c] tracking-tight">
                  Crie sua conta
                </h1>
                <p className="text-gray-500 mt-2 text-[16px]">
                  Inicie sua jornada para o controle financeiro inteligente.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="full_name"
                    className="font-semibold text-[#3e4941] ml-1"
                  >
                    Nome Completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7a70] w-5 h-5" />
                    <Input
                      id="full_name"
                      placeholder="Ex: João Silva"
                      className="pl-10 py-6 border-gray-200 focus-visible:ring-[#006a3e] rounded-lg"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="font-semibold text-[#3e4941] ml-1"
                  >
                    E-mail
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7a70] w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nome@exemplo.com"
                      className="pl-10 py-6 border-gray-200 focus-visible:ring-[#006a3e] rounded-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="font-semibold text-[#3e4941] ml-1"
                  >
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7a70] w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      className="pl-10 pr-12 py-6 border-gray-200 focus-visible:ring-[#006a3e] rounded-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirm_password"
                    className="font-semibold text-[#3e4941] ml-1"
                  >
                    Confirmar Senha
                  </Label>
                  <div className="relative">
                    <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7a70] w-5 h-5" />
                    <Input
                      id="confirm_password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Repita sua senha"
                      className="pl-10 py-6 border-gray-200 focus-visible:ring-[#006a3e] rounded-lg"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Checkbox Termos */}
                {/* <div className="flex items-start gap-3 py-2">
                  <Checkbox id="terms" required className="mt-1 border-gray-300 data-[state=checked]:bg-[#006a3e] data-[state=checked]:border-[#006a3e]" />
                  <label htmlFor="terms" className="text-[12px] text-gray-500 leading-tight cursor-pointer">
                    Eu aceito os <Link href="#" className="text-[#006a3e] font-semibold hover:underline">Termos e Condições</Link> e a <Link href="#" className="text-[#006a3e] font-semibold hover:underline">Política de Privacidade</Link>.
                  </label>
                </div> */}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#006a3e] hover:bg-[#00522f] text-white font-bold rounded-lg transition-all active:scale-[0.98]"
                >
                  {loading ? "Processando..." : "Cadastrar"}
                </Button>
              </form>

              {/* <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                <p className="text-[14px] text-gray-500">
                  Já possui uma conta?{" "}
                  <Link href="/login" className="text-[#006a3e] font-bold hover:underline">
                    Voltar para o login
                  </Link>
                </p>
              </div> */}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
