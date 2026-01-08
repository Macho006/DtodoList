"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; // Sahifani almashtirish uchun

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Muvaffaqiyatli kirganda Dashboardga yo'naltiramiz
        router.push("/dashboard"); 
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server bilan aloqa yo'q.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl"
    >
      <h2 className="text-3xl font-bold text-center text-white mb-2">Qaytganingizdan xursandmiz</h2>
      <p className="text-zinc-400 text-center mb-6">Davom ettirish uchun kiring</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            required
            className="bg-zinc-950 border-zinc-800 text-white"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Parol"
            required
            className="bg-zinc-950 border-zinc-800 text-white"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-white text-black hover:bg-gray-200 transition-all"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Kirish"}
        </Button>

        {error && (
          <p className="text-red-400 text-center text-sm mt-2">{error}</p>
        )}
      </form>
    </motion.div>
  );
}