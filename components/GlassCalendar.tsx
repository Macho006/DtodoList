"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { uz } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ChevronDown } from "lucide-react";
import { format, setMonth, setYear, getYear } from "date-fns";
import "react-day-picker/dist/style.css";

interface GlassCalendarProps {
  selected: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

type ViewMode = "calendar" | "months" | "years";

export function GlassCalendar({ selected, onSelect, onClose }: GlassCalendarProps) {
  const [currentDate, setCurrentDate] = useState(selected);
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");

  // Yillar oralig'i (masalan 2020-2040)
  const currentYear = getYear(currentDate);
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);
  const months = Array.from({ length: 12 }, (_, i) => i);

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentDate(setMonth(currentDate, monthIndex));
    setViewMode("calendar");
  };

  const handleYearSelect = (year: number) => {
    setCurrentDate(setYear(currentDate, year));
    setViewMode("calendar");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="relative bg-white/95 dark:bg-[#18181b]/95 border border-white/20 rounded-[32px] p-6 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col h-[420px]"
      >
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-4 pl-2 shrink-0">
          <div className="flex items-center gap-1">
            {/* OY TUGMASI */}
            <button 
              onClick={() => setViewMode(viewMode === "months" ? "calendar" : "months")}
              className={`text-xl font-bold capitalize transition-colors flex items-center gap-1 ${viewMode === "months" ? "text-violet-500" : "text-foreground hover:text-violet-500"}`}
            >
              {format(currentDate, "MMMM", { locale: uz })}
              <ChevronDown className={`w-4 h-4 transition-transform ${viewMode === "months" ? "rotate-180" : ""}`} />
            </button>

            {/* YIL TUGMASI */}
            <button 
              onClick={() => setViewMode(viewMode === "years" ? "calendar" : "years")}
              className={`text-xl font-medium ml-2 transition-colors flex items-center gap-1 ${viewMode === "years" ? "text-violet-500" : "text-zinc-500 hover:text-violet-500"}`}
            >
              {format(currentDate, "yyyy")}
              <ChevronDown className={`w-4 h-4 transition-transform ${viewMode === "years" ? "rotate-180" : ""}`} />
            </button>
          </div>

          <button onClick={onClose} className="p-2 bg-zinc-100 dark:bg-white/10 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- CONTENT --- */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            
            {/* 1. CALENDAR VIEW */}
            {viewMode === "calendar" && (
              <motion.div 
                key="calendar"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0"
              >
                <style jsx global>{`
                  .rdp { margin: 0; --rdp-cell-size: 40px; --rdp-accent-color: #7c3aed; --rdp-background-color: #efe6ff; }
                  .rdp-month { width: 100%; }
                  .rdp-table { width: 100%; max-width: 100%; }
                  .rdp-caption { display: none; } 
                  .rdp-head_cell { color: #a1a1aa; font-weight: 500; font-size: 0.8rem; text-transform: uppercase; padding-bottom: 10px; }
                  .rdp-day { border-radius: 12px; font-weight: 500; transition: all 0.2s; }
                  .rdp-day_selected:not([disabled]) { background-color: #7c3aed; color: white; font-weight: bold; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3); }
                  .rdp-day_today { color: #7c3aed; font-weight: 900; background-color: rgba(124, 58, 237, 0.1); }
                  .dark .rdp-day:hover:not(.rdp-day_selected) { background-color: rgba(255,255,255,0.1); }
                  .rdp-day:hover:not(.rdp-day_selected) { background-color: #f3f4f6; }
                `}</style>

<DayPicker
  mode="single"
  selected={selected}
  onSelect={(date) => {
    if (date) {
      onSelect(date);
      onClose();
    }
  }}
  month={currentDate}
  onMonthChange={setCurrentDate}
  locale={uz}
  showOutsideDays
/>
              </motion.div>
            )}

            {/* 2. MONTHS VIEW */}
            {viewMode === "months" && (
              <motion.div 
                key="months"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 grid grid-cols-3 gap-3 overflow-y-auto content-start p-1"
              >
                {months.map((m) => {
                  const tempDate = setMonth(new Date(), m);
                  const isSelected = m === currentDate.getMonth();
                  return (
                    <button
                      key={m}
                      onClick={() => handleMonthSelect(m)}
                      className={`h-14 rounded-2xl font-semibold text-sm capitalize transition-all
                        ${isSelected 
                          ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30" 
                          : "bg-zinc-50 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10"
                        }`}
                    >
                      {format(tempDate, "MMM", { locale: uz })}
                    </button>
                  );
                })}
              </motion.div>
            )}

            {/* 3. YEARS VIEW */}
            {viewMode === "years" && (
              <motion.div 
                key="years"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 grid grid-cols-4 gap-3 overflow-y-auto content-start p-1 no-scrollbar"
              >
                {years.map((year) => {
                  const isSelected = year === getYear(currentDate);
                  return (
                    <button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className={`h-12 rounded-xl font-semibold text-sm transition-all
                        ${isSelected 
                          ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30" 
                          : "bg-zinc-50 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10"
                        }`}
                    >
                      {year}
                    </button>
                  );
                })}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
        
        {/* Footer Hint */}
        {viewMode === "calendar" && (
           <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-white/5 text-center text-xs text-zinc-400">
              Tezkor o'tish uchun oy yoki yil nomiga bosing
           </div>
        )}
      </motion.div>
    </motion.div>
  );
}