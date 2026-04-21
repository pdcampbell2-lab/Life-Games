"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Target, 
  BrainCircuit, 
  Users, 
  ShieldCheck,
  ArrowRight,
  Gamepad2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MissionBriefing() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-full">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[100px] -mr-64 -mt-64"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -ml-20 -mb-20"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl relative z-10 space-y-12"
      >
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
             <Gamepad2 className="w-12 h-12 text-brand-500" />
             <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Life Games</h1>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.9]">
            The Rules of the <span className="text-brand-500">Real World.</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Success in Life Games isn't about winning—it's about learning to manage responsibilities and make better decisions over time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
           <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl space-y-4">
              <BrainCircuit className="w-10 h-10 text-amber-500" />
              <h3 className="text-xl font-black text-white">Problem Solving</h3>
              <p className="text-sm text-slate-400 font-medium">Scenarios are based on real-life challenges, not fantasy. Use your resources wisely.</p>
           </div>
           <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl space-y-4">
              <Target className="w-10 h-10 text-emerald-500" />
              <h3 className="text-xl font-black text-white">Needs vs Wants</h3>
              <p className="text-sm text-slate-400 font-medium">Learn to prioritize essentials while managing family and career responsibilities.</p>
           </div>
           <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl space-y-4">
              <Users className="w-10 h-10 text-brand-500" />
              <h3 className="text-xl font-black text-white">Social Impact</h3>
              <p className="text-sm text-slate-400 font-medium">Every choice affects not just your wallet, but your family and your future self.</p>
           </div>
        </div>

        <div className="flex flex-col items-center gap-8">
           <div className="flex items-center gap-2 text-slate-500 font-black uppercase tracking-widest text-xs">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              Simulation Ready • Persona Loaded
           </div>
           <button 
             onClick={handleStart}
             className="btn-primary py-6 px-16 text-2xl flex items-center gap-4 group hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
           >
             Accept the Challenge
             <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
           </button>
        </div>
      </motion.div>
    </div>
  );
}
