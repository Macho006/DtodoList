"use client";

import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { FadeIn } from "@/components/ui/FadeIn";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      {/* Orqa fon bezagi */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-black to-black opacity-40 pointer-events-none" />
      
      <FadeIn>
        <div className="relative z-10 w-full">
          {isLogin ? <LoginForm /> : <RegisterForm />}
          
          <div className="mt-6 text-center">
            <p className="text-zinc-500">
              {isLogin ? "Hali hisobingiz yo'qmi?" : "Hisobingiz bormi?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-white font-medium hover:underline focus:outline-none"
              >
                {isLogin ? "Ro'yxatdan o'tish" : "Kirish"}
              </button>
            </p>
          </div>
        </div>
      </FadeIn>
    </main>
  );
}