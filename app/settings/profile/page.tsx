import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EditProfileForm } from "../EditProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const currentName = user.user_metadata?.full_name || "";

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      <header className="fixed top-0 left-0 w-full z-50 flex items-center px-6 h-16 bg-white border-b border-slate-200 shadow-sm">
        <Link href="/settings" className="mr-4 text-slate-500 hover:text-emerald-600">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold text-slate-700">Meu Perfil</h1>
      </header>

      <main className="pt-24 px-6 max-w-md mx-auto">
        <EditProfileForm initialName={currentName} />
      </main>
    </div>
  );
}