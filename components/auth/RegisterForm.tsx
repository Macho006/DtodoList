"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input"; // shadcn
import { Button } from "@/components/ui/button"; // shadcn
import { Loader2 } from "lucide-react"; // Loading icon

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Muvaffaqiyatli! Endi kiring.");
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ Xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl"
    >
      <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-tight">
        Hisob yaratish
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Ismingiz"
            required
            className="bg-zinc-950 border-zinc-800 text-white focus:ring-violet-500"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="Email manzilingiz"
            required
            className="bg-zinc-950 border-zinc-800 text-white focus:ring-violet-500"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Parol o'ylab toping"
            required
            className="bg-zinc-950 border-zinc-800 text-white focus:ring-violet-500"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-white text-black hover:bg-gray-200 transition-all font-semibold"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Ro'yxatdan o'tish"}
        </Button>

        {message && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className={`text-center text-sm mt-2 ${message.startsWith("✅") ? "text-green-400" : "text-red-400"}`}
          >
            {message}
          </motion.p>
        )}
      </form>
    </motion.div>
  );
}