"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Shadcn
import { Plus, Trash2, Save, Clock, Briefcase, Coffee, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// Type
type Step = {
  id: string; // Vaqtincha ID (animatsiya uchun)
  title: string;
  duration: number; // sekund
  type: "work" | "rest";
};

export default function CreatePlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [planName, setPlanName] = useState("");
  
  // Dastlabki bo'sh qadamlar
  const [steps, setSteps] = useState<Step[]>([
    { id: "1", title: "Isinish", duration: 300, type: "work" }
  ]);

  // Yangi qadam qo'shish
  const addStep = () => {
    const newStep: Step = {
      id: Date.now().toString(),
      title: "",
      duration: 60,
      type: "work",
    };
    setSteps([...steps, newStep]);
  };

  // Qadamni o'chirish
  const removeStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  // Inputni o'zgartirish
  const updateStep = (id: string, field: keyof Step, value: any) => {
    setSteps(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  // Bazaga saqlash
  const handleSave = async () => {
    if (!planName) return alert("Reja nomini kiriting!");
    setLoading(true);

    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        body: JSON.stringify({ name: planName, steps }),
      });

      if (res.ok) {
        router.push("/dashboard"); // Muvaffaqiyatli bo'lsa dashboardga qaytish
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 p-6 bg-background relative">
      
      {/* Header */}
      <header className="max-w-3xl mx-auto flex items-center justify-between mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full w-12 h-12">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground">Yangi Reja Tuzish</h1>
        <ThemeToggle />
      </header>

      <main className="max-w-3xl mx-auto">
        
        {/* 1. Plan Name Input */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="ios-card p-8 mb-8"
        >
          <label className="text-sm font-medium text-zinc-500 mb-2 block">Reja Nomi</label>
          <input
            type="text"
            placeholder="Masalan: Ertalabki yugurish"
            className="ios-input text-2xl font-bold bg-transparent border-none px-0 py-2 focus:ring-0 placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
        </motion.div>

        {/* 2. Steps List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {steps.map((step, index) => (
              <motion.div
                layout // Elementlar joyi almashganda silliq siljiydi
                key={step.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`ios-card p-6 flex flex-col md:flex-row gap-4 items-center group relative overflow-hidden
                  ${step.type === 'rest' ? 'border-orange-500/20 bg-orange-50/50 dark:bg-orange-900/10' : ''}
                `}
              >
                {/* Tartib raqami */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 text-sm">
                  {index + 1}
                </div>

                {/* Title Input */}
                <div className="flex-grow w-full">
                  <input
                    type="text"
                    placeholder="Vazifa nomi..."
                    value={step.title}
                    onChange={(e) => updateStep(step.id, "title", e.target.value)}
                    className="bg-transparent text-lg font-semibold outline-none w-full placeholder:text-zinc-400 text-foreground"
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  
                  {/* Duration */}
                  <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 px-3 py-2 rounded-xl border border-zinc-100 dark:border-white/5">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <input
                      type="number"
                      value={step.duration}
                      onChange={(e) => updateStep(step.id, "duration", Number(e.target.value))}
                      className="w-16 bg-transparent outline-none text-right font-mono"
                    />
                    <span className="text-xs text-zinc-400">sek</span>
                  </div>

                  {/* Type Toggle (Work/Rest) */}
                  <button
                    onClick={() => updateStep(step.id, "type", step.type === "work" ? "rest" : "work")}
                    className={`p-2.5 rounded-xl transition-all ${
                      step.type === "work" 
                        ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600" 
                        : "bg-orange-100 dark:bg-orange-900/30 text-orange-600"
                    }`}
                  >
                    {step.type === "work" ? <Briefcase className="w-5 h-5" /> : <Coffee className="w-5 h-5" />}
                  </button>

                  {/* Delete */}
                  <button 
                    onClick={() => removeStep(step.id)}
                    className="p-2.5 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 3. Add & Save Buttons */}
        <div className="mt-8 flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addStep}
            className="flex-1 py-4 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 font-medium hover:border-violet-500 hover:text-violet-500 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Qadam qo'shish
          </motion.button>
        </div>

      </main>
      
      {/* Floating Save Button */}
      <motion.div 
        initial={{ y: 100 }} animate={{ y: 0 }}
        className="fixed bottom-6 left-0 w-full px-6 flex justify-center z-50"
      >
        <Button 
          onClick={handleSave}
          disabled={loading}
          className="ios-card bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 py-6 text-lg font-bold shadow-2xl w-full max-w-md"
        >
          {loading ? "Saqlanmoqda..." : (
            <>
              <Save className="mr-2 w-5 h-5" /> Rejani Saqlash
            </>
          )}
        </Button>
      </motion.div>

    </div>
  );
}