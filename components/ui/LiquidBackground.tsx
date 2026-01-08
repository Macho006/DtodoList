"use client";

export const LiquidBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden bg-black">
      {/* 1. Katta Binafsha Shar */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/30 rounded-full blur-[100px] animate-float-slow" />
      
      {/* 2. Moviy Shar */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-float-medium" />
      
      {/* 3. Pushti/Qizil Shar (Pastda) */}
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[120px] animate-float-fast" />

      {/* 4. Markaziy yorug'lik */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px]" />
    </div>
  );
};