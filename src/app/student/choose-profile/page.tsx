"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Wallet, 
  Heart, 
  Search, 
  Filter,
  Briefcase,
  Home,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PROFILES } from '@/data/profiles';

export default function ChooseProfile() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'single' | 'married' | 'divorced' | 'separated'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();

  const filteredProfiles = useMemo(() => {
    return MOCK_PROFILES.filter(p => {
      const matchesSearch = p.job_title.toLowerCase().includes(search.toLowerCase()) || 
                          p.title.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || p.marital_status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    localStorage.setItem('selected_profile_id', id);
    // Add small delay for animation
    setTimeout(() => {
      router.push('/student/briefing');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" />
            <span className="text-xs font-black uppercase tracking-widest text-brand-600">Persona Selection</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Step into a <span className="text-brand-600">New Life.</span></h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl">Browse the {MOCK_PROFILES.length} available personas. Each path has unique financial challenges and family responsibilities.</p>
        </header>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex-1 relative">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
             <input 
               type="text"
               placeholder="Search by job or title..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-slate-50 dark:bg-slate-800 pl-14 pr-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:border-brand-500 outline-none transition-all font-bold"
             />
           </div>
           <div className="flex items-center gap-2 px-2 overflow-x-auto pb-2 md:pb-0">
              {['all', 'single', 'married', 'divorced', 'separated'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-6 py-4 rounded-[1.25rem] text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                    filter === f 
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {f}
                </button>
              ))}
           </div>
        </div>

        {/* Grid Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProfiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelect(profile.id)}
                className={`group cursor-pointer relative bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 overflow-hidden transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
                  selectedId === profile.id 
                  ? 'border-brand-600 ring-4 ring-brand-100 dark:ring-brand-900/40' 
                  : 'border-slate-100 dark:border-slate-800'
                }`}
              >
                {/* Image & Overlay */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={profile.image} 
                    alt={profile.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">{profile.job_title}</p>
                      <p className="text-xl font-black text-white leading-tight">{profile.title}</p>
                    </div>
                  </div>
                  {selectedId === profile.id && (
                    <div className="absolute top-4 right-4 bg-brand-600 text-white p-2 rounded-full shadow-xl">
                       <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Monthly Cash</p>
                        <div className="flex items-center gap-1.5 font-black text-slate-900 dark:text-white">
                          <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                          ${((profile.budget.income_player_1 + (profile.budget.income_player_2 || 0)) * 2).toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</p>
                        <div className="flex items-center gap-1.5 font-black text-slate-900 dark:text-white capitalize">
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
                          {profile.marital_status}
                        </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                     <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        <Home className="w-3.5 h-3.5" />
                        Housing
                     </div>
                     <p className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate">{profile.housing_type}</p>
                   </div>
                </div>

                {/* Selection Indicator Overlay */}
                <div className={`absolute inset-0 bg-brand-600/10 transition-opacity duration-300 pointer-events-none ${selectedId === profile.id ? 'opacity-100' : 'opacity-0'}`}></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredProfiles.length === 0 && (
          <div className="text-center py-20 space-y-4">
             <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
               <Filter className="w-8 h-8 text-slate-300" />
             </div>
             <p className="text-lg font-black text-slate-400">No personas match your filters.</p>
             <button onClick={() => {setSearch(''); setFilter('all')}} className="text-brand-600 font-black uppercase text-xs tracking-widest">Clear All Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
