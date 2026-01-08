"use client";

import { useState, useEffect, useCallback } from "react";
import { isSameDay, parseISO, startOfToday } from "date-fns";

export type Task = {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  date: string;
  type: "work" | "personal" | "health";
};

export type DashboardStatus = 
  | { type: "empty" }
  | { type: "active"; task: Task; nextTask: Task | null }
  | { type: "all_done" };

export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mounted, setMounted] = useState(false);

  // 1. YUKLASH VA ID LARNI TUZATISH
  useEffect(() => {
    const saved = localStorage.getItem("grit_tasks");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Xatolarni tuzatish (Bo'sh ID larni to'ldirish)
          const cleanTasks = parsed.reduce((acc: Task[], t: any, idx: number) => {
            // Agar vazifa obyekti buzuq bo'lsa, tashlab yuboramiz
            if (!t || typeof t !== "object") return acc;

            // ID yasash (agar yo'q bo'lsa)
            let safeId = t.id;
            if (!safeId || String(safeId).trim() === "") {
              safeId = `fixed-${Date.now()}-${idx}-${Math.random().toString(36).slice(2)}`;
            }

            // Dublikat ID larni tekshirish
            if (acc.some(existing => existing.id === safeId)) {
              safeId = `dup-${safeId}-${Math.random()}`; // Agar ID bor bo'lsa, o'zgartiramiz
            }

            acc.push({
              ...t,
              id: safeId,
              date: t.date || new Date().toISOString(),
              completed: !!t.completed,
              time: t.time || "09:00"
            });
            return acc;
          }, []);

          setTasks(cleanTasks);
        }
      } catch (e) {
        // Agar ma'lumot butunlay buzuq bo'lsa, tozalaymiz
        localStorage.removeItem("grit_tasks");
        setTasks([]);
      }
    }
    setMounted(true);
  }, []);

  // 2. SAQLASH
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("grit_tasks", JSON.stringify(tasks));
    }
  }, [tasks, mounted]);

  // --- ACTIONS ---

  // Tizimni tozalash (Reset)
  const clearAllData = () => {
    if (window.confirm("Barcha ma'lumotlar o'chiriladi. Rozimisiz?")) {
      localStorage.removeItem("grit_tasks");
      setTasks([]);
      window.location.reload();
    }
  };

  const addTask = (title: string, time: string, date: Date) => {
    // Unikal ID generator (Crypto API yoki Random)
    const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const newTask: Task = {
      id: uniqueId,
      title,
      time,
      completed: false,
      date: date.toISOString(),
      type: "work"
    };
    
    // State yangilanishi
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, newTitle: string, newTime: string) => {
    setTasks((prev) => prev.map((t) => 
      t.id === id ? { ...t, title: newTitle, time: newTime } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const getDashboardStatus = useCallback((): DashboardStatus => {
    if (!mounted) return { type: "empty" };
    const today = startOfToday();
    const todaysTasks = tasks.filter(t => t.date && isSameDay(parseISO(t.date), today));
    
    if (todaysTasks.length === 0) return { type: "empty" };
    const pendingTasks = todaysTasks.filter(t => !t.completed);
    if (pendingTasks.length === 0) return { type: "all_done" };
    
    pendingTasks.sort((a, b) => a.time.localeCompare(b.time));
    return { type: "active", task: pendingTasks[0], nextTask: pendingTasks[1] || null };
  }, [tasks, mounted]);

  return { tasks, addTask, updateTask, deleteTask, toggleTask, getDashboardStatus, clearAllData, mounted };
}