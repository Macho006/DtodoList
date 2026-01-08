"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskItem } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, CheckCircle2, RefreshCcw } from "lucide-react";
import confetti from "canvas-confetti"; // Buni o'rnatish kerak: npm install canvas-confetti @types/canvas-confetti

interface SessionPlayerProps {
  tasks: TaskItem[];
}

export default function SessionPlayer({ tasks }: SessionPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(tasks[0].duration);
  const [isFinished, setIsFinished] = useState(false);

  const currentTask = tasks[currentIndex];
  const progress = ((currentIndex) / tasks.length) * 100;

  // Timer logikasi
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleNext();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Keyingi qadamga o'tish
  const handleNext = () => {
    if (currentIndex < tasks.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(tasks[currentIndex + 1].duration);
      setIsActive(true); // Avtomatik davom etadi
    } else {
      finishSession();
    }
  };

  // Yakunlash
  const finishSession = () => {
    setIsActive(false);
    setIsFinished(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#3b82f6', '#10b981']
    });
  };

  // Qayta boshlash
  const restart = () => {
    setCurrentIndex(0);
    setTimeLeft(tasks[0].duration);
    setIsFinished(false);
    setIsActive(false);
  };

  // Vaqt formati (00:00)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Yakunlangan oyna
  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-[60vh]">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-[0_0_50px_rgba(16,185,129,0.4)]"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <h2 className="text-4xl font-bold text-foreground mb-2">Ajoyib!</h2>
        <p className="text-zinc-500 mb-8">Barcha vazifalar muvaffaqiyatli bajarildi.</p>
        <Button onClick={restart} className="rounded-full px-8 py-6 bg-foreground text-background font-bold text-lg hover:scale-105 transition-transform">
          <RefreshCcw className="mr-2 w-5 h-5" /> Qayta boshlash
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto relative">
      
      {/* Progress Bar */}
      <div className="absolute -top-8 left-0 w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-violet-600 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main Card */}
      <div className="relative h-[500px]"> {/* Balandlik fixlandi animatsiya uchun */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 100, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -100, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute inset-0 w-full"
          >
            <div className={`ios-card h-full flex flex-col items-center justify-between p-10 text-center border-2 ${currentTask.type === 'rest' ? 'border-orange-400/30' : 'border-violet-500/0'}`}>
              
              {/* Type Indicator */}
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${
                currentTask.type === 'work' 
                  ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300'
                  : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300'
              }`}>
                {currentTask.type === 'work' ? 'Jarayon' : 'Dam olish'}
              </div>

              {/* Title */}
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3 leading-tight">
                  {currentTask.title}
                </h2>
                <p className="text-zinc-500 font-medium text-lg">
                  {currentTask.description}
                </p>
              </div>

              {/* TIMER */}
              <div className="relative">
                 <div className="text-[80px] md:text-[100px] font-bold tabular-nums tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-foreground to-zinc-500">
                    {formatTime(timeLeft)}
                 </div>
                 {/* Circle animation (Optional decorative) */}
                 <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] -z-10 opacity-10">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="4" className="text-foreground" />
                 </svg>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-6">
        
        {/* Play/Pause */}
        <Button
          size="icon"
          onClick={() => setIsActive(!isActive)}
          className={`w-20 h-20 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 ${
             isActive 
               ? 'bg-zinc-200 dark:bg-zinc-800 text-foreground hover:bg-zinc-300 dark:hover:bg-zinc-700' 
               : 'bg-foreground text-background'
          }`}
        >
          {isActive ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current ml-1" />
          )}
        </Button>

        {/* Skip */}
        <Button
          size="icon"
          variant="ghost"
          onClick={handleNext}
          className="w-14 h-14 rounded-full text-zinc-400 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-white/10"
        >
          <SkipForward className="w-8 h-8" />
        </Button>

      </div>
    </div>
  );
}