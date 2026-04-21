"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Info,
  DollarSign,
  FileText,
  AlertTriangle,
  Heart,
  Lock
} from 'lucide-react';

interface InsuranceOption {
  id: string;
  provider: string;
  premium: string;
  deductible: string;
  collision: boolean;
  injury: boolean;
  liability: boolean;
  lifeAddon: boolean;
  length: string;
  notes: string;
}

interface InsuranceChallengeProps {
  onComplete: (data: any, score: number) => void;
  monthlyIncome: number;
  vehicleDescription: string;
  currentLeftover?: number;
  blueprint?: any;
}

export default function InsuranceChallenge({ onComplete, monthlyIncome, vehicleDescription, currentLeftover, blueprint }: InsuranceChallengeProps) {
  const [options, setOptions] = useState<InsuranceOption[]>([
    { id: '1', provider: '', premium: '', deductible: '', collision: true, injury: true, liability: true, lifeAddon: false, length: '12', notes: '' },
    { id: '2', provider: '', premium: '', deductible: '', collision: false, injury: true, liability: true, lifeAddon: false, length: '12', notes: '' },
    { id: '3', provider: '', premium: '', deductible: '', collision: true, injury: true, liability: true, lifeAddon: true, length: '6', notes: '' }
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleChange = (id: string, field: keyof InsuranceOption, value: any) => {
    setOptions(options.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const validate = () => {
    for (const opt of options) {
      if (!opt.provider) return { valid: false, msg: "Please enter provider names for all options." };
      const premium = parseFloat(opt.premium);
      const deductible = parseFloat(opt.deductible);
      const length = parseInt(opt.length);
      
      if (isNaN(premium) || premium < 100 || premium > 600) return { valid: false, msg: `Premium for ${opt.provider} must be $100-$600.` };
      if (isNaN(deductible) || deductible < 250 || deductible > 5000) return { valid: false, msg: `Deductible for ${opt.provider} must be $250-$5000.` };
      if (isNaN(length) || length < 1 || length > 60) return { valid: false, msg: `Contract length for ${opt.provider} must be 1-60 months.` };
    }
    if (!selectedId) return { valid: false, msg: "Please select your final insurance policy." };
    return { valid: true };
  };

  const selectedOption = useMemo(() => options.find(o => o.id === selectedId), [options, selectedId]);
  
  const valueMetrics = useMemo(() => {
    if (!selectedOption) return { label: 'Waiting', color: 'text-slate-400', risk: 'Unknown', msg: 'Select a quote to see valuation.' };
    const p = parseFloat(selectedOption.premium) || 0;
    const d = parseFloat(selectedOption.deductible) || 0;
    const coverageCount = [selectedOption.collision, selectedOption.injury, selectedOption.liability].filter(Boolean).length;
    
    if (p < 200 && d > 1000) return { label: 'Budget Conscious', color: 'text-amber-500', risk: 'High', msg: 'Low premium but very high deductible. A small accident will cost you big out-of-pocket.' };
    if (p > 350 && coverageCount === 3) return { label: 'Maximum Protection', color: 'text-emerald-500', risk: 'Low', msg: 'Comprehensive coverage. You are well-protected from life surprises.' };
    if (coverageCount < 2) return { label: 'Critical Gaps', color: 'text-rose-500', risk: 'Severe', msg: 'You are missing essential coverage. A major claim could be devastating.' };
    return { label: 'Balanced Strategy', color: 'text-brand-500', risk: 'Medium', msg: 'Good balance of monthly cost and protection limits.' };
  }, [selectedOption]);

  const calculateScore = (selected: InsuranceOption) => {
    let score = 50;
    const p = parseFloat(selected.premium);
    const d = parseFloat(selected.deductible);
    const coverageCount = [selected.collision, selected.injury, selected.liability].filter(Boolean).length;

    if (coverageCount === 3) score += 30;
    if (d >= 500 && d <= 1000) score += 20;
    if (p > 500) score -= 20; // Overpaying penalty

    return Math.min(100, Math.max(0, score));
  };

  const handleSubmit = () => {
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
    }, 1200);
  };

  const handleFinalize = () => {
    const data = {
      insurance: parseFloat(selectedOption!.premium),
      meta: {
        insuranceProvider: selectedOption!.provider,
        deductible: parseFloat(selectedOption!.deductible),
        coverageCollision: selectedOption!.collision,
        coverageInjury: selectedOption!.injury,
        coverageLiability: selectedOption!.liability,
        coverageLifeAddon: selectedOption!.lifeAddon,
        policyTerm: selectedOption!.length,
        insuranceValueScore: finalScore
      }
    };
    onComplete(data, finalScore);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-7xl w-full bg-white dark:bg-slate-900 rounded-[4rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5"
    >
      <div className="flex flex-col lg:flex-row h-[90vh] lg:h-[850px]">
        {/* Sidebar */}
        <div className="lg:w-96 bg-slate-950 p-12 text-white flex flex-col justify-between">
           <div className="space-y-12">
              <div className="space-y-4">
                 <div className="w-16 h-16 bg-brand-600 rounded-3xl flex items-center justify-center">
                    <Shield className="w-8 h-8" />
                 </div>
                 <h3 className="text-3xl font-black uppercase tracking-tight italic">Policy Underwriting</h3>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Challenge #6 (Protection)</p>
              </div>

              <div className="space-y-8">
                 <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-6">
                    <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Insured Asset</p>
                       <p className="text-xl font-black italic text-brand-400 uppercase tracking-tighter">{vehicleDescription}</p>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-white/10">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Premium Impact</p>
                       <p className="text-4xl font-black italic text-white">${(parseFloat(selectedOption?.premium || '0')).toLocaleString()}</p>
                    </div>
                 </div>

                 {selectedOption && (
                   <div className={`p-6 rounded-3xl border border-current border-opacity-10 ${valueMetrics.color} bg-white/5`}>
                      <div className="flex items-center gap-3 mb-2">
                        {valueMetrics.risk === 'Low' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                        <p className="text-xs font-black uppercase tracking-widest">{valueMetrics.label}</p>
                      </div>
                      <p className="text-xs font-medium opacity-80 leading-relaxed text-white">
                        {valueMetrics.msg}
                      </p>
                   </div>
                 )}
              </div>
           </div>

           <div className="pt-8 border-t border-white/10 space-y-4 text-center opacity-40">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Market Discover Discovery</p>
              <p className="text-[8px] font-medium text-slate-500 italic">"Explore independent quotes to find your rate."</p>
           </div>
        </div>

        {/* Main Interface */}
        <div className="flex-1 p-8 lg:p-14 overflow-y-auto">
           <AnimatePresence mode="wait">
              {!isConfirmed ? (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                   <div className="space-y-2">
                      <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight italic">Market Comparison</h2>
                      <p className="text-slate-500 font-medium">Research 3 quotes to find your ideal protection balance.</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {options.map((opt, i) => (
                        <div 
                          key={opt.id}
                          className={`p-8 rounded-[3rem] border-2 transition-all relative ${selectedId === opt.id ? 'border-brand-600 bg-brand-50/20' : 'border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/30'}`}
                        >
                           <div className="absolute -top-3 -left-3 w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm font-black">
                              {i+1}
                           </div>

                           <div className="space-y-8">
                              <div className="space-y-6">
                                 <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insurance Provider</label>
                                    <input 
                                      placeholder="Search and enter insurer..."
                                      value={opt.provider}
                                      onChange={(e) => handleChange(opt.id, 'provider', e.target.value)}
                                      className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-1 font-black text-slate-900 dark:text-white outline-none focus:border-brand-500"
                                    />
                                 </div>

                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Premium</label>
                                       <div className="relative font-black text-lg">
                                          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                          <input 
                                            type="number"
                                            value={opt.premium}
                                            onChange={(e) => handleChange(opt.id, 'premium', e.target.value)}
                                            className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 pl-5 py-1 outline-none"
                                          />
                                       </div>
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deductible</label>
                                       <div className="relative font-black text-lg">
                                          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                          <input 
                                            type="number"
                                            value={opt.deductible}
                                            onChange={(e) => handleChange(opt.id, 'deductible', e.target.value)}
                                            className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 pl-5 py-1 outline-none"
                                          />
                                       </div>
                                    </div>
                                 </div>

                                 <div className="space-y-4 p-5 bg-slate-100 dark:bg-slate-800 rounded-[2rem]">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1 text-center">Coverage Portfolio</label>
                                    <div className="flex flex-col gap-3">
                                       {[
                                         { key: 'collision', label: 'Collision', icon: Zap },
                                         { key: 'injury', label: 'Bodily Injury', icon: Heart },
                                         { key: 'liability', label: 'Liability ($1M+)', icon: ShieldCheck }
                                       ].map((c) => (
                                          <button 
                                            key={c.key}
                                            onClick={() => handleChange(opt.id, c.key as any, !(opt as any)[c.key])}
                                            className={`flex items-center justify-between px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${(opt as any)[c.key] ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400'}`}
                                          >
                                            <div className="flex items-center gap-2">
                                              <c.icon className="w-3.5 h-3.5" />
                                              {c.label}
                                            </div>
                                            {(opt as any)[c.key] ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <div className="w-3 h-3 rounded-full border border-slate-300" />}
                                          </button>
                                       ))}
                                    </div>
                                 </div>

                                 <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contract Length (Months)</label>
                                    <input 
                                      type="number"
                                      value={opt.length}
                                      onChange={(e) => handleChange(opt.id, 'length', e.target.value)}
                                      className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-1 font-bold outline-none"
                                    />
                                 </div>
                              </div>

                              <button 
                                onClick={() => setSelectedId(opt.id)}
                                className={`w-full py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${selectedId === opt.id ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-brand-50'}`}
                              >
                                {selectedId === opt.id ? 'Binder Ready' : 'Select Quote'}
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>

                   <button 
                     disabled={!selectedId || isSubmitting}
                     onClick={handleSubmit}
                     className="w-full btn-primary py-7 text-2xl font-black rounded-[2rem] flex items-center justify-center gap-4 hover:scale-[1.01] transition-transform shadow-2xl"
                   >
                      {isSubmitting ? 'Verifying Underwriting...' : 'Execute Policy Binder'}
                      <ArrowRight className="w-8 h-8" />
                   </button>
                </motion.div>
              ) : (
                <motion.div 
                   key="success"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-center py-12 space-y-12"
                >
                   <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/40 rounded-[2.5rem] flex items-center justify-center text-emerald-600 mx-auto">
                      <Lock className="w-12 h-12" />
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic">Coverage Locked.</h2>
                      <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto">
                         Your policy with {selectedOption?.provider} is now active for your {vehicleDescription}.
                      </p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                      <div className="p-10 bg-slate-50 dark:bg-slate-800 rounded-[3.5rem] border border-slate-100 dark:border-white/5 space-y-2">
                         <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Policy Value Score</p>
                         <p className="text-6xl font-black text-slate-900 dark:text-white">{finalScore}/100</p>
                      </div>
                      <div className={`p-10 rounded-[3.5rem] border border-opacity-10 space-y-2 border-current ${valueMetrics.color} bg-white/5`}>
                         <p className="text-[10px] font-black uppercase tracking-widest">Risk Exposure</p>
                         <p className="text-4xl font-black mt-2 uppercase">{valueMetrics.risk} Risk</p>
                      </div>
                   </div>

                   <button 
                     onClick={handleFinalize}
                     className="w-full max-w-md btn-primary py-7 text-2xl font-black rounded-[2rem]"
                   >
                      Complete Final Onboarding
                   </button>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
