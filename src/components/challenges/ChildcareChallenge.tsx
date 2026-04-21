"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Baby, 
  Users, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  TrendingDown,
  Info,
  Calendar,
  Building2,
  AlertTriangle,
  HeartHandshake
} from 'lucide-react';

interface ChildcareOption {
  id: string;
  providerName: string;
  pricePerWeek: string;
  services: string;
  daysPerWeek: string;
  hoursPerDay: string;
  careType: 'public' | 'private';
}

interface ChildcareChallengeProps {
  onComplete: (data: any, score: number) => void;
  monthlyIncome: number;
  children: { name: string; age: number }[];
}

export default function ChildcareChallenge({ onComplete, monthlyIncome, children }: ChildcareChallengeProps) {
  const childrenCount = children.length;
  // Determine if daycare, school-age, or mixed is needed
  const careNeeds = useMemo(() => {
    const infants = children.filter(c => c.age < 4).length;
    const schoolAge = children.filter(c => c.age >= 4 && c.age <= 12).length;
    return { infants, schoolAge, total: children.length };
  }, [children]);

  const primaryCareLabel = careNeeds.infants > 0 ? 'Full-Time Daycare' : 'Before/After School Care';
  const [options, setOptions] = useState<ChildcareOption[]>([
    { id: '1', providerName: '', pricePerWeek: '', services: '', daysPerWeek: '5', hoursPerDay: '8', careType: 'public' },
    { id: '2', providerName: '', pricePerWeek: '', services: '', daysPerWeek: '5', hoursPerDay: '8', careType: 'private' },
    { id: '3', providerName: '', pricePerWeek: '', services: '', daysPerWeek: '5', hoursPerDay: '8', careType: 'private' }
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleChange = (id: string, field: keyof ChildcareOption, value: any) => {
    setOptions(options.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const validate = () => {
    for (const opt of options) {
      if (!opt.providerName) return { valid: false, msg: "Please enter provider names for all options." };
      const price = parseFloat(opt.pricePerWeek);
      const days = parseInt(opt.daysPerWeek);
      const hours = parseInt(opt.hoursPerDay);
      
      if (isNaN(price) || price < 100 || price > 800) return { valid: false, msg: `Weekly cost for ${opt.providerName} must be $100-$800.` };
      if (isNaN(days) || days < 1 || days > 7) return { valid: false, msg: `Days per week for ${opt.providerName} must be 1-7.` };
      if (isNaN(hours) || hours < 1 || hours > 12) return { valid: false, msg: `Hours per day for ${opt.providerName} must be 1-12.` };
    }
    if (!selectedId) return { valid: false, msg: "Please select your final childcare provider." };
    return { valid: true };
  };

  const selectedOption = useMemo(() => options.find(o => o.id === selectedId), [options, selectedId]);
  
  const monthlyCostPerChild = useMemo(() => {
    if (!selectedOption) return 0;
    return parseFloat(selectedOption.pricePerWeek) * 4;
  }, [selectedOption]);

  const totalMonthlyCost = monthlyCostPerChild * childrenCount;

  const careReport = useMemo(() => {
    if (!selectedOption) return { label: 'Waiting', color: 'text-slate-400', msg: 'Select an option to evaluate quality.' };
    const p = parseFloat(selectedOption.pricePerWeek);
    const type = selectedOption.careType;
    
    if (p < 250 && type === 'private') return { label: 'High Risk', color: 'text-rose-500', msg: 'Low cost private care may have limited oversight and higher closure risk.' };
    if (p > 500) return { label: 'Premium Care', color: 'text-emerald-500', msg: 'High trust and extensive services. Expensive but reliable for your career.' };
    if (type === 'public') return { label: 'Subsidized/Stable', color: 'text-brand-500', msg: 'Government regulated or non-profit care. Reliable and balanced.' };
    return { label: 'Standard', color: 'text-slate-500', msg: 'Middle-of-the-road choice for childcare.' };
  }, [selectedOption]);

  const calculateScore = (selected: ChildcareOption) => {
    let score = 60;
    const p = parseFloat(selected.pricePerWeek);
    const type = selected.careType;

    if (type === 'public' && p < 300) score += 20; // Good value
    if (p > 600) score -= 10; // Luxury penalty
    if (selected.hoursPerDay === '10') score += 10; // Career flexibility bonus

    return Math.min(100, score);
  };

  const handleSubmit = () => {
    if (childrenCount === 0) {
      onComplete({ childcare: 0, meta: { noChildren: true } }, 100);
      return;
    }

    const v = validate();
    if (!v.valid) {
      alert(v.msg);
      return;
    }

    setIsSubmitting(true);
    const score = calculateScore(selectedOption!);
    setFinalScore(score);

    setTimeout(() => {
       setIsConfirmed(true);
       setIsSubmitting(false);
    }, 1500);
  };

  const handleFinalize = () => {
    const isReliable = selectedOption!.careType === 'public' || parseFloat(selectedOption!.pricePerWeek) > 400;
    
    const data = {
      childcare: totalMonthlyCost,
      meta: {
        childcareProvider: selectedOption!.providerName,
        careType: selectedOption!.careType,
        careReliabilityScore: isReliable ? 95 : 60,
        careTrustScore: isReliable ? 90 : 50,
        workAbsenceRisk: isReliable ? 5 : 40,
        careQualityRating: careReport.label,
        careStressDelta: isReliable ? -10 : 25,
        weeklyCareCost: parseFloat(selectedOption!.pricePerWeek)
      }
    };
    onComplete(data, finalScore);
  };

  if (childrenCount === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-[3rem] p-12 text-center space-y-8 shadow-2xl"
      >
        <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-3xl flex items-center justify-center text-brand-600 mx-auto">
           <Baby className="w-10 h-10" />
        </div>
        <div className="space-y-4">
           <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">No Household Children</h2>
           <p className="text-slate-500 font-medium">
             You are currently in an individual or couple household with no children. You can skip the childcare lab and focus on your career growth.
           </p>
        </div>
        <button onClick={() => onComplete({ childcare: 0, meta: { skippedChildcare: true } }, 100)} className="w-full btn-primary py-6 text-xl font-black rounded-2xl">
           Proceed to Goal Phase
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-6xl w-full bg-white dark:bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5"
    >
      <div className="flex flex-col lg:flex-row h-[90vh] lg:h-[850px]">
        {/* Sidebar */}
        <div className="lg:w-[400px] bg-indigo-950 p-12 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="relative space-y-12">
              <div className="space-y-4">
                 <div className="w-16 h-16 bg-brand-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-brand-600/20">
                    <Baby className="w-8 h-8" />
                 </div>
                 <h3 className="text-3xl font-black uppercase tracking-tight italic">Care Underwriting</h3>
                 <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Challenge #10 (Family)</p>
              </div>

              <div className="space-y-8">
                 <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-6">
                    <div>
                       <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Total Monthly Burden</p>
                       <p className="text-5xl font-black text-white italic tracking-tighter">${totalMonthlyCost.toLocaleString()}</p>
                       <p className="text-[10px] font-bold text-indigo-400 mt-2 uppercase">For {childrenCount} Children</p>
                    </div>
                    
                    <div className="pt-6 border-t border-white/5 space-y-4">
                       <div className="flex justify-between items-center text-[10px] font-black text-indigo-300 uppercase">
                          <span>Risk Assessment</span>
                          <span className={`${careReport.color}`}>{careReport.label}</span>
                       </div>
                       <p className="text-[11px] font-medium text-indigo-200/60 leading-relaxed italic">
                          "{careReport.msg}"
                       </p>
                    </div>
                 </div>

                 {totalMonthlyCost > (monthlyIncome * 0.25) && (
                   <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-4">
                      <AlertTriangle className="w-5 h-5 text-rose-500 mt-0.5" />
                      <p className="text-[10px] font-bold text-rose-500 uppercase leading-relaxed">
                        Critical Overhead Warning. Childcare takes upwards of 25% of your household income.
                      </p>
                   </div>
                 )}
              </div>
           </div>

           <div className="relative pt-8 border-t border-white/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-600/30 flex items-center justify-center">
                 <HeartHandshake className="w-5 h-5 text-brand-300" />
              </div>
              <p className="text-[10px] font-black text-brand-300 uppercase tracking-widest leading-tight">
                 Reliable care is the anchor of a stable career.
              </p>
           </div>
        </div>

        {/* Main Interface */}
        <div className="flex-1 p-8 lg:p-14 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50">
           <AnimatePresence mode="wait">
              {!isConfirmed ? (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-12"
                >
                   <div className="space-y-2">
                        <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase underline decoration-indigo-500/30">The Sibling Hub</h2>
                        <p className="text-slate-500 font-medium">Research 3 potential programs and select the most reliable anchor.</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {options.map((opt, i) => (
                        <div 
                          key={opt.id}
                          className={`p-8 rounded-[2.5rem] border-2 transition-all relative ${selectedId === opt.id ? 'border-brand-600 bg-white dark:bg-slate-800 shadow-2xl' : 'border-slate-100 dark:border-white/5 bg-white/50 dark:bg-slate-800/30 grayscale opacity-70 hover:grayscale-0 hover:opacity-100'}`}
                        >
                           <div className="absolute -top-3 -left-3 w-10 h-10 rounded-2xl bg-indigo-950 text-white flex items-center justify-center text-sm font-black shadow-lg">
                              {i+1}
                           </div>

                           <div className="space-y-8">
                              <div className="space-y-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Provider Name</label>
                                    <input 
                                      placeholder="Search and enter local daycare..."
                                      value={opt.providerName}
                                      onChange={(e) => handleChange(opt.id, 'providerName', e.target.value)}
                                      className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-1 font-black text-slate-900 dark:text-white outline-none focus:border-brand-500"
                                    />
                                    <select 
                                      value={opt.careType}
                                      onChange={(e) => handleChange(opt.id, 'careType', e.target.value)}
                                      className="w-full mt-2 bg-slate-100 dark:bg-slate-900 rounded-xl p-2 text-[10px] font-black uppercase text-slate-500 border-none outline-none"
                                    >
                                       <option value="public">Public / Subsidized</option>
                                       <option value="private">Private Agency</option>
                                    </select>
                                 </div>

                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cost / Week (per child)</label>
                                    <div className="relative">
                                       <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                       <input 
                                         type="number"
                                         value={opt.pricePerWeek}
                                         onChange={(e) => handleChange(opt.id, 'pricePerWeek', e.target.value)}
                                         className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 pl-4 py-1 font-black text-brand-600 outline-none"
                                       />
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar className="w-3 h-3"/> Days</label>
                                       <input 
                                         type="number"
                                         value={opt.daysPerWeek}
                                         onChange={(e) => handleChange(opt.id, 'daysPerWeek', e.target.value)}
                                         className="w-full bg-slate-100 dark:bg-slate-950/50 rounded-xl p-3 font-black text-slate-700 dark:text-slate-300 outline-none"
                                       />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock className="w-3 h-3"/> Hours</label>
                                       <input 
                                         type="number"
                                         value={opt.hoursPerDay}
                                         onChange={(e) => handleChange(opt.id, 'hoursPerDay', e.target.value)}
                                         className="w-full bg-slate-100 dark:bg-slate-950/50 rounded-xl p-3 font-black text-slate-700 dark:text-slate-300 outline-none"
                                       />
                                    </div>
                                 </div>

                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Included Services</label>
                                    <textarea 
                                      rows={2}
                                      placeholder="e.g. Lunch provided, Preschool curriculum, Outdoor time..."
                                      value={opt.services}
                                      onChange={(e) => handleChange(opt.id, 'services', e.target.value)}
                                      className="w-full bg-slate-100 dark:bg-slate-950/50 rounded-2xl p-4 text-xs font-medium text-slate-600 dark:text-slate-400 outline-none focus:ring-1 focus:ring-indigo-500 resize-none border-none"
                                    />
                                 </div>
                              </div>

                              <button 
                                onClick={() => setSelectedId(opt.id)}
                                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedId === opt.id ? 'bg-indigo-600 text-white shadow-xl shadow-brand-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-brand-50 hover:text-brand-600'}`}
                              >
                                {selectedId === opt.id ? 'Strategy Locked' : 'Select Provider'}
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>

                   <button 
                     disabled={!selectedId || isSubmitting}
                     onClick={handleSubmit}
                     className="w-full btn-primary py-8 text-2xl font-black rounded-4xl flex items-center justify-center gap-6 group hover:shadow-2xl hover:shadow-indigo-600/30 transition-all font-serif italic"
                   >
                      {isSubmitting ? 'Confirming Enrollment...' : 'Issue Family Care Binder'}
                      <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                   </button>
                </motion.div>
              ) : (
                <motion.div 
                   key="success"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-center py-12 space-y-12"
                >
                   <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-950/30 rounded-[2.5rem] flex items-center justify-center text-indigo-600 mx-auto">
                      <ShieldCheck className="w-12 h-12" />
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic">Enrollment Verified.</h2>
                      <p className="text-xl text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                        Your monthly childcare overhead has been locked at ${totalMonthlyCost.toLocaleString()}.
                      </p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                      <div className="p-12 bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-xl space-y-2 group hover:border-brand-600/30 transition-colors">
                         <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Support Strategy Score</p>
                         <p className="text-7xl font-black text-slate-900 dark:text-white">{finalScore}<span className="text-xl text-slate-400">/100</span></p>
                      </div>
                      <div className={`p-12 rounded-[3rem] border-2 space-y-2 border-indigo-600/30 bg-white dark:bg-slate-800 shadow-xl`}>
                         <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Stability Ranking</p>
                         <p className="text-4xl font-black text-slate-900 dark:text-white mt-2 uppercase">{careReport.label}</p>
                         <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mt-1 italic">Normalized for monthly ledger</p>
                      </div>
                   </div>

                   <button 
                     onClick={handleFinalize}
                     className="w-full max-w-md btn-primary py-8 text-2xl font-black rounded-3xl"
                   >
                      Add To Family Budget
                   </button>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
