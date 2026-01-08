// components/ui/ScrollReveal.tsx

"use client";

import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Kechikish vaqti
  direction?: "up" | "down" | "left" | "right"; // Qaysi tomondan chiqishi
}

export const ScrollReveal = ({ 
  children, 
  className = "", 
  delay = 0,
  direction = "up" 
}: ScrollRevealProps) => {
  
  // Yo'nalishni aniqlash
  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { y: 40, x: 0 };
      case "down": return { y: -40, x: 0 };
      case "left": return { x: 40, y: 0 }; // O'ngdan chapga
      case "right": return { x: -40, y: 0 }; // Chapdan o'ngga
      default: return { y: 40, x: 0 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getInitialPosition() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }} // once: true -> faqat bir marta o'ynaydi (qayta scroll qilganda yo'qolib qolmaydi)
      transition={{ 
        duration: 0.8, 
        delay: delay, 
        ease: [0.21, 0.47, 0.32, 0.98] // Juda silliq "Apple" stili
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};