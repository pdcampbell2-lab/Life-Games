"use client";

import React, { Suspense, useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Users, 
  Settings, 
  BookOpen, 
  Lock, 
  Unlock, 
  Pause, 
  Play, 
  Download, 
  Printer,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  FileText,
  CreditCard,
  Target,
  Eye,
  X,
  Save,
  Check,
  Layout,
  Monitor,
  Trash2,
  AlertTriangle,
  Globe,
  HelpCircle,
  PieChart,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeacher } from '@/hooks/useTeacher';

// Dynamic challenge imports for preview
import ResearchChallenge from '@/components/challenges/ResearchChallenge';
import CellPhoneChallenge from '@/components/challenges/CellPhoneChallenge';
import HousingChallenge from '@/components/challenges/HousingChallenge';
import UtilityCostsChallenge from '@/components/challenges/UtilityCostsChallenge';
import VehicleChallenge from '@/components/challenges/VehicleChallenge';
import InsuranceChallenge from '@/components/challenges/InsuranceChallenge';
import DrivingCostChallenge from '@/components/challenges/DrivingCostChallenge';
import CreditCardChallenge from '@/components/challenges/CreditCardChallenge';
import GroceryChallenge from '@/components/challenges/GroceryChallenge';
import ChildcareChallenge from '@/components/challenges/ChildcareChallenge';
import DateNightChallenge from '@/components/challenges/DateNightChallenge';

const RESOURCES = {
  literacy: [
    { title: "Get Smarter About Money", url: "https://www.getsmarteraboutmoney.ca/" },
    { title: "Canada Revenue Agency", url: "https://www.canada.ca/en/revenue-agency/services/tax/" }
  ],
  government: [
    { title: "CPP Deductions", url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/cpp" },
    { title: "EI Contributions", url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/employment-insurance-ei" }
  ],
  housing: [
    { title: "CMHC Housing", url: "https://www.cmhc-schl.gc.ca/" },
    { title: "Realtor.ca", url: "https://www.realtor.ca/" },
    { title: "Zolo", url: "https://www.zolo.ca/" }
  ],
  transport: [
    { title: "Lease vs Buy", url: "https://loanscanada.ca/auto/leasing-a-car-vs-buying-a-car/" },
    { title: "AutoTrader", url: "http://www.autotrader.ca/" },
    { title: "Mr. Lube", url: "https://www.mrlube.com/" }
  ],
  lifestyle: [
    { title: "Flipp (Groceries)", url: "https://flipp.com/home" },
    { title: "NerdWallet (Credit)", url: "https://www.nerdwallet.com/" },
    { title: "Rocket Academy Rates", url: "http://www.rocketacademyelc.ca/rates" }
  ]
};

const CHALLENGE_NAMES: Record<string, string> = {
  challenge_1: "Market Research",
  challenge_2: "Cell Phone Plan",
  challenge_3: "Housing Market",
  challenge_4: "Utility Costs",
  challenge_5: "Vehicle Selection",
  challenge_6: "Insurance Coverage",
  challenge_7: "Driving Costs",
  challenge_8: "Credit Card Terms",
  challenge_9: "Grocery Planning",
  challenge_10: "Childcare Setup",
  challenge_11: "Date Night Social"
};

export default function TeacherDashboard() {
  const { state, profiles, unlockNextChallenge, togglePause, updateStudentChallengeData, updateBlueprint, removeStudent, teachingTips, isHydrated } = useTeacher();
  const [activeTab, setActiveTab] = React.useState<'players' | 'challenges' | 'resources'>('players');
  const [inspectingStudent, setInspectingStudent] = React.useState<string | null>(null);
  const [editingChallenge, setEditingChallenge] = React.useState<string | null>(null);
  const [activePreview, setActivePreview] = React.useState<{id: string, name: string} | null>(null);
  const [isPreviewEditing, setIsPreviewEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState<string>("");

  const [localBlueprint, setLocalBlueprint] = useState({
    instructions: '',
    min: 0,
    max: 0
  });

  useEffect(() => {
    if (activePreview && state.blueprints?.[activePreview.id]) {
        const bp = state.blueprints[activePreview.id];
        setLocalBlueprint({
            instructions: bp.instructions || '',
            min: bp.min_threshold || 0,
            max: bp.max_threshold || 0
        });
    } else {
        setLocalBlueprint({ instructions: '', min: 0, max: 0 });
    }
  }, [activePreview, state.blueprints, isHydrated]);

  // Global Escape Listener
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePreview(null);
        setInspectingStudent(null);
        setIsPreviewEditing(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (!isHydrated) return null;

  const currentTip = teachingTips[`challenge_${state.unlocked_challenge_index}` as keyof typeof teachingTips];
  const studentData = inspectingStudent ? state.assignments[inspectingStudent] : null;

  const handleRemoveStudent = (name: string) => {
    if (window.confirm(`Permanently evict ${name} from the classroom session? This cannot be undone.`)) {
        removeStudent(name);
        setInspectingStudent(null);
    }
  };

  const exportRegistry = () => {
    const data = localStorage.getItem('life_games_teacher_state');
    if (!data) return alert("No registry data found to export.");
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life_games_registry_${state.class_code}.json`;
    a.click();
  };

  const importRegistry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result as string;
        JSON.parse(data); // Validate JSON
        localStorage.setItem('life_games_teacher_state', data);
        window.location.reload(); // Refresh to hydrate new state
      } catch (err) {
        alert("Invalid registry file format.");
      }
    };
    reader.readAsText(file);
  };

  const renderChallengePreview = (id: string) => {
    const commonProps = {
      onComplete: (data: any) => alert("Preview Mode: This is a safe sandbox. No data was saved."),
      monthlyIncome: 5000,
      currentLeftover: 2000,
      blueprint: state.blueprints?.[id]
    };

    switch (id) {
      case 'challenge_1': return <ResearchChallenge {...commonProps} />;
      case 'challenge_2': return <CellPhoneChallenge {...commonProps} />;
      case 'challenge_3': return <HousingChallenge {...commonProps} hasPartner={false} />;
      case 'challenge_4': return <UtilityCostsChallenge {...commonProps} homeValue={450000} />;
      case 'challenge_5': return <VehicleChallenge {...commonProps} />;
      case 'challenge_6': return <InsuranceCoverageChallenge id={id} />;
      case 'challenge_7': return <DrivingCostChallenge {...commonProps} vehicleMeta={{ year: 2022, description: 'Honda Civic', engine: 'gas' }} />;
      case 'challenge_8': return <CreditCardChallenge {...commonProps} />;
      case 'challenge_9': return <GroceryChallenge {...commonProps} householdSize={2} />;
      case 'challenge_10': return <ChildcareChallenge {...commonProps} children={[{ name: 'Ava', age: 3 }]} />;
      case 'challenge_11': return <DateNightChallenge {...commonProps} isSingle={true} />;
      default: return <div>No Preview</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
        {/* TOP STATUS BAR */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 flex items-center gap-6">
              <div className="w-14 h-14 bg-brand-600/10 text-brand-600 rounded-2xl flex items-center justify-center">
                 <Users className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Roster</p>
                 <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{Object.keys(state.assignments).length} Students</p>
              </div>
           </div>
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 flex items-center gap-6">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                 <Zap className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</p>
                 <p className={`text-xl font-black uppercase tracking-tight leading-none ${state.is_game_paused ? 'text-rose-500' : 'text-emerald-500 animate-pulse'}`}>
                    {state.is_game_paused ? 'Session Paused' : 'Live Sync'}
                 </p>
              </div>
           </div>
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 flex flex-col gap-4">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portability Engine</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white leading-none">Registry Tools</p>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={exportRegistry} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                    <Download className="w-4 h-4" /> Export
                 </button>
                 <label className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 hover:text-white transition-all shadow-sm cursor-pointer border border-transparent">
                    <ExternalLink className="w-4 h-4" /> Import
                    <input type="file" className="hidden" accept=".json" onChange={importRegistry} />
                 </label>
              </div>
           </div>
           <button 
             onClick={togglePause}
             className={`p-8 rounded-[2.5rem] border-2 transition-all flex items-center justify-center gap-4 font-black uppercase tracking-widest text-sm shadow-xl ${state.is_game_paused ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20' : 'bg-rose-500 border-rose-400 text-white shadow-rose-500/20'}`}
           >
              {state.is_game_paused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}
              {state.is_game_paused ? 'Resume' : 'Pause Session'}
           </button>
        </section>

        {/* HEADER & TABS */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20">
           <div className="space-y-1">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Admin Command Center</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] pl-1 font-mono">Registry Token: {state.class_code}</p>
           </div>

           <div className="flex gap-3 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl">
              {[
                { id: 'players', label: 'Roster', icon: Users },
                { id: 'challenges', label: 'Challenges', icon: Layout },
                { id: 'resources', label: 'Hub', icon: Globe },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                   <tab.icon className="w-4 h-4" />
                   {tab.label}
                </button>
              ))}
           </div>
        </section>

        <AnimatePresence mode="wait">
          {activeTab === 'players' && (
            <motion.section 
              key="players"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto"
            >
               <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                     <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <th className="px-10 py-6">Student Name</th>
                        <th className="px-10 py-6">Career Persona</th>
                        <th className="px-10 py-6">Progress</th>
                        <th className="px-10 py-6">Cash Flow</th>
                        <th className="px-10 py-6 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                     {Object.values(state.assignments).map((s) => (
                        <tr key={s.student_name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                           <td className="px-10 py-8 font-black text-slate-900 dark:text-white capitalize">{s.student_name}</td>
                           <td className="px-10 py-8 font-bold text-slate-500">{profiles.find(p => p.id === s.profile_id)?.job_title}</td>
                           <td className="px-10 py-8">
                              <div className="flex items-center gap-4">
                                 <div className="w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-brand-600 shadow-[0_0_15px_rgba(56,189,248,0.5)]" style={{ width: `${(s.progress.completed_challenges.length / 11) * 100}%` }} />
                                 </div>
                                 <span className="text-[10px] font-black text-brand-600 italic">{(s.progress.completed_challenges.length / 11 * 100).toFixed(0)}%</span>
                              </div>
                           </td>
                           <td className="px-10 py-8 font-black text-emerald-500">${s.progress.current_balance.toLocaleString()}</td>
                           <td className="px-10 py-8 text-right">
                              <button 
                                onClick={() => setInspectingStudent(s.student_name)}
                                className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 ml-auto shadow-sm"
                              >
                                 <Target className="w-4 h-4" /> Inspect Registry
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </motion.section>
          )}

          {activeTab === 'challenges' && (
            <motion.section 
              key="challenges"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid lg:grid-cols-2 gap-8"
            >
               <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-200 dark:border-slate-800 shadow-sm space-y-12">
                  <div className="space-y-4">
                     <span className="px-4 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 rounded-full font-black text-[10px] uppercase tracking-widest">Simulation workflow</span>
                     <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">CHALLENGE RELEASE</h3>
                  </div>

                  <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                     {[1,2,3,4,5,6,7,8,9,10,11].map((idx) => {
                        const cid = `challenge_${idx}`;
                        const isUnlocked = state.unlocked_challenge_index >= idx;
                        const name = CHALLENGE_NAMES[cid];
                        
                        return (
                         <button 
                           key={idx}
                           onClick={() => setActivePreview({ id: cid, name })}
                           className={`w-full p-6 rounded-[2.5rem] border-2 transition-all flex items-center justify-between group hover:border-brand-600 ${isUnlocked ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800' : 'bg-slate-50 dark:bg-slate-900 border-transparent border-dashed opacity-60'}`}
                         >
                            <div className="flex items-center gap-6">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${isUnlocked ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-200 text-slate-400 group-hover:bg-brand-600 group-hover:text-white'}`}>{idx}</div>
                               <div className="text-left">
                                  <p className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none uppercase italic">{name}</p>
                                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-1 italic">{isUnlocked ? "Module Live" : "Gated Audit Mode"}</p>
                               </div>
                            </div>
                            <Monitor className="w-5 h-5 text-slate-300 group-hover:text-brand-600 transition-colors" />
                         </button>
                        );
                     })}
                  </div>

                  <button 
                    onClick={unlockNextChallenge}
                    className="w-full py-10 bg-brand-600 text-white rounded-[3rem] text-2xl font-black shadow-2xl shadow-brand-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6"
                  >
                     Unlock Next Challenge
                     <Unlock className="w-10 h-10" />
                  </button>
               </div>

               <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-[3.5rem] p-16 text-white space-y-12 shadow-2xl relative overflow-hidden group">
                  <PieChart className="absolute -bottom-20 -right-20 w-80 h-80 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
                  <div className="space-y-4">
                     <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center"><Target className="w-8 h-8" /></div>
                     <p className="text-xs font-black uppercase tracking-[0.5em] opacity-60 italic">Administrative Insight</p>
                  </div>
                  <div className="space-y-6 relative">
                     <p className="text-4xl font-black tracking-tighter leading-tight italic">
                        "{currentTip?.lesson || "Every financial choice in the simulation carries pedagogical weight."}"
                     </p>
                     <p className="text-[10px] font-black uppercase tracking-widest bg-white/10 w-fit px-4 py-2 rounded-lg">Focal Concept: {currentTip?.concept || "Financial Awareness"}</p>
                  </div>
               </div>
            </motion.section>
          )}

          {activeTab === 'resources' && (
            <motion.section 
              key="resources"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
               {Object.entries(RESOURCES).map(([cat, links]) => (
                  <div key={cat} className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
                     <div className="space-y-2">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl flex items-center justify-center uppercase font-black text-xl italic">{cat[0]}</div>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">{cat} Portal</h4>
                     </div>
                     <div className="grid gap-3">
                        {links.map((l, i) => (
                           <a key={i} href={l.url} target="_blank" className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-brand-50 transition-all border border-transparent hover:border-brand-600/20 group">
                              <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{l.title}</span>
                              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
                           </a>
                        ))}
                     </div>
                  </div>
               ))}
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* STUDENT INSPECTION MODAL */}
      <AnimatePresence>
        {inspectingStudent && studentData && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-slate-950/80 backdrop-blur-3xl flex items-center justify-center p-6"
          >
             {/* FLOATING MASTER CLOSE */}
             <button onClick={() => setInspectingStudent(null)} className="fixed top-8 right-8 z-[200] p-5 bg-slate-950 text-white rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all bordr border-white/20">
                <X className="w-10 h-10" />
             </button>

             <motion.div 
               initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
               className="w-full max-w-6xl h-[90vh] bg-white dark:bg-slate-900 rounded-[5rem] overflow-hidden shadow-2xl flex flex-col border border-white/5 relative"
             >
                <div className="p-12 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                   <div className="flex items-center gap-10">
                      <div className="w-24 h-24 bg-brand-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-brand-600/30 font-black text-4xl italic">S</div>
                      <div className="space-y-1">
                         <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">{inspectingStudent}</h2>
                         <div className="flex items-center gap-4">
                            <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-lg shadow-lg">Registry Audit Active</span>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{profiles.find(p => p.id === studentData.profile_id)?.job_title} Template</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-16 space-y-16 custom-scrollbar">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[
                        { label: 'Current Liquidity', value: `$${studentData.progress.current_balance.toLocaleString()}`, color: 'text-emerald-500' },
                        { label: 'Indebtedness', value: `$${studentData.progress.debt_level.toLocaleString()}`, color: 'text-rose-500' },
                        { label: 'Simulation Stage', value: `${studentData.progress.completed_challenges.length}/11`, color: 'text-brand-600' }
                      ].map((m, i) => (
                        <div key={i} className="p-10 bg-slate-50 dark:bg-slate-800/30 rounded-[3rem] border border-slate-100 dark:border-white/5 space-y-2">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                           <p className={`text-4xl font-black ${m.color} tracking-tighter italic`}>{m.value}</p>
                        </div>
                      ))}
                   </div>

                   <div className="space-y-10">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-8">
                         <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Institutional Research Log</h3>
                         <div className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Audit Registry v1.2</div>
                      </div>

                      <div className="grid gap-8">
                         {[1,2,3,4,5,6,7,8,9,10,11].map(idx => {
                            const cid = `challenge_${idx}`;
                            const isComplete = studentData.progress.completed_challenges.includes(cid);
                            const res = studentData.progress.results?.[cid];
                            return (
                               <div key={cid} className={`p-10 rounded-[3.5rem] border-2 transition-all ${isComplete ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 shadow-2xl' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-white/5 opacity-80'}`}>
                                  <div className="flex items-center justify-between mb-8">
                                     <div className="flex items-center gap-8">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl ${isComplete ? 'bg-brand-600 text-white shadow-brand-600/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>{idx}</div>
                                        <div className="space-y-1">
                                           <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic leading-none">{CHALLENGE_NAMES[cid] || `Module #${idx}`}</h4>
                                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isComplete ? "Research Verified & Sequenced" : "Simulation Gated / Awaiting Data"}</p>
                                        </div>
                                     </div>
                                     <div className="flex items-center gap-4">
                                        <button onClick={() => setActivePreview({ id: cid, name: CHALLENGE_NAMES[cid] })} className="px-8 py-3.5 bg-slate-100 dark:bg-slate-700/50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-600 transition-all border-2 border-transparent hover:border-brand-600/30">Sandbox Audit</button>
                                        {isComplete && <button className="px-8 py-3.5 bg-brand-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl">Override</button>}
                                     </div>
                                  </div>
                                  {isComplete && res && (
                                     <div className="grid md:grid-cols-2 gap-12 pt-8 border-t-2 border-dashed border-slate-100 dark:border-slate-700">
                                        <div className="space-y-4">
                                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block pl-1 italic">Simulation Telemetry</span>
                                           <pre className="p-8 bg-black/5 dark:bg-black/40 rounded-3xl text-[12px] font-mono text-slate-600 dark:text-slate-400 overflow-x-auto border border-white/5">{JSON.stringify(res, null, 2)}</pre>
                                        </div>
                                        <div className="space-y-6 p-8 bg-brand-50 dark:bg-brand-900/10 rounded-[3rem] border border-brand-100/50">
                                           <div className="flex items-center gap-3 text-brand-600"><AlertCircle className="w-5 h-5" /><p className="text-[10px] font-black uppercase tracking-widest">Pedagogical Review</p></div>
                                           <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">Submitted research logs character-correctly reflect actual Canadian market data. Override only in case of profile calibration sync errors.</p>
                                        </div>
                                     </div>
                                  )}
                               </div>
                            );
                         })}
                      </div>
                   </div>

                   {/* DANGER ZONE */}
                   <div className="pt-20 border-t-4 border-dashed border-rose-100 dark:border-rose-900/30 space-y-10 pb-10">
                      <div className="flex items-center gap-4 text-rose-500"><AlertTriangle className="w-10 h-10" /><h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Administrative Danger Zone</h3></div>
                      <div className="p-12 bg-rose-50 dark:bg-rose-950/20 border-4 border-rose-100 dark:border-rose-900/50 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">
                         <div className="space-y-3 text-center md:text-left">
                            <h4 className="text-2xl font-black text-rose-600 uppercase italic leading-none">Terminate Registration</h4>
                            <p className="text-sm font-medium text-rose-500/80 max-w-2xl leading-relaxed">Permanently character-characterly purge <strong>{inspectingStudent}</strong> from the registry. All simulation milestones, research snapshots, and financial histories will be character-characterly wiped from disk.</p>
                         </div>
                         <button 
                            onClick={() => handleRemoveStudent(inspectingStudent)} 
                            className="px-12 py-7 bg-[#e11d48] text-white rounded-[2.5rem] font-black uppercase tracking-widest text-lg shadow-[0_20px_50px_rgba(225,29,72,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-6"
                         >
                            <Trash2 className="w-8 h-8 text-white" /> 
                            <span className="text-white">Evict from Registry</span>
                         </button>
                      </div>
                   </div>
                </div>

                <div className="p-10 bg-brand-600 text-white flex items-center justify-between px-20 relative z-[151]">
                   <p className="text-[10px] font-black uppercase tracking-widest italic opacity-80">Security Protocol Alpha-9 Active • Biometric Audit Integrity: 100%</p>
                   <button onClick={() => setInspectingStudent(null)} className="bg-white text-brand-600 px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl">Return to Fleet (ESC)</button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREVIEW SANDBOX MODAL */}
      <AnimatePresence>
        {activePreview && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160] bg-slate-950/90 backdrop-blur-3xl flex items-center justify-center p-6"
          >
             {/* FLOATING MASTER CLOSE */}
             <button onClick={() => { setActivePreview(null); setIsPreviewEditing(false); }} className="fixed top-8 right-8 z-[210] p-5 bg-slate-950 text-white rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all border border-white/20">
                <X className="w-10 h-10" />
             </button>

             <motion.div 
               initial={{ scale: 0.95, y: 40 }} animate={{ scale: 1, y: 0 }}
               className="w-[98%] h-[90vh] bg-white dark:bg-slate-900 rounded-[5rem] overflow-hidden flex flex-col shadow-2xl border border-white/5 relative"
             >
                <div className="p-12 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                   <div className="flex items-center gap-8">
                      <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-2xl"><Monitor className="w-8 h-8" /></div>
                      <div>
                         <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">{activePreview.name}</h3>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 italic opacity-60">Curriculum Sandbox Environment</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <button onClick={() => setIsPreviewEditing(!isPreviewEditing)} className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all ${isPreviewEditing ? 'bg-amber-500 text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-600'}`}>
                         <Settings className="w-4 h-4 inline mr-2" /> {isPreviewEditing ? 'Close Blueprints' : 'Edit Blueprint'}
                      </button>
                      <button onClick={() => { setActivePreview(null); setIsPreviewEditing(false); }} className="px-10 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase shadow-2xl">Shut Down Sandbox</button>
                   </div>
                </div>
                
                <div className="flex-1 min-h-0 overflow-hidden flex flex-col md:flex-row bg-slate-100 dark:bg-slate-950">
                   <div className="flex-1 min-h-0 overflow-y-auto p-10 md:p-20 flex items-start justify-center custom-scrollbar relative">
                      <div className="w-full max-w-6xl bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl overflow-hidden mb-40 border border-white/5">
                         <Suspense fallback={<div className="p-60 text-center font-black animate-pulse opacity-30 text-4xl italic">Loading Registry...</div>}>
                           {renderChallengePreview(activePreview.id)}
                         </Suspense>
                      </div>
                   </div>

                   <AnimatePresence>
                      {isPreviewEditing && (
                        <motion.div initial={{ x: 600 }} animate={{ x: 0 }} exit={{ x: 600 }} className="w-full md:w-[500px] border-l-4 border-brand-600/30 bg-white dark:bg-slate-900 p-12 flex flex-col gap-12 shadow-2xl z-[175] min-h-0">
                           <div className="space-y-3">
                              <div className="flex items-center gap-4 text-emerald-500"><Settings className="w-8 h-8" /><h4 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Blueprint Tools</h4></div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Modify Curriculum Logic In Real-Time</p>
                           </div>
                           <div className="space-y-12 flex-1 min-h-0 overflow-y-auto pr-4 custom-scrollbar">
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block italic underline decoration-brand-600/40">Pedagogical Instructions</label>
                                 <textarea value={localBlueprint.instructions} onChange={(e) => setLocalBlueprint({...localBlueprint, instructions: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 text-sm font-medium outline-none focus:border-brand-600 min-h-[220px] leading-relaxed shadow-inner" />
                              </div>
                              <div className="space-y-8 pt-12 border-t-2 border-slate-100 dark:border-slate-800">
                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic decoration-brand-600/40 underline">Validation Rules</p>
                                 <div className="grid gap-8">
                                    <div className="space-y-3"><span className="text-[10px] font-bold text-slate-400 uppercase">Input Minimum ($)</span><input type="number" value={localBlueprint.min} onChange={(e) => setLocalBlueprint({...localBlueprint, min: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 p-6 rounded-2xl text-lg font-black outline-none focus:border-brand-600" /></div>
                                    <div className="space-y-3"><span className="text-[10px] font-bold text-slate-400 uppercase">Simulation Ceiling ($)</span><input type="number" value={localBlueprint.max} onChange={(e) => setLocalBlueprint({...localBlueprint, max: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 p-6 rounded-2xl text-lg font-black outline-none focus:border-brand-600" /></div>
                                 </div>
                              </div>
                           </div>
                           <button onClick={() => { updateBlueprint(activePreview.id, { instructions: localBlueprint.instructions, min_threshold: localBlueprint.min, max_threshold: localBlueprint.max }); setIsPreviewEditing(false); }} className="w-full py-8 bg-brand-600 text-white rounded-[3rem] font-black uppercase tracking-widest text-xl shadow-2xl shadow-brand-600/30 hover:scale-105 transition-all flex items-center justify-center gap-4"><Save className="w-6 h-6" /> Deploy to Simulated Fleet</button>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
                <div className="p-8 bg-brand-600 text-white flex items-center justify-between px-20">
                   <div className="flex items-center gap-6"><Zap className="w-8 h-8 animate-pulse" /><p className="text-sm font-black uppercase tracking-widest italic">Simulation Status: Overrides Active • Fleet Telemetry Ready</p></div>
                   <button onClick={() => { setActivePreview(null); setIsPreviewEditing(false); }} className="bg-white text-brand-600 px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl">Exit Sandbox (ESC)</button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InsuranceCoverageChallenge({ id }: { id: string }) {
  return <InsuranceChallenge onComplete={() => {}} monthlyIncome={5000} vehicleDescription="Honda Civic" />;
}
