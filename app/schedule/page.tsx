"use client";

import { useState, useEffect, useRef } from "react";
import { format, addDays, subDays, isSameDay, startOfToday, parseISO } from "date-fns";
import { uz } from "date-fns/locale";
import { motion, AnimatePresence, useMotionValue, PanInfo, animate, Variants } from "framer-motion";
import { Plus, CheckCircle2, Circle, Clock, CalendarDays, Trash2, ArrowLeft, X, Edit, Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTaskManager, Task } from "@/hooks/useTaskManager";
import  {GlassCalendar}  from "@/components/GlassCalendar";

// --- ANIMATSIYA ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, when: "beforeChildren" } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  exit: { opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.2 } }
};

// --- TIME PICKER ---
const TimePicker = ({ value, onChange, onClose }: { value: string; onChange: (val: string) => void; onClose: () => void; }) => {
  const [h, m] = value.split(":").map(Number);
  const [selectedHour, setSelectedHour] = useState(isNaN(h) ? 9 : h);
  const [selectedMinute, setSelectedMinute] = useState(isNaN(m) ? 0 : m);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    if (hourRef.current) { const el = hourRef.current.children[selectedHour] as HTMLElement; if (el) hourRef.current.scrollTop = el.offsetTop - 104; }
    if (minuteRef.current) { const el = minuteRef.current.children[selectedMinute] as HTMLElement; if (el) minuteRef.current.scrollTop = el.offsetTop - 104; }
  }, []);

  const handleSave = () => {
    const formattedH = selectedHour.toString().padStart(2, "0");
    const formattedM = selectedMinute.toString().padStart(2, "0");
    onChange(`${formattedH}:${formattedM}`);
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="ios-card w-full max-w-sm bg-white/90 dark:bg-zinc-900/90 border border-white/20 shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-white/10 flex justify-between items-center bg-white/50 dark:bg-black/20">
          <span className="font-bold text-lg text-foreground">Vaqtni tanlang</span>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-500"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex h-64 relative group">
          <div className="absolute top-1/2 left-0 w-full h-12 -translate-y-1/2 bg-violet-500/10 dark:bg-violet-500/20 pointer-events-none border-y border-violet-500/30" />
          <div ref={hourRef} className="flex-1 overflow-y-auto scrollbar-hide snap-y snap-mandatory py-[104px]">{hours.map((hour) => (<div key={hour} onClick={() => setSelectedHour(hour)} className={`h-12 flex items-center justify-center snap-center cursor-pointer transition-all duration-200 ${selectedHour === hour ? "text-3xl font-bold text-violet-600 dark:text-violet-400 scale-110" : "text-lg text-zinc-400 opacity-50"}`}>{hour.toString().padStart(2, "0")}</div>))}</div>
          <div className="flex items-center justify-center font-bold text-2xl pb-1 text-zinc-300">:</div>
          <div ref={minuteRef} className="flex-1 overflow-y-auto scrollbar-hide snap-y snap-mandatory py-[104px]">{minutes.map((minute) => (<div key={minute} onClick={() => setSelectedMinute(minute)} className={`h-12 flex items-center justify-center snap-center cursor-pointer transition-all duration-200 ${selectedMinute === minute ? "text-3xl font-bold text-violet-600 dark:text-violet-400 scale-110" : "text-lg text-zinc-400 opacity-50"}`}>{minute.toString().padStart(2, "0")}</div>))}</div>
        </div>
        <div className="p-4 bg-white/50 dark:bg-black/20 border-t border-zinc-200 dark:border-white/10"><Button onClick={handleSave} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-6 rounded-xl text-lg shadow-lg shadow-violet-500/20">Saqlash</Button></div>
      </motion.div>
    </motion.div>
  );
};

// --- SWIPEABLE ITEM ---
const SwipeableTaskItem = ({ task, progress, isActive, onToggle, onDelete, onEdit }: any) => {
  const x = useMotionValue(0);
  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x < -80) { animate(x, -140, { type: "spring", stiffness: 400, damping: 25 }); } else { animate(x, 0, { type: "spring", stiffness: 400, damping: 25 }); }
  };
  const handleEditClick = () => { animate(x, 0); onEdit(); };

  // ID bo'sh bo'lsa render qilmaymiz (Xatolik oldini olish)
  if (!task || !task.id || !task.id.trim()) {
  return null; // 🔥 key="" OLDI OLINDI
}

  return (
    <motion.div layout variants={itemVariants} className="relative mb-3 h-[88px] w-full">
      <div className="absolute inset-y-0 right-0 flex w-[140px] rounded-[24px] overflow-hidden z-0 pl-4">
        <button onClick={handleEditClick} className="w-1/2 h-full bg-orange-500 flex flex-col items-center justify-center text-white active:bg-orange-600 transition-colors rounded-l-[16px]"><Edit className="w-5 h-5 mb-1" /><span className="text-[10px] font-bold uppercase">Edit</span></button>
        <button onClick={onDelete} className="w-1/2 h-full bg-red-500 flex flex-col items-center justify-center text-white active:bg-red-600 transition-colors rounded-r-[24px]"><Trash2 className="w-5 h-5 mb-1" /><span className="text-[10px] font-bold uppercase">Del</span></button>
      </div>
      <motion.div style={{ x }} drag="x" dragConstraints={{ left: -140, right: 0 }} dragElastic={0.1} onDragEnd={handleDragEnd} className={`relative z-10 w-full h-full overflow-hidden rounded-[24px] border border-white/5 shadow-sm bg-white dark:bg-[#09090b] ${task.completed ? "grayscale" : ""}`}>
        {!task.completed && progress > 0 && (<motion.div className="absolute inset-0 bg-violet-100 dark:bg-violet-900/30 z-0" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ ease: "easeOut", duration: 1.5 }} />)}
        <div className="relative z-10 w-full h-full p-5 flex items-center gap-4">
            <button onClick={onToggle} className="flex-shrink-0 transition-transform active:scale-90" onPointerDown={(e) => e.stopPropagation()}>
                {task.completed ? <CheckCircle2 className="w-7 h-7 text-emerald-500 fill-emerald-500/20" /> : <Circle className="w-7 h-7 text-zinc-300 dark:text-zinc-600 hover:text-violet-500 transition-colors" />}
            </button>
            <div className="flex-1 overflow-hidden">
                <h3 className={`font-semibold text-lg truncate ${task.completed ? "line-through text-zinc-500" : "text-foreground"}`}>{task.title}</h3>
                <div className="flex items-center gap-3 text-sm text-zinc-400 mt-1"><div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> <span className="font-mono">{task.time}</span></div>{isActive && (<span className="text-violet-500 font-bold text-xs animate-pulse">Jarayonda... {Math.round(progress)}%</span>)}</div>
            </div>
            <div className="w-1 h-8 rounded-full bg-zinc-200 dark:bg-white/10 shrink-0" />
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- MAIN PAGE ---
export default function SchedulePage() {
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Notification olib tashlandi, clearAllData qo'shildi
  const { tasks, addTask, updateTask, toggleTask, deleteTask, clearAllData, mounted } = useTaskManager();

  const [taskTitle, setTaskTitle] = useState("");
  const [taskTime, setTaskTime] = useState(format(new Date(), "HH:mm")); 
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    setTimeout(() => {
      const scrollContainer = scrollRef.current;
      const activeCard = document.getElementById("selected-card");
      if (scrollContainer && activeCard) {
        const centerPos = activeCard.offsetLeft - (scrollContainer.clientWidth / 2) + (activeCard.clientWidth / 2);
        scrollContainer.scrollTo({ left: centerPos, behavior: "smooth" });
      }
    }, 200);
    return () => clearInterval(timer);
  }, [selectedDate]);

  // Bugun va atrofidagi kunlar
  const days = Array.from({ length: 30 }, (_, i) => {
    const startPoint = subDays(selectedDate, 5); 
    return addDays(startPoint, i);
  });

  const handleSaveTask = () => {
    if (!taskTitle.trim()) return;
    if (editingTask) { updateTask(editingTask.id, taskTitle, taskTime); } 
    else { addTask(taskTitle, taskTime, selectedDate); }
    setTaskTitle(""); setTaskTime(format(new Date(), "HH:mm")); setIsFormOpen(false); setEditingTask(null);
  };

  const openAddForm = () => { setEditingTask(null); setTaskTitle(""); setTaskTime(format(new Date(), "HH:mm")); setIsFormOpen(true); };
  const openEditForm = (task: Task) => { setEditingTask(task); setTaskTitle(task.title); setTaskTime(task.time); setIsFormOpen(true); };

  const currentTasks = tasks.filter(task => task.date && isSameDay(parseISO(task.date), selectedDate));
  currentTasks.sort((a, b) => a.time.localeCompare(b.time));

  const getProgress = (task: Task, index: number) => {
    if (!isSameDay(selectedDate, today) || task.completed) return 0;
    const now = currentTime;
    const [h, m] = task.time.split(":").map(Number);
    const startTime = new Date(today); startTime.setHours(h, m, 0, 0);
    let endTime;
    const nextTask = currentTasks[index + 1];
    if (nextTask) {
        const [nh, nm] = nextTask.time.split(":").map(Number);
        endTime = new Date(today); endTime.setHours(nh, nm, 0, 0);
    } else { endTime = new Date(today); endTime.setHours(h + 1, m, 0, 0); }
    if (now < startTime) return 0;
    if (now > endTime) return 100;
    const total = endTime.getTime() - startTime.getTime();
    const elapsed = now.getTime() - startTime.getTime();
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!mounted) return null;
  const isSelectedDateToday = isSameDay(selectedDate, today);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-0"><div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-[100px]" /></div>

      <header className="relative z-10 px-6 pt-6 pb-4 flex items-center justify-between">
        <Link href="/dashboard"><Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-zinc-100 dark:hover:bg-white/10"><ArrowLeft className="w-6 h-6 text-foreground" /></Button></Link>
        <div onClick={() => setShowCalendar(true)} className="text-center cursor-pointer active:scale-95 transition-transform">
            <motion.div key={format(selectedDate, "MMMM yyyy")} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-lg font-bold text-foreground capitalize flex items-center gap-2 justify-center">{format(selectedDate, "MMMM yyyy", { locale: uz })}<CalendarIcon className="w-4 h-4 text-violet-500" /></motion.div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 font-mono">{format(currentTime, "HH:mm:ss")}</div>
        </div>
        
        {/* --- TOZALASH TUGMASI --- */}
        <div className="flex gap-2">
            <Button
  onClick={() => setShowClearConfirm(true)}
  variant="ghost"
  size="icon"
  className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
  title="Ma'lumotlarni tozalash"
>
  <RefreshCw className="w-5 h-5" />
</Button>
            <ThemeToggle />
        </div>
      </header>

      <div className="relative z-10 pb-6">
        <div ref={scrollRef} className="flex overflow-x-auto px-6 gap-3 pb-4 scrollbar-hide snap-x scroll-smooth">
          {days.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            const isTodayInLoop = isSameDay(day, today);
            const hasTask = tasks.some(t => t.date && isSameDay(parseISO(t.date), day));
            const isPast = day < today && !isTodayInLoop;
            
            // KEY FIX: ISO string har doim unikal
            return (
              <motion.button key={day.toISOString()} id={isSelected ? "selected-card" : `day-${i}`} onClick={() => setSelectedDate(day)}
                className={`relative flex-shrink-0 w-[70px] h-[90px] rounded-[24px] flex flex-col items-center justify-center gap-1 transition-all snap-center ${isSelected ? "text-white shadow-xl shadow-violet-500/30 scale-105" : isPast ? "bg-zinc-100/50 dark:bg-white/5 text-zinc-400 grayscale opacity-70" : "bg-white/50 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:bg-white/80 dark:hover:bg-white/10"}`} whileTap={{ scale: 0.95 }}>
                {isSelected && <motion.div layoutId="activeDay" className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-[24px]" />}
                <span className={`relative z-10 text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-white/80" : ""}`}>{isTodayInLoop ? "BUGUN" : format(day, "EEE", { locale: uz })}</span>
                <span className={`relative z-10 text-2xl font-black ${isSelected ? "text-white" : "text-foreground"}`}>{format(day, "d")}</span>
                <div className="relative z-10 h-2 flex items-center justify-center">{hasTask && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-violet-500"}`} />}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <main className="flex-1 relative z-10 bg-white/60 dark:bg-black/40 backdrop-blur-3xl rounded-t-[40px] border-t border-white/20 dark:border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
        <div className="p-8 pb-32 overflow-y-auto h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground capitalize">{isSelectedDateToday ? "Bugungi vazifalar" : format(selectedDate, "d-MMMM 'rejasi'", { locale: uz })}</h2>
                <div className="text-xs font-bold bg-zinc-100 dark:bg-white/10 px-3 py-1 rounded-full text-zinc-500">{currentTasks.filter(t => t.completed).length} / {currentTasks.length}</div>
            </div>

            <div className="space-y-1">
                <AnimatePresence mode="popLayout">
  {currentTasks
    .filter(t => t.id && t.id.trim() !== "")
    .map((task, index) => {
      const progress = getProgress(task, index);
      const isActive = progress > 0 && progress < 100;

      return (
        <SwipeableTaskItem
          key={task.id} // 🔒 100% STABLE
          task={task}
          progress={progress}
          isActive={isActive}
          onToggle={() => toggleTask(task.id)}
          onDelete={() => deleteTask(task.id)}
          onEdit={() => openEditForm(task)}
        />
      );
    })}
</AnimatePresence>
            </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background/95 to-transparent z-20">
          <AnimatePresence mode="wait">
            {isFormOpen ? (
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="ios-card p-4 bg-white dark:bg-zinc-900 border border-violet-500/30 shadow-[0_-10px_40px_rgba(124,58,237,0.15)]">
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center mb-1"><span className="text-xs font-bold uppercase text-zinc-400 tracking-wider">{editingTask ? "Tahrirlash" : "Yangi Vazifa"}</span>{editingTask && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Editing mode</span>}</div>
                    <div className="flex gap-3"><input autoFocus type="text" placeholder="Nima qilish kerak?" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="flex-1 bg-transparent outline-none text-foreground font-semibold text-lg placeholder:text-zinc-400" onKeyDown={(e) => e.key === "Enter" && handleSaveTask()} /></div>
                    <div className="flex items-center justify-between border-t border-zinc-100 dark:border-white/5 pt-3">
                        <button onClick={() => setShowTimePicker(true)} className="bg-zinc-100 dark:bg-zinc-800 rounded-lg px-3 py-1.5 text-sm font-bold text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"><Clock className="w-4 h-4 text-violet-500" /> {taskTime}</button>
                        <div className="flex gap-3"><Button variant="ghost" onClick={() => { setIsFormOpen(false); setEditingTask(null); }} className="text-zinc-500 hover:text-foreground">Bekor qilish</Button><Button onClick={handleSaveTask} className={`text-white rounded-xl px-6 font-bold shadow-lg ${editingTask ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' : 'bg-violet-600 hover:bg-violet-700 shadow-violet-500/20'}`}>{editingTask ? "Yangilash" : "Saqlash"}</Button></div>
                    </div>
                </div>
              </motion.div>
            ) : (
              <motion.button layoutId="addButton" onClick={openAddForm} className="w-full py-4 rounded-[24px] bg-foreground text-background font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"><Plus className="w-6 h-6" /> Vazifa qo'shish</motion.button>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>{showTimePicker && <TimePicker value={taskTime} onChange={setTaskTime} onClose={() => setShowTimePicker(false)} />}</AnimatePresence>
      <AnimatePresence>{showCalendar && <GlassCalendar selected={selectedDate} onSelect={setSelectedDate} onClose={() => setShowCalendar(false)} />}</AnimatePresence>
      <AnimatePresence>
  {showClearConfirm && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="ios-card w-full max-w-md bg-white dark:bg-zinc-900 border border-white/20 shadow-2xl"
      >
        {/* HEADER */}
        <div className="p-5 border-b border-zinc-200 dark:border-white/10">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Tasdiqlash
          </h3>
        </div>

        {/* CONTENT */}
        <div className="p-5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <b className="text-red-500">Barcha ma'lumotlar o‘chiriladi.</b>  
          Bu amalni qaytarib bo‘lmaydi. Davom etishni xohlaysizmi?
        </div>

        {/* ACTIONS */}
        <div className="p-4 flex justify-end gap-3 border-t border-zinc-200 dark:border-white/10">
          <Button
            variant="ghost"
            onClick={() => setShowClearConfirm(false)}
          >
            Bekor qilish
          </Button>

          <Button
            className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-500/20"
            onClick={() => {
              setShowClearConfirm(false);
              clearAllData();
            }}
          >
            Ha, o‘chirish
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
}