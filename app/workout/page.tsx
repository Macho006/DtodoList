"use client";

import SessionPlayer from "@/components/workout/SessionPlayer";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function WorkoutPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
         <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full w-12 h-12 hover:bg-zinc-100 dark:hover:bg-white/10">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </Button>
        </Link>
        
        <div className="text-sm font-bold tracking-widest uppercase text-zinc-400">
          Kundalik Reja
        </div>

        <ThemeToggle />
      </header>

      {/* Player Container */}
      <main className="flex-1 flex items-center justify-center p-6">
        <ScrollReveal>
           <SessionPlayer tasks={MOCK_SESSION} />
        </ScrollReveal>
      </main>

    </div>
  );
}