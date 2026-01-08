"use client";

import { useEffect, useRef } from "react";
import { Task } from "./useTaskManager";

export function useTaskNotification(tasks: Task[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const notifiedTasks = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    }

    // Ruxsat so'rash (Xatolik bersa, e'tibor bermaymiz)
    if (typeof Notification !== "undefined" && Notification.permission !== "granted") {
      Notification.requestPermission().catch(() => {}); 
    }

    const checkTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      const currentTime = `${h}:${m}`;
      const today = now.toISOString().split("T")[0];

      tasks.forEach((task) => {
        if (!task.date) return;
        const taskDate = task.date.split("T")[0];

        if (
          taskDate === today &&
          task.time === currentTime &&
          !task.completed &&
          !notifiedTasks.current.has(task.id + task.time)
        ) {
          playSafe(task.title);
          notifiedTasks.current.add(task.id + task.time);
        }
      });
    };

    const interval = setInterval(checkTime, 5000);
    return () => clearInterval(interval);
  }, [tasks]);

  const playSafe = async (title: string) => {
    // Audio xatoligini yopish (User interaction needed error)
    try {
      if (audioRef.current) {
        await audioRef.current.play();
      }
    } catch (err) {
      // Jim turamiz
    }

    // Notification xatoligini yopish
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      try {
        new Notification("Vaqt bo'ldi! ⏰", { body: `Vazifa: ${title}` });
      } catch (e) {}
    }
  };
}