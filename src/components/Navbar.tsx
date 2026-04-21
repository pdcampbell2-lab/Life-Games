"use client";

import React from 'react';
import { Gamepad2, Bell, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { MOCK_PROFILES } from '@/data/profiles';
import Link from 'next/link';

export default function Navbar() {
  const pathname = usePathname();
  const isStudent = pathname?.startsWith('/student');
  
  // Try to find selected persona if in student mode
  const [profileName, setProfileName] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isStudent) {
      const savedId = localStorage.getItem('selected_profile_id');
      if (savedId) {
        const profile = MOCK_PROFILES.find(p => p.id === savedId);
        if (profile) setProfileName(profile.title);
      }
    }
  }, [isStudent]);

  return (
    <nav className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Gamepad2 className="w-8 h-8 text-brand-600" />
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent italic">
          Life Games
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {!isStudent && (
          <div className="hidden md:flex items-center gap-6 mr-6 transition-all animate-in fade-in slide-in-from-right-4">
            <Link href="/teacher/setup" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors">Setup Lab</Link>
            <Link href="/teacher/dashboard" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors">Admin Dashboard</Link>
          </div>
        )}
        
        <button 
          onClick={() => alert("Recent activity: All systems operational. Student lab session LG-2026 is currently active.")}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative"
        >
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">
              {isStudent ? (profileName || "Student Player") : "Prof. Harrison"}
            </p>
            <p className="text-[10px] text-brand-600 font-black uppercase tracking-widest">
              {isStudent ? "Simulation Active" : "Educator Mode"}
            </p>
          </div>
          <button 
            onClick={() => alert(`Active User: ${isStudent ? (profileName || "Student Player") : "Prof. Harrison"}\nRole: ${isStudent ? "Simulation Active" : "Educator Mode"}`)}
            className="w-10 h-10 rounded-2xl bg-brand-600 shadow-lg shadow-brand-600/20 overflow-hidden flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <User className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </nav>
  );
}
