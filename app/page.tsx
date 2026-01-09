"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-black relative flex flex-col items-center justify-center p-4 overflow-hidden">
      
      {/* 1. Orqa Fon Effektlari (Dashboard bilan bir xil uslubda) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* 2. Logo va Sarlavha */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-[24px] flex items-center justify-center text-white shadow-2xl shadow-violet-500/30 mx-auto mb-4">
            <span className="font-bold text-3xl">G</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Grit<span className="text-violet-500">App</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            Intizom va Reja — muvaffaqiyat kaliti.
          </p>
        </motion.div>

        {/* 3. Auth Karta (Login/Register) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-zinc-900/60 border border-white/10 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <LoginForm />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <RegisterForm />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 4. Footer (Almashtirish tugmasi) */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-zinc-500 text-sm">
              {isLogin ? "Hali hisobingiz yo'qmi?" : "Hisobingiz bormi?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-violet-400 font-semibold hover:text-violet-300 transition-colors focus:outline-none"
              >
                {isLogin ? "Ro'yxatdan o'tish" : "Kirish"}
              </button>
            </p>
          </div>
        </motion.div>

        <p className="text-center text-zinc-600 text-xs mt-8">
          &copy; {new Date().getFullYear()} DToDo Inc. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </div>
  );
}