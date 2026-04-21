"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import { 
  Users, 
  Settings, 
  CreditCard, 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Download, 
  Search,
  ExternalLink,
  DollarSign,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PROFILES } from '@/data/profiles';
import { useTeacher } from '@/hooks/useTeacher';
import { useRouter } from 'next/navigation';

export default function TeacherSetup() {
  const { batchAssignStudents, profiles } = useTeacher();
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [selectedProfileIds, setSelectedProfileIds] = React.useState<string[]>([]);
  const [selectedBank, setSelectedBank] = React.useState('Royal Bank');
  const [startingBalance, setStartingBalance] = React.useState<number>(0);
  const [studentName, setStudentName] = React.useState('');

  const filteredProfiles = profiles.filter(p => 
    p.job_title.toLowerCase().includes(search.toLowerCase()) || 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  // ONLY set default balance on initial selection, allowing manual overrides after
  React.useEffect(() => {
    if (selectedProfileIds.length > 1) return; // Multiple selection handled differently
    if (selectedProfileIds.length === 1) {
      const profile = profiles.find(p => p.id === selectedProfileIds[0]);
      if (profile) {
        setStartingBalance(prev => prev === 0 ? profile.initial_savings : prev);
      }
    }
  }, [selectedProfileIds, profiles]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6 md:p-10 space-y-12">
        {/* WIZARD PROGRESS */}
        <section className="flex items-center justify-between relative px-2">
           <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 -z-10" />
           {[1, 2, 3, 4].map((s) => (
             <div 
               key={s}
               className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${step >= s ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800'}`}
             >
                {step > s ? <Check className="w-6 h-6" /> : s}
             </div>
           ))}
        </section>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
               <div className="text-center space-y-2">
                  <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic">STEP 1: ASSIGN PLAYERS</h1>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Assign each student to one of the 43 available life paths.</p>
               </div>

               <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                  <div className="flex flex-col md:flex-row gap-4">
                     <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Student Full Name</label>
                        <input 
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="e.g. John Smith"
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-lg font-black focus:ring-2 focus:ring-brand-600 outline-none"
                        />
                     </div>
                     <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Search Profile Library</label>
                        <div className="relative">
                          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by job title..."
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-lg font-black focus:ring-2 focus:ring-brand-600 outline-none"
                          />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-2 scrollbar-hide">
                      {filteredProfiles.map((p) => {
                        const isSelected = selectedProfileIds.includes(p.id);
                        return (
                          <button 
                           key={p.id}
                           onClick={() => {
                             setSelectedProfileIds(prev => 
                               isSelected ? prev.filter(id => id !== p.id) : [...prev, p.id]
                             );
                           }}
                           className={`p-4 rounded-2xl border-2 transition-all text-left space-y-3 relative group ${isSelected ? 'bg-brand-50 border-brand-600 ring-4 ring-brand-600/10' : 'bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700'}`}
                          >
                             {isSelected && (
                               <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-brand-600 text-white rounded-lg flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in">
                                 <Check className="w-4 h-4" />
                               </div>
                             )}
                             <div className="w-full aspect-square rounded-xl overflow-hidden shadow-sm">
                                <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black uppercase text-brand-600 tracking-widest">#{p.id}</p>
                                <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{p.title}</p>
                             </div>
                          </button>
                        );
                      })}
                  </div>

                   <button 
                    disabled={selectedProfileIds.length === 0}
                    onClick={() => {
                        const assignments = selectedProfileIds.map((pid, idx) => {
                          const name = idx === 0 && studentName ? studentName : `Student - ${profiles.find(p => p.id === pid)?.title}`;
                          return { name, profileId: pid };
                        });
                        batchAssignStudents(assignments);
                        // Also set the first one as active for this device setup session
                        if (selectedProfileIds.length === 1) {
                          localStorage.setItem('selected_profile_id', selectedProfileIds[0]);
                          localStorage.setItem('student_name', studentName);
                        }
                        setStep(2);
                    }}
                    className="w-full py-6 bg-brand-600 text-white rounded-[2rem] text-xl font-black shadow-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                     Confirm {selectedProfileIds.length} Assignment{selectedProfileIds.length !== 1 ? 's' : ''} & Next
                  </button>
               </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
               <div className="text-center space-y-2">
                  <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic">STEP 2: STARTING FINANCIALS</h1>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Set the starting bank context for {studentName}.</p>
               </div>

               <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-10">
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Bank Institution</label>
                        <div className="grid grid-cols-2 gap-3">
                           {['Royal Bank', 'TD Canada Trust', 'Scotiabank', 'CIBC', 'BMO', 'PC Financial'].map(b => (
                             <button 
                                key={b}
                                onClick={() => setSelectedBank(b)}
                                className={`px-4 py-4 rounded-xl border-2 transition-all text-xs font-black uppercase tracking-tight ${selectedBank === b ? 'bg-brand-50 border-brand-600 text-brand-600 shadow-lg shadow-brand-600/10' : 'border-slate-100 dark:border-slate-800 text-slate-600 hover:border-slate-300'}`}
                             >
                                {b}
                             </button>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Opening Balance</label>
                         <div className="relative">
                            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500 w-6 h-6" />
                            <input 
                               type="number"
                               value={startingBalance}
                               onChange={(e) => setStartingBalance(Number(e.target.value))}
                               className="w-full pl-14 pr-8 py-5 bg-slate-50 dark:bg-slate-800 rounded-2xl text-2xl font-black outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                         </div>
                        <p className="text-[10px] font-bold text-slate-400 italic">Default set based on Profile #{selectedProfileIds[0] || 'N/A'} research.</p>
                     </div>
                  </div>

                  <div className="flex gap-4">
                     <button onClick={() => setStep(1)} className="flex-1 py-6 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] font-black uppercase tracking-widest text-slate-400">Back</button>
                     <button onClick={() => setStep(3)} className="flex-[2] py-6 bg-brand-600 text-white rounded-[2rem] text-xl font-black shadow-2xl">Continue to Pay Stub</button>
                  </div>
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
               <div className="text-center space-y-2">
                  <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic">STEP 3: PAY STUB GENERATION</h1>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Calculate gross and net income with tax deductions.</p>
               </div>

               <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Annual Gross Salary</label>
                        <input 
                           type="number"
                           defaultValue={profiles.find(p => p.id === (selectedProfileIds[0] || ''))?.budget.income_player_1 ? (profiles.find(p => p.id === (selectedProfileIds[0] || ''))!.budget.income_player_1 * 26) : 0}
                           className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 rounded-3xl text-3xl font-black outline-none focus:ring-2 focus:ring-brand-600"
                        />
                      </div>
                     <div className="p-8 bg-brand-50 dark:bg-brand-900/10 rounded-[2rem] border border-brand-100 dark:border-brand-800 space-y-4">
                        <div className="flex items-center gap-3">
                           <ExternalLink className="w-5 h-5 text-brand-600" />
                           <h4 className="text-sm font-black uppercase tracking-widest text-brand-700">Wintax Calculator</h4>
                        </div>
                        <p className="text-xs font-medium text-brand-600/80 leading-relaxed">Use the external HRClub calculator to find exact CPP, EI, and Tax Deduction amounts for your province.</p>
                        <a 
                           href="https://www.hrclub.ca/wintaxcalculator/"
                           target="_blank"
                           className="inline-block px-6 py-3 bg-white text-brand-600 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:scale-105 transition-all"
                        >
                           Open Calculator
                        </a>
                     </div>
                  </div>

                  <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-8">
                     <h3 className="text-xl font-black italic uppercase tracking-widest border-b border-white/10 pb-4">Estimated Deductions</h3>
                     <div className="space-y-4">
                        {(() => {
                           const profile = profiles.find(p => p.id === (selectedProfileIds[0] || ''));
                           const biweekly = profile?.budget.income_player_1 || 0;
                           const monthlyGross = biweekly * 2.16; // Average monthly
                           const netMonthly = monthlyGross * 0.75;
                           const totalTax = monthlyGross - netMonthly;

                           return (
                             <>
                               {[
                                  { label: "Gross Monthly", value: `$${Math.round(monthlyGross).toLocaleString()}`, color: "text-white" },
                                  { label: "Estimated Deductions", value: `-$${Math.round(totalTax).toLocaleString()}`, color: "text-red-400" },
                                  { label: "CPP/EI/Tax (75% Net)", value: "Calculated Rate", color: "text-red-400 opacity-60" },
                               ].map(row => (
                                  <div key={row.label} className="flex justify-between items-center text-sm font-bold">
                                     <span className="opacity-60">{row.label}</span>
                                     <span className={row.color}>{row.value}</span>
                                  </div>
                               ))}
                               <div className="pt-6 border-t border-white/20 flex justify-between items-center">
                                  <span className="text-lg font-black uppercase tracking-widest text-brand-500">NET TAKE HOME</span>
                                  <span className="text-3xl font-black text-emerald-400 leading-none">${Math.round(netMonthly).toLocaleString()}</span>
                                </div>
                             </>
                           );
                        })()}
                     </div>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="flex-1 py-6 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] font-black uppercase tracking-widest text-slate-400">Back</button>
                  <button onClick={() => setStep(4)} className="flex-[2] py-6 bg-brand-600 text-white rounded-[2rem] text-xl font-black shadow-2xl">Finalize Materials</button>
               </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12"
            >
               <div className="text-center space-y-2">
                  <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic">FINALIZE & DEPLOY</h1>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Generate physical student materials for the classroom.</p>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                     <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                           <Check className="w-10 h-10" />
                        </div>
                        <div className="space-y-1">
                           <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">Ready for Class</h3>
                           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">{studentName || 'Students'} vs {selectedProfileIds.length} Path{selectedProfileIds.length !== 1 ? 's' : ''}</p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assignment Metadata</p>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-3">
                           <div className="flex justify-between text-sm font-bold">
                              <span className="opacity-50">Class Session</span>
                              <span className="text-slate-900 dark:text-white">LG-2026</span>
                           </div>
                           <div className="flex justify-between text-sm font-bold">
                              <span className="opacity-50">Career Path</span>
                              <span className="text-brand-600">{profiles.find(p => p.id === selectedProfileIds[0])?.job_title} {selectedProfileIds.length > 1 ? `+ ${selectedProfileIds.length - 1} others` : ''}</span>
                           </div>
                           <div className="flex justify-between text-sm font-bold">
                              <span className="opacity-50">Starting Capital</span>
                              <span className="text-emerald-500">${startingBalance.toLocaleString()}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     {[
                        { title: "Download ID Card", icon: CreditCard, color: "bg-indigo-600" },
                        { title: "Print Financial Book", icon: BookOpen, color: "bg-slate-950" },
                        { title: "Intro Course Pack", icon: Download, color: "bg-brand-600" }
                     ].map(doc => (
                        <button key={doc.title} className="w-full bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-brand-600 transition-all">
                           <div className="flex items-center gap-6">
                              <div className={`w-12 h-12 ${doc.color} rounded-xl flex items-center justify-center text-white`}>
                                 <doc.icon className="w-5 h-5" />
                              </div>
                              <span className="text-lg font-black text-slate-900 dark:text-white">{doc.title}</span>
                           </div>
                           <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-600 transition-all" />
                        </button>
                     ))}
                  </div>
               </div>

               <div className="flex justify-center pt-8">
                  <button 
                    onClick={() => {
                      if (selectedProfileIds.length === 1) {
                        localStorage.setItem('selected_profile_id', selectedProfileIds[0]);
                      }
                      router.push('/student/dashboard');
                    }}
                    className="px-16 py-6 bg-slate-950 text-white rounded-[2rem] text-xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all text-center"
                  >
                     Complete Setup & Open Student Dashboard
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
