"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 90 }}
        className="w-full max-w-[440px]"
      >
        {/* Shadow-2xl va backdrop-blur-3xl ideal kontrast beradi */}
        <div className="ios-card p-10 shadow-2xl backdrop-blur-3xl bg-white/60 dark:bg-black/40">
          
          <div className="text-center mb-10">
            <motion.div 
               whileHover={{ scale: 1.05, rotate: 5 }}
               className="w-20 h-20 mx-auto bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-[24px] flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-violet-500/30 mb-6"
            >
              G
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">DToDo ID</h1>
            <p className="text-zinc-500 font-medium mt-2">
              Kelajak sport tizimiga xush kelibsiz.
            </p>
          </div>

          <div className="relative min-h-[320px]">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20, filter: "blur(5px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginForm />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -20, filter: "blur(5px)" }}
                  transition={{ duration: 0.3 }}
                >
                  <RegisterForm />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-white/10 text-center">
             <p className="text-sm font-medium text-zinc-500">
               {isLogin ? "Hisobingiz yo'qmi?" : "Hisobingiz bormi?"}
               <button 
                 onClick={() => setIsLogin(!isLogin)}
                 className="ml-2 font-bold text-violet-600 hover:text-violet-500 transition-colors"
               >
                 {isLogin ? "Yaratish" : "Kirish"}
               </button>
             </p>
          </div>

        </div>
      </motion.div>
    </main>
  );
}