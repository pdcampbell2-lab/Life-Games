"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Droplet, 
  TrendingDown, 
  CheckCircle2, 
  ArrowRight,
  Calculator,
  Info,
  AlertCircle
} from 'lucide-react';

interface UtilityCostsChallengeProps {
  onComplete: (data: { hydro: number; gas: number; water: number; utilityEfficiency: number }, score: number) => void;
  monthlyIncome: number;
  homeValue: number;
}

export default function UtilityCostsChallenge({ onComplete, monthlyIncome, homeValue }: UtilityCostsChallengeProps) {
  const [costs, setCosts] = useState({
    hydro: '',
    gas: '',
    waterInput: ''
  });
  const [usageProfile, setUsageProfile] = useState<'eco' | 'standard' | 'high'>('standard');
  const [isQuarterly, setIsQuarterly] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Home-size influence: Bigger houses need more energy
  const sizeMultiplier = Math.max(0.8, Math.min(2.5, homeValue / 400000));
  
  const ranges = {
    hydro: { min: 50 * sizeMultiplier, max: 300 * sizeMultiplier, label: 'Hydro/Electricity' },
    gas: { min: 40 * sizeMultiplier, max: 300 * sizeMultiplier, label: 'Natural Gas' },
    water: { min: 30 * sizeMultiplier, max: 200 * sizeMultiplier, label: 'Water/Sewer' }
  };

  const monthlyWater = useMemo(() => {
    const val = parseFloat(costs.waterInput) || 0;
    return isQuarterly ? val / 3 : val;
  }, [costs.waterInput, isQuarterly]);

  const totalMonthlyUtilities = useMemo(() => {
    return (parseFloat(costs.hydro) || 0) + (parseFloat(costs.gas) || 0) + monthlyWater;
  }, [costs.hydro, costs.gas, monthlyWater]);

  const validate = () => {
    const hydro = parseFloat(costs.hydro);
    const gas = parseFloat(costs.gas);
    
    if (isNaN(hydro) || hydro < ranges.hydro.min || hydro > ranges.hydro.max) 
      return { valid: false, msg: `${ranges.hydro.label}: Realistic range for your home is $${Math.round(ranges.hydro.min)} - $${Math.round(ranges.hydro.max)}.` };
    
    if (isNaN(gas) || gas < ranges.gas.min || gas > ranges.gas.max) 
      return { valid: false, msg: `${ranges.gas.label}: Realistic range for your home is $${Math.round(ranges.gas.min)} - $${Math.round(ranges.gas.max)}.` };
    
    if (isNaN(monthlyWater) || monthlyWater < ranges.water.min || monthlyWater > ranges.water.max) 
      return { valid: false, msg: `${ranges.water.label}: Realistic monthly water for your home is $${Math.round(ranges.water.min)} - $${Math.round(ranges.water.max)}.` };
    
    return { valid: true };
  };

  const calculateScore = () => {
    let score = 60; // Base score

    // Usage profile weights
    if (usageProfile === 'eco') score += 20;
    else if (usageProfile === 'high') score -= 20;

    // Cost efficiency bonus (lower end of size-range is better)
    const efficiencyHydro = (ranges.hydro.max - parseFloat(costs.hydro)) / (ranges.hydro.max - ranges.hydro.min);
    score += (efficiencyHydro * 10);

    return Math.min(100, Math.max(0, Math.round(score)));
  };

  const handleSubmit = () => {
    const v = validate();
    if (!v.valid) {
      alert(v.msg);
      return;
    }

    setIsSubmitting(true);
    const score = calculateScore();
    setFinalScore(score);

    setTimeout(() => {
      setIsConfirmed(true);
      setIsSubmitting(false);
    }, 1200);
  };

  const handleFinalize = () => {
    onComplete({
      hydro: parseFloat(costs.hydro),
      gas: parseFloat(costs.gas),
      water: monthlyWater,
      utilityEfficiency: usageProfile === 'eco' ? 95 : usageProfile === 'standard' ? 75 : 40
    }, finalScore);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5"
    >
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="md:w-72 bg-slate-950 p-10 text-white flex flex-col justify-between">
           <div className="space-y-10">
              <div className="space-y-4">
                 <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950">
                    <Calculator className="w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-tight">Utility Analysis</h3>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data Input</p>
              </div>

              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Monthly Total</label>
                    <p className="text-4xl font-black italic text-amber-400">
                       ${totalMonthlyUtilities.toFixed(0)}
                    </p>
                 </div>
                 <div className="pt-6 border-t border-white/10">
                    <p className="text-xs font-medium leading-relaxed text-slate-400 italic">
                      "Analyze your consumption patterns to optimize your monthly budget."
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Main Interface */}
        <div className="flex-1 p-10 lg:p-14">
           <AnimatePresence mode="wait">
              {!isConfirmed ? (
                <motion.div 
                  key="inputs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-10"
                >
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">Consumption Profile</h2>
                        <p className="text-slate-500 font-medium">Select your household usage intensity.</p>
                      </div>
                      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                         {['eco', 'standard', 'high'].map((p) => (
                           <button 
                             key={p}
                             onClick={() => setUsageProfile(p as any)}
                             className={`px-4 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${usageProfile === p ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                           >
                             {p}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-2 pt-6 border-t border-slate-100 dark:border-white/5">
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Monthly Meters</h2>
                      <p className="text-slate-500 font-medium">Enter your estimated utility costs.</p>
                   </div>

                   <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {/* HYDRO */}
                         <div className="space-y-4">
                            <div className="flex items-center gap-3">
                               <Zap className="w-5 h-5 text-amber-500" />
                               <div className="flex flex-col">
                                 <label className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">{ranges.hydro.label}</label>
                                 <span className="text-[9px] font-bold text-slate-400 capitalize">Estimated cost</span>
                               </div>
                            </div>
                            <div className="relative">
                               <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 font-black">$</span>
                               <input 
                                 type="number"
                                 placeholder="Enter amount"
                                 value={costs.hydro}
                                 onChange={(e) => setCosts({...costs, hydro: e.target.value})}
                                 className="w-full bg-transparent border-b-2 border-slate-100 dark:border-white/5 pl-4 py-2 font-black text-xl outline-none focus:border-amber-500 transition-colors"
                               />
                            </div>
                         </div>

                         {/* GAS */}
                         <div className="space-y-4">
                            <div className="flex items-center gap-3">
                               <Flame className="w-5 h-5 text-orange-500" />
                               <div className="flex flex-col">
                                 <label className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">{ranges.gas.label}</label>
                                 <span className="text-[9px] font-bold text-slate-400 capitalize">Estimated cost</span>
                               </div>
                            </div>
                            <div className="relative">
                               <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 font-black">$</span>
                               <input 
                                 type="number"
                                 placeholder="Enter amount"
                                 value={costs.gas}
                                 onChange={(e) => setCosts({...costs, gas: e.target.value})}
                                 className="w-full bg-transparent border-b-2 border-slate-100 dark:border-white/5 pl-4 py-2 font-black text-xl outline-none focus:border-orange-500 transition-colors"
                               />
                            </div>
                         </div>
                      </div>

                      {/* WATER */}
                      <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-white/5 space-y-6">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <Droplet className="w-6 h-6 text-blue-500" />
                               <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Water Utility</h4>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Billed Quarterly?</span>
                               <div 
                                 onClick={() => setIsQuarterly(!isQuarterly)}
                                 className={`w-12 h-6 rounded-full transition-all relative ${isQuarterly ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                               >
                                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isQuarterly ? 'left-7' : 'left-1'}`} />
                               </div>
                            </label>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Amount ($)</label>
                               <input 
                                 type="number"
                                 placeholder="Search for local utility data..."
                                 value={costs.waterInput}
                                 onChange={(e) => setCosts({...costs, waterInput: e.target.value})}
                                 className="w-full bg-transparent border-b-2 border-slate-200 dark:border-white/10 py-1 font-black text-xl outline-none focus:border-blue-500"
                               />
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-between">
                               <div>
                                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Monthly Reserve</p>
                                  <p className="text-xl font-black text-blue-700 dark:text-blue-400">${monthlyWater.toFixed(0)}</p>
                               </div>
                               <Info className="w-5 h-5 text-blue-300" />
                            </div>
                         </div>
                      </div>
                   </div>

                   <button 
                     disabled={isSubmitting}
                     onClick={handleSubmit}
                     className="w-full btn-primary py-6 text-xl font-black flex items-center justify-center gap-4 group"
                   >
                     {isSubmitting ? 'Syncing Profile...' : 'Finalize Utility Strategy'}
                     <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                   </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-10"
                >
                   <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 rounded-[2rem] flex items-center justify-center text-emerald-600 mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight italic">Budget Calibrated</h2>
                      <p className="text-lg text-slate-500 font-medium max-w-sm mx-auto">
                         {finalScore > 80 ? "Your utility costs are efficient and realistic." : 
                          finalScore > 60 ? "You've selected realistic values for a standard home." : 
                          "Your utility costs are high, but realistic. Watch your consumption."}
                      </p>
                   </div>

                   <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-white/5 inline-block mx-auto min-w-[240px]">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Utility Score</p>
                      <p className="text-5xl font-black text-brand-600">{finalScore}/100</p>
                   </div>

                   <button 
                     onClick={handleFinalize}
                     className="w-full max-w-md btn-primary py-6 text-xl font-black rounded-3xl"
                   >
                     Apply To Profile
                   </button>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
