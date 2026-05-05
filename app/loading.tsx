import { Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function HomeLoading() {
  return (
    <div className="min-h-screen pb-32 font-sans bg-slate-50 animate-pulse">
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 flex justify-center items-center bg-slate-200 rounded-xl">
            <Wallet className="text-slate-300 w-7 h-7" />
          </div>
          <div className="h-6 w-24 bg-slate-200 rounded-md"></div>
        </div>
        <div className="h-8 w-28 bg-slate-200 rounded-lg"></div>
      </header>

      <main className="mt-24 px-4 max-w-5xl mx-auto space-y-6">
        <div className="h-6 w-48 bg-slate-200 rounded-md"></div>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <Card className="md:col-span-8 bg-slate-200 border-none shadow-md h-48"></Card>

          <div className="md:col-span-4 grid grid-cols-1 gap-4">
            <Card className="bg-white border-slate-200 shadow-sm h-22"></Card>
            <Card className="bg-white border-slate-200 shadow-sm h-22"></Card>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border-slate-200 shadow-sm h-72"></Card>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-72"></div>
        </section>
      </main>
    </div>
  );
}