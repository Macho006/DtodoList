"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTaskManager, DashboardStatus } from "@/hooks/useTaskManager";
import { motion, AnimatePresence, type Variants, easeOut } from "framer-motion";
import { differenceInSeconds, format } from "date-fns";
import { uz } from "date-fns/locale";
import { 
  Settings, LogOut, TrendingUp, CalendarDays, ArrowRight, Clock, CheckCircle2, Trophy, Coffee, ListTodo 
} from "lucide-react";
import Link from "next/link";

interface DashboardUIProps {
  userEmail: string;
  logoutAction: () => Promise<void>;
}

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number } | null;

const barVariants: Variants = {
  hidden: {
    height: 0,
    opacity: 0,
  },
  visible: (height: number) => ({
    height: `${height}%`,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: easeOut, // ✅ STRING EMAS
    },
  }),
  hover: {
    scale: 1.1,
    backgroundColor: "#8b5cf6",
    transition: {
      duration: 0.2,
      ease: easeOut,
    },
  },
};


export default function DashboardUI({ userEmail, logoutAction }: DashboardUIProps) {
  const userName = userEmail.split("@")[0];
  const { getDashboardStatus, tasks, mounted } = useTaskManager();
  const [status, setStatus] = useState<DashboardStatus>({ type: "empty" });
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(null);

  useEffect(() => {
    if (mounted) {
      setStatus(getDashboardStatus());
      const interval = setInterval(() => setStatus(getDashboardStatus()), 5000); 
      return () => clearInterval(interval);
    }
  }, [mounted, getDashboardStatus]);

  // COUNTDOWN LOGIC
  useEffect(() => {
    if (mounted && status.type === 'active' && status.nextTask) {
       const timer = setInterval(() => {
          const now = new Date();
          const [h, m] = status.nextTask!.time.split(":").map(Number);
          const nextTime = new Date();
          nextTime.setHours(h, m, 0, 0);
          
          if (nextTime < now) nextTime.setDate(nextTime.getDate() + 1);

          const diff = differenceInSeconds(nextTime, now);
          
          if (diff <= 0) {
             setTimeLeft(null);
          } else {
             const days = Math.floor(diff / (3600 * 24));
             const hours = Math.floor((diff % (3600 * 24)) / 3600);
             const minutes = Math.floor((diff % 3600) / 60);
             const seconds = diff % 60;
             setTimeLeft({ days, hours, minutes, seconds });
          }
       }, 1000);
       return () => clearInterval(timer);
    } else {
       setTimeLeft(null);
    }
  }, [status, mounted]);

  const TimeUnit = ({ val, label }: { val: number; label: string }) => (
    <div className="flex flex-col items-center justify-center bg-white/20 dark:bg-black/30 backdrop-blur-md rounded-lg w-10 h-11 border border-white/10 shadow-inner">
        <span className="text-sm font-bold text-foreground font-mono leading-none">{val < 10 ? `0${val}` : val}</span>
        <span className="text-[8px] font-bold text-zinc-500 dark:text-zinc-400 uppercase leading-none mt-1">{label}</span>
    </div>
  );

  // KELGUSI VAZIFALAR (TOP 3)
  const upcomingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 3);

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden selection:bg-violet-500/20">
      <ScrollReveal direction="down" className="sticky top-6 z-50 px-4 md:px-8 mb-8">
        <div className="ios-card max-w-7xl mx-auto h-20 px-6 flex items-center justify-between !rounded-full !bg-white/80 dark:!bg-black/60 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-md">
              <span className="font-bold">G</span>
            </div>
            <span className="font-bold text-xl tracking-wide text-foreground">GritApp</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-white/5 px-4 py-2 rounded-full border border-zinc-200 dark:border-white/10">
               <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#34d399] animate-pulse" />
               {userEmail}
             </div>
            <ThemeToggle />
            <form action={logoutAction}>
              <Button size="icon" variant="ghost" className="rounded-full w-10 h-10 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                <LogOut className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </ScrollReveal>

      <main className="max-w-7xl mx-auto px-4 md:px-8">
        <ScrollReveal direction="left" delay={0.2} className="mb-12 px-2">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-2 text-foreground">
            Salom, <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500">{userName}</span>
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium">
            {status.type === 'all_done' ? "Barcha vazifalar bajarildi! 🎉" : "Bugungi rejangizni nazorat qilamiz."}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* --- ASOSIY STATUS KARTA (TASK TIMER) --- */}
          <ScrollReveal delay={0.1} className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 h-full relative z-0">
            <Link href="/schedule" className="block h-full w-full">
              <div className="h-full w-full">
                <AnimatePresence mode="wait">
                  {status.type === "all_done" && (
                    <motion.div
                      key="all_done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="ios-card p-10 h-full flex flex-col justify-between group cursor-pointer overflow-hidden bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-900/10 dark:to-transparent border-emerald-500/20"
                    >
                      <div className="relative z-10">
                        <div className="w-16 h-16 bg-emerald-500 rounded-[24px] flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30 text-white"><Trophy className="w-8 h-8" /></div>
                        <h3 className="text-4xl font-bold mb-3 text-foreground tracking-tight">Barchasi Yakunlandi!</h3>
                        <p className="text-lg text-zinc-500 dark:text-zinc-400">Ertangi kun rejasi o'z vaqtida ochiladi.</p>
                      </div>
                      <div className="mt-8 relative z-10"><div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-sm"><CheckCircle2 className="w-4 h-4 mr-2" /> Kun yopildi</div></div>
                    </motion.div>
                  )}
                  {status.type === "empty" && (
                    <motion.div
                      key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="ios-card p-10 h-full flex flex-col justify-between group cursor-pointer overflow-hidden hover:border-violet-500/30 transition-colors"
                    >
                      <div className="relative z-10">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-white/10 rounded-[24px] flex items-center justify-center mb-6 text-zinc-400 dark:text-zinc-500"><Coffee className="w-8 h-8" /></div>
                        <h3 className="text-4xl font-bold mb-3 text-foreground tracking-tight">Reja mavjud emas</h3>
                        <p className="text-lg text-zinc-500 dark:text-zinc-400">Yangi vazifa qo'shish uchun bosing.</p>
                      </div>
                      <div className="flex items-center justify-end mt-8 relative z-10"><Button className="rounded-full w-14 h-14 p-0 bg-foreground text-background hover:scale-110 transition-transform shadow-xl"><ArrowRight className="w-6 h-6" /></Button></div>
                    </motion.div>
                  )}
                  {status.type === "active" && (
                    <motion.div
                      key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="ios-card p-10 h-full flex flex-col justify-between group cursor-pointer overflow-hidden bg-gradient-to-br from-violet-50/50 to-transparent dark:from-transparent dark:to-transparent"
                    >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                      <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="w-16 h-16 bg-violet-600 rounded-[24px] flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30 text-white animate-in zoom-in duration-300">
                                <Clock className="w-8 h-8 animate-pulse" />
                            </div>
                            
                            {timeLeft && (
                                <div className="flex gap-2 animate-in fade-in slide-in-from-right-4 duration-700">
                                    {timeLeft.days > 0 && <TimeUnit val={timeLeft.days} label="KUN" />}
                                    {(timeLeft.hours > 0 || timeLeft.days > 0) && <TimeUnit val={timeLeft.hours} label="SOA" />}
                                    <TimeUnit val={timeLeft.minutes} label="MIN" />
                                    <TimeUnit val={timeLeft.seconds} label="SON" />
                                </div>
                            )}
                        </div>
                        
                        <div className="inline-block px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 text-xs font-bold uppercase tracking-wider mb-3">Hozirgi Vazifa</div>
                        <h3 className="text-4xl font-bold mb-3 text-foreground tracking-tight line-clamp-2">{status.task.title}</h3>
                        <div className="space-y-2">
                            <p className="text-lg text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-violet-500" /> Boshlanish: <span className="font-mono font-bold text-foreground">{status.task.time}</span>
                            </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-8 relative z-10">
                          <Button className="rounded-full w-14 h-14 p-0 bg-foreground text-background hover:scale-110 transition-transform shadow-xl"><ArrowRight className="w-6 h-6" /></Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          </ScrollReveal>

          {/* --- STATISTICS CHART (Kcal o'rniga) --- */}
          <ScrollReveal delay={0.2} className="col-span-1 md:col-span-2">
            <div className="ios-card progress-card p-8 h-full flex items-center justify-between group">
               <div className="flex flex-col justify-between h-full">
                   <div>
                       <h3 className="font-bold text-xl flex items-center gap-2 text-foreground"><TrendingUp className="w-6 h-6 text-emerald-500" /> Progress</h3>
                       <p className="text-zinc-500 text-sm mt-1 font-medium">Haftalik natijalar</p>
                   </div>
                   <div className="text-3xl font-bold text-foreground mt-4">85% <span className="text-sm font-medium text-zinc-400">o'sish</span></div>
               </div>
               <div className="flex items-end gap-3 h-24 pt-4">{[30, 50, 45, 80, 60, 95, 75].map((h, i) => (
  <motion.div
    key={i}
    custom={h}
    variants={barVariants}
    initial="hidden"
    whileInView="visible"
    whileHover="hover"
    viewport={{ once: true }}
    className="w-4 rounded-md bg-zinc-200 dark:bg-zinc-800 cursor-pointer origin-bottom"
  />
))}
</div>
            </div>
          </ScrollReveal>

          {/* --- UPCOMING TASKS (Streak o'rniga) --- */}
          <ScrollReveal delay={0.3} className="col-span-1 md:col-span-1 lg:col-span-1">
             <div className="ios-card p-6 h-full flex flex-col overflow-hidden">
                <div className="flex items-center gap-2 mb-4 text-zinc-500 dark:text-zinc-400 font-medium">
                    <ListTodo className="w-5 h-5" /> Navbatdagi
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                    {upcomingTasks.length > 0 ? upcomingTasks.map((t, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5">
                            <span className="font-medium text-sm truncate w-24">{t.title}</span>
                            <span className="text-xs font-mono text-violet-500 bg-violet-100 dark:bg-violet-900/30 px-2 py-1 rounded-md">{t.time}</span>
                        </div>
                    )) : (
                        <div className="text-center text-xs text-zinc-400 py-4">Vazifalar qolmadi</div>
                    )}
                </div>
             </div>
          </ScrollReveal>

          {/* --- SETTINGS & SCHEDULE LINKS --- */}
          <ScrollReveal delay={0.4} className="col-span-1">
            <Link href="" className="block h-full">
              <div className="ios-card p-6 h-full flex flex-col items-center justify-center text-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"><Settings className="w-8 h-8 text-zinc-400 mb-3" /><h3 className="font-semibold text-foreground">Sozlamalar</h3></div>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.5} className="col-span-1">
             <Link href="/schedule" className="block h-full">
               <div className="ios-card p-6 h-full flex flex-col items-center justify-center text-center cursor-pointer hover:bg-pink-50/50 dark:hover:bg-pink-900/10 transition-colors"><CalendarDays className="w-8 h-8 text-pink-500 mb-3" /><h3 className="font-semibold text-foreground">To'liq Reja</h3></div>
             </Link>
          </ScrollReveal>
        </div>
      </main>
    </div>
  );
}