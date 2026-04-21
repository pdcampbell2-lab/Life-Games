"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  UserCircle, 
  School, 
  ArrowRight, 
  Gamepad2, 
  ShieldCheck,
  Target,
  Users,
  BrainCircuit
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (role === 'teacher') {
        router.push('/teacher/dashboard');
      } else {
        router.push('/student/choose-profile');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Navigation */}
      <nav className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-10 h-10 text-brand-600" />
          <span className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Life Games</span>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 p-8 md:p-16 items-center">
        {/* Left Side: Mission & Vision */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-10"
        >
          <div className="space-y-6">
            <span className="px-4 py-2 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-black uppercase tracking-widest rounded-full border border-brand-200 dark:border-brand-800">
              Welcome to the Real World
            </span>
            <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[0.9]">
              Master Your <span className="text-brand-600">Life Skills</span> Before It Matters.
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
              Life Games is designed to help you develop real-world life skills through realistic decision-making. No fantasy. No perfection. Just the skills you need to manage life responsibly.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:translate-y-[-5px] transition-transform">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="font-black text-slate-900 dark:text-white tracking-tight">Focus on Needs</h4>
              <p className="text-xs text-slate-400 font-medium">Learn to prioritize essentials over optional luxuries.</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:translate-y-[-5px] transition-transform">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="font-black text-slate-900 dark:text-white tracking-tight">Impact Awareness</h4>
              <p className="text-xs text-slate-400 font-medium">Understand how your choices affect you and your family.</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Login Terminal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-14 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="space-y-8 relative">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Access Portal</h2>
              <p className="text-slate-500 font-medium">Select your role to enter the simulation.</p>
            </div>

            <div className="flex p-2 bg-slate-50 dark:bg-slate-800 rounded-[2rem] gap-2">
              <button 
                onClick={() => setRole('student')}
                className={`flex-1 py-4 px-6 rounded-[1.5rem] text-sm font-black transition-all flex items-center justify-center gap-3 ${
                  role === 'student' 
                  ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-xl shadow-brand-500/10 border-2 border-brand-100 dark:border-brand-600' 
                  : 'text-slate-400 hover:text-slate-500'
                }`}
              >
                <UserCircle className="w-5 h-5" />
                Student
              </button>
              <button 
                onClick={() => setRole('teacher')}
                className={`flex-1 py-4 px-6 rounded-[1.5rem] text-sm font-black transition-all flex items-center justify-center gap-3 ${
                  role === 'teacher' 
                  ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-xl shadow-brand-500/10 border-2 border-brand-100 dark:border-brand-600' 
                  : 'text-slate-400 hover:text-slate-500'
                }`}
              >
                <School className="w-5 h-5" />
                Teacher
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@school.edu"
                    className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-brand-500 outline-none font-bold transition-all"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Access Keyword</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-brand-500 outline-none font-bold transition-all"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-6 text-xl flex items-center justify-center gap-3 shadow-2xl shadow-brand-500/20"
              >
                {loading ? 'Authenticating...' : 'Enter Real World'}
                <ArrowRight className="w-6 h-6" />
              </button>
            </form>

            <div className="pt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Secure Session
              </div>
              <div className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Users className="w-4 h-4 text-brand-500" />
                Active Classroom
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer / Mission Quote */}
      <footer className="p-8 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-sm font-bold text-slate-400">
          "The goal is not perfection. The goal is to learn how to manage life responsibly."
        </p>
      </footer>
    </div>
  );
}
