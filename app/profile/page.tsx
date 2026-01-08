// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence, Variants } from "framer-motion";
// import { 
//   ArrowLeft, Moon, Sun, LogOut, Trash2, ChevronRight, User, Lock, 
//   Smartphone, Edit3, X, Loader2 
// } from "lucide-react";
// import { ThemeToggle } from "@/components/ui/ThemeToggle";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { useTheme } from "next-themes";
// import { useRouter } from "next/navigation";

// // --- SERVER ACTIONS IMPORT ---
// import { 
//   getUserData, 
//   updateUserProfile, 
//   changeUserPassword, 
//   deleteUserAccount 
// } from "@/actions/profile.actions";
// // --- TYPES ---
// interface UserData {
//   name: string;
//   email: string;
// }

// // --- ANIMATION VARIANTS ---
// const containerVariants: Variants = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
// };

// const itemVariants: Variants = {
//   hidden: { opacity: 0, y: 20, scale: 0.98 },
//   visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
// };

// // --- COMPONENTS ---
// const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => (
//   <AnimatePresence>
//     {isOpen && (
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
//         <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="ios-card w-full max-w-sm bg-white/95 dark:bg-zinc-900/95 border border-white/20 shadow-2xl overflow-hidden">
//           <div className="flex justify-between items-center p-4 border-b border-zinc-100 dark:border-white/5">
//             <h3 className="font-bold text-lg">{title}</h3>
//             <button onClick={onClose} className="p-1 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
//           </div>
//           <div className="p-6">{children}</div>
//         </motion.div>
//       </motion.div>
//     )}
//   </AnimatePresence>
// );

// const SettingRow = ({ icon: Icon, title, subtitle, rightElement, onClick, isDanger = false }: any) => (
//   <motion.div variants={itemVariants} onClick={onClick} className={`flex items-center justify-between p-4 bg-white/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-white/5 first:rounded-t-[24px] last:rounded-b-[24px] not-last:border-b-0 backdrop-blur-sm ${onClick ? 'cursor-pointer active:bg-zinc-100 dark:active:bg-white/10 transition-colors' : ''}`}>
//     <div className="flex items-center gap-4">
//       <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDanger ? 'bg-red-100 text-red-500 dark:bg-red-900/20' : 'bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-400'}`}><Icon className="w-5 h-5" /></div>
//       <div><h4 className={`font-semibold text-sm ${isDanger ? 'text-red-500' : 'text-foreground'}`}>{title}</h4>{subtitle && <p className="text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>}</div>
//     </div>
//     <div>{rightElement || (onClick && <ChevronRight className="w-5 h-5 text-zinc-400" />)}</div>
//   </motion.div>
// );

// export default function ProfilePage() {
//   const { theme } = useTheme();
//   const [mounted, setMounted] = useState(false);
//   const router = useRouter();
  
//   // Haqiqiy loyihada bu yerdan sessiyadagi emailni olasiz
//   // Masalan: const { data: session } = useSession(); const currentUserEmail = session?.user?.email;
//   const currentUserEmail = "test@example.com"; // Test uchun

//   // -- STATES --
//   const [userData, setUserData] = useState<UserData>({ name: "Yuklanmoqda...", email: "" });
//   const [loading, setLoading] = useState(false);

//   // Modals
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [isPasswordOpen, setIsPasswordOpen] = useState(false);
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);

//   // Form Inputs
//   const [editName, setEditName] = useState("");
//   const [editEmail, setEditEmail] = useState("");
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");

//   // Initial Load
//   useEffect(() => {
//     setMounted(true);
//     const fetchUser = async () => {
//       const res = await getUserData(currentUserEmail);
//       if (res.success && res.user) {
//         setUserData({ name: res.user.name, email: res.user.email });
//         setEditName(res.user.name);
//         setEditEmail(res.user.email);
//       }
//     };
//     fetchUser();
//   }, []);

//   // --- ACTIONS ---

//   const handleUpdateProfile = async () => {
//     if (!editName || !editEmail) return alert("Barcha maydonlarni to'ldiring");
//     setLoading(true);
    
//     const res = await updateUserProfile(currentUserEmail, editName, editEmail);
    
//     if (res.success) {
//       setUserData({ name: editName, email: editEmail });
//       setIsEditOpen(false);
//       alert("Profil muvaffaqiyatli yangilandi!");
//     } else {
//       alert(res.message);
//     }
//     setLoading(false);
//   };

//   const handleChangePassword = async () => {
//     if (!oldPassword || !newPassword) return alert("Parollarni kiriting");
//     setLoading(true);

//     const res = await changeUserPassword(currentUserEmail, oldPassword, newPassword);

//     if (res.success) {
//       setIsPasswordOpen(false);
//       setOldPassword("");
//       setNewPassword("");
//       alert("Parol o'zgartirildi!");
//     } else {
//       alert(res.message);
//     }
//     setLoading(false);
//   };

//   const handleDeleteAccount = async () => {
//     setLoading(true);
//     const res = await deleteUserAccount(currentUserEmail);

//     if (res.success) {
//       localStorage.clear(); // LocalStorage tozalash
//       router.push("/login"); // Login sahifasiga yo'naltirish
//     } else {
//       alert(res.message);
//       setLoading(false);
//     }
//   };

//   // --- RENDER ---
//   return (
//     <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
//       <div className="fixed inset-0 pointer-events-none z-0">
//         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-[100px]" />
//         <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px]" />
//       </div>

//       <header className="relative z-10 px-6 pt-6 pb-4 flex items-center justify-between">
//         <Link href="/dashboard"><Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-zinc-100 dark:hover:bg-white/10"><ArrowLeft className="w-6 h-6 text-foreground" /></Button></Link>
//         <div className="text-center"><h1 className="text-lg font-bold text-foreground">Profil</h1></div>
//         <div className="w-10" />
//       </header>

//       <main className="flex-1 relative z-10 overflow-y-auto pb-10">
//         <motion.div variants={containerVariants} initial="hidden" animate="visible" className="px-6 py-4 space-y-8 max-w-lg mx-auto">
          
//           {/* PROFILE CARD */}
//           <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-6 relative">
//             <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 p-[3px] shadow-2xl shadow-violet-500/30">
//               <div className="w-full h-full rounded-full bg-white dark:bg-black overflow-hidden flex items-center justify-center">
//                  <User className="w-12 h-12 text-zinc-300" />
//               </div>
//             </div>
//             <h2 className="mt-4 text-2xl font-bold text-foreground">{userData.name}</h2>
//             <p className="text-zinc-500 dark:text-zinc-400 text-sm">{userData.email || "Email yuklanmoqda..."}</p>
            
//             <Button onClick={() => setIsEditOpen(true)} variant="outline" className="mt-4 rounded-full h-9 px-6 text-xs border-zinc-200 dark:border-white/10 gap-2">
//               <Edit3 className="w-3 h-3" /> Tahrirlash
//             </Button>
//           </motion.div>

//           {/* 1. UMUMIY SOZLAMALAR */}
//           <div className="space-y-2">
//             <h3 className="px-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Umumiy</h3>
//             <div className="flex flex-col rounded-[24px] shadow-sm overflow-hidden">
//                 <SettingRow 
//                     icon={mounted && theme === 'dark' ? Moon : Sun} 
//                     title="Mavzu" 
//                     subtitle={!mounted ? "Yuklanmoqda..." : (theme === 'dark' ? "Tungi rejim" : "Kunduzgi rejim")}
//                     rightElement={<ThemeToggle />}
//                 />
//                 <SettingRow 
//                     icon={Smartphone} 
//                     title="Versiya" 
//                     rightElement={<span className="text-xs font-mono text-zinc-400 bg-zinc-100 dark:bg-white/5 px-2 py-1 rounded">v1.0.3</span>}
//                 />
//             </div>
//           </div>

//           {/* 2. XAVFSIZLIK */}
//           <div className="space-y-2">
//             <h3 className="px-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Xavfsizlik</h3>
//             <div className="flex flex-col rounded-[24px] shadow-sm overflow-hidden">
//                 <SettingRow 
//                     icon={Lock} 
//                     title="Parolni o'zgartirish" 
//                     subtitle="Xavfsizlik uchun vaqti-vaqti bilan yangilang"
//                     onClick={() => setIsPasswordOpen(true)}
//                 />
//             </div>
//           </div>

//           {/* 3. XAVFLI HUDUD */}
//           <div className="space-y-2">
//             <h3 className="px-4 text-xs font-bold text-red-400 uppercase tracking-wider">Xavfli Hudud</h3>
//             <div className="flex flex-col rounded-[24px] shadow-sm overflow-hidden">
//                 <SettingRow 
//                     icon={Trash2} 
//                     title="Hisobni o'chirish" 
//                     subtitle="Barcha ma'lumotlar butunlay o'chiriladi"
//                     isDanger
//                     onClick={() => setIsDeleteOpen(true)}
//                 />
//                 <SettingRow 
//                     icon={LogOut} 
//                     title="Chiqish" 
//                     isDanger
//                     onClick={() => router.push("/login")}
//                 />
//             </div>
//           </div>

//           <div className="text-center pt-6 pb-10">
//              <p className="text-[10px] text-zinc-400">GritApp &copy; {new Date().getFullYear()} Protected.</p>
//           </div>
//         </motion.div>
//       </main>

//       {/* --- EDIT PROFILE MODAL --- */}
//       <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Profilni tahrirlash">
//         <div className="space-y-4">
//           <div>
//             <label className="text-xs text-zinc-500 mb-1 block">Ism</label>
//             <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 ring-violet-500/50" />
//           </div>
//           <div>
//             <label className="text-xs text-zinc-500 mb-1 block">Email</label>
//             <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 ring-violet-500/50" />
//           </div>
//           <Button onClick={handleUpdateProfile} disabled={loading} className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold mt-2">
//             {loading ? <Loader2 className="animate-spin" /> : "Saqlash"}
//           </Button>
//         </div>
//       </Modal>

//       {/* --- PASSWORD MODAL --- */}
//       <Modal isOpen={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} title="Parolni o'zgartirish">
//         <div className="space-y-4">
//           <div>
//             <label className="text-xs text-zinc-500 mb-1 block">Eski parol</label>
//             <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 ring-violet-500/50" />
//           </div>
//           <div>
//             <label className="text-xs text-zinc-500 mb-1 block">Yangi parol</label>
//             <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 ring-violet-500/50" />
//           </div>
//           <Button onClick={handleChangePassword} disabled={loading} className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold mt-2">
//             {loading ? <Loader2 className="animate-spin" /> : "Yangilash"}
//           </Button>
//         </div>
//       </Modal>

//       {/* --- DELETE ACCOUNT MODAL --- */}
//       <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Hisobni o'chirish">
//         <div className="text-center">
//           <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
//             <Trash2 className="w-8 h-8" />
//           </div>
//           <p className="text-zinc-600 dark:text-zinc-300 mb-6 text-sm">
//             Haqiqatan ham hisobingizni o'chirmoqchimisiz? <br/>
//             <span className="text-red-500 font-bold">Bu amalni ortga qaytarib bo'lmaydi.</span>
//           </p>
//           <div className="flex gap-3">
//             <Button onClick={() => setIsDeleteOpen(false)} className="flex-1 bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-white hover:bg-zinc-200 dark:hover:bg-white/20 rounded-xl h-12 font-semibold">Bekor qilish</Button>
//             <Button onClick={handleDeleteAccount} disabled={loading} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl h-12 font-semibold shadow-lg shadow-red-500/20">
//               {loading ? <Loader2 className="animate-spin" /> : "O'chirish"}
//             </Button>
//           </div>
//         </div>
//       </Modal>

//     </div>
//   );
// }