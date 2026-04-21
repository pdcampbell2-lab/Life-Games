"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Fuel, 
  ShieldCheck, 
  Wrench, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Info,
  AlertTriangle,
  Zap,
  Leaf,
  Calendar
} from 'lucide-react';

interface VehicleOption {
  id: string;
  type: string;
  makeModel: string;
  year: string;
  mileage: string;
  engine: 'gas' | 'hybrid' | 'electric';
  purchaseType: 'own' | 'finance' | 'lease';
  term: '36' | '48' | '60' | '72' | '84'; // Loan/Lease terms
  payment: string;
  insurance: string;
  maintenance: string;
  fuel: string;
}

interface VehicleChallengeProps {
  onComplete: (data: any, score: number) => void;
  monthlyIncome: number;
  currentLeftover?: number;
  blueprint?: any;
}

export default function VehicleChallenge({ onComplete, monthlyIncome, currentLeftover, blueprint }: VehicleChallengeProps) {
  const [options, setOptions] = useState<VehicleOption[]>([
    { id: '1', type: 'Car', makeModel: '', year: '', mileage: '', engine: 'gas', purchaseType: 'finance', term: '60', payment: '', insurance: '', maintenance: '', fuel: '' },
    { id: '2', type: 'SUV', makeModel: '', year: '', mileage: '', engine: 'hybrid', purchaseType: 'finance', term: '60', payment: '', insurance: '', maintenance: '', fuel: '' },
    { id: '3', type: 'Truck', makeModel: '', year: '', mileage: '', engine: 'gas', purchaseType: 'own', term: '60', payment: '0', insurance: '', maintenance: '', fuel: '' }
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const annualIncome = monthlyIncome * 12;

  const getReliabilityProfile = (opt: VehicleOption) => {
    const year = parseInt(opt.year) || 2024;
    const mileage = parseInt(opt.mileage) || 0;
    
    if (year > 2021 && mileage < 40000) return { risk: 'Low', label: 'High Maintenance Protection', color: 'text-emerald-500', breakdownProb: 5, depreciation: 20 };
    if (year > 2017) return { risk: 'Moderate', label: 'Standard Wear & Tear', color: 'text-amber-500', breakdownProb: 20, depreciation: 10 };
    return { risk: 'High', label: 'Critical Failure Risk', color: 'text-rose-500', breakdownProb: 45, depreciation: 2 };
  };

  const handleChange = (id: string, field: keyof VehicleOption, value: any) => {
    setOptions(options.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const validate = () => {
    for (const opt of options) {
      if (!opt.makeModel || !opt.year) return { valid: false, msg: "Please enter make/model and year for all vehicles." };
      const payment = parseFloat(opt.payment);
      const insurance = parseFloat(opt.insurance);
      const maintenance = parseFloat(opt.maintenance);
      const fuel = parseFloat(opt.fuel);
      
      if (isNaN(payment) || payment < 0 || payment > 1500) return { valid: false, msg: `Payment for ${opt.makeModel} must be $0-$1500.` };
      if (isNaN(insurance) || insurance < 100 || insurance > 500) return { valid: false, msg: `Insurance for ${opt.makeModel} must be $100-$500.` };
      if (isNaN(maintenance) || maintenance < 50 || maintenance > 400) return { valid: false, msg: `Maintenance for ${opt.makeModel} must be $50-$400.` };
      if (isNaN(fuel) || fuel < 100 || fuel > 600) return { valid: false, msg: `Fuel for ${opt.makeModel} must be $100-$600.` };
    }
    if (!selectedId) return { valid: false, msg: "Please select your final vehicle choice." };
    return { valid: true };
  };

  const selectedOption = useMemo(() => options.find(o => o.id === selectedId), [options, selectedId]);
  
  const totalCost = useMemo(() => {
    if (!selectedOption) return 0;
    return (parseFloat(selectedOption.payment) || 0) + 
           (parseFloat(selectedOption.insurance) || 0) + 
           (parseFloat(selectedOption.maintenance) || 0) + 
           (parseFloat(selectedOption.fuel) || 0);
  }, [selectedOption]);

  const transRatio = (totalCost / monthlyIncome) * 100;

  const feedback = useMemo(() => {
    if (transRatio <= 15) return { label: 'Affordable', color: 'text-emerald-500', bg: 'bg-emerald-50', icon: CheckCircle2 };
    if (transRatio <= 25) return { label: 'Moderate', color: 'text-amber-500', bg: 'bg-amber-50', icon: Info };
    return { label: 'Expensive', color: 'text-rose-500', bg: 'bg-rose-50', icon: AlertTriangle };
  }, [transRatio]);

  const calculateScore = (selected: VehicleOption) => {
    const ratio = (totalCost / monthlyIncome) * 100;
    const year = parseInt(selected.year);
    const mileage = parseInt(selected.mileage) || 0;
    
    let score = 0;
    // Affordability contribution (60 points)
    if (ratio <= 15) score += 60;
    else if (ratio <= 22) score += 40;
    else score += 15;

    // Reliability contribution (20 points for new/low mileage)
    if (year >= 2020 && mileage < 80000) score += 20;
    else if (year >= 2015) score += 10;

    // Efficiency bonus (20 points)
    if (selected.engine === 'electric' || selected.engine === 'hybrid') score += 20;

    return score;
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
    }, 1500);
  };

  const handleFinalize = () => {
    const profile = getReliabilityProfile(selectedOption!);
    const data = {
      car_payment: parseFloat(selectedOption!.payment),
      insurance: parseFloat(selectedOption!.insurance),
      maintenance: parseFloat(selectedOption!.maintenance),
      gas: parseFloat(selectedOption!.fuel),
      meta: {
        carDescription: `${selectedOption!.year} ${selectedOption!.makeModel}`,
        carQuality: parseInt(selectedOption!.year) > 2018 ? 90 : 50,
        carEngine: selectedOption!.engine,
        breakdownRisk: profile.breakdownProb,
        depreciationRate: profile.depreciation,
        insuranceRisk: parseFloat(selectedOption!.insurance) > 350 ? 90 : 40,
        loanTerm: selectedOption!.term
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
        {/* Sidebar Info */}
        <div className="lg:w-96 bg-indigo-950 p-12 text-white flex flex-col justify-between">
           <div className="space-y-12">
              <div className="space-y-4">
                 <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center">
                    <Car className="w-8 h-8" />
                 </div>
                 <h3 className="text-3xl font-black uppercase tracking-tight italic">Provision Vehicle</h3>
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Challenge #5 (Final)</p>
              </div>

              <div className="space-y-8">
                 <div className="space-y-6 p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
                    <div>
                       <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Total Monthly TCO</p>
                       <p className="text-4xl font-black text-white italic">${totalCost.toLocaleString()}</p>
                    </div>
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Income Impact</p>
                       <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${transRatio > 25 ? 'bg-rose-500' : transRatio > 15 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, transRatio)}%` }}
                          />
                       </div>
                       <div className="flex justify-between text-[8px] font-black uppercase tracking-widest opacity-60">
                          <span>Safe Limit (15%)</span>
                          <span>{transRatio.toFixed(0)}%</span>
                       </div>
                    </div>
                 </div>

                 {selectedOption && (
                   <div className={`p-6 rounded-3xl flex items-start gap-4 ${feedback.bg} ${feedback.color}`}>
                      <feedback.icon className="w-6 h-6 mt-1 flex-shrink-0" />
                      <div>
                         <p className="font-black text-sm uppercase mb-1">{feedback.label} Strategy</p>
                         <p className="text-xs font-medium opacity-80 leading-relaxed">
                            {transRatio <= 15 ? "Sustainable. Your transport costs are in perfect alignment." : 
                             transRatio <= 25 ? "Caution. Be wary of rising maintenance or fuel spikes." : 
                             "Risk. You are paying a premium for mobility. Expect low cash flow."}
                         </p>
                      </div>
                   </div>
                 )}
              </div>
           </div>

           <div className="pt-8 border-t border-white/10 italic text-sm text-indigo-300">
             "A car payment is a fixed cost. A maintenance spike is a life crisis. Plan for both."
           </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
           <AnimatePresence mode="wait">
              {!isConfirmed ? (
                <motion.div 
                  key="search"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                   <div className="flex items-center justify-between">
                     <div className="space-y-1">
                       <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight italic">Find A Hero</h2>
                       <p className="text-slate-500 font-medium">Research 3 options to fill your garage.</p>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {options.map((opt, i) => (
                        <div 
                          key={opt.id}
                          className={`p-6 rounded-[2.5rem] border-2 transition-all relative ${selectedId === opt.id ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/30'}`}
                        >
                           <div className="flex justify-between items-start mb-4">
                              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-xl bg-indigo-950 text-white flex items-center justify-center text-xs font-black">
                                 {i+1}
                              </div>
                              <div className={`px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-current border-opacity-10 text-[8px] font-black uppercase tracking-widest ${getReliabilityProfile(opt).color}`}>
                                 {getReliabilityProfile(opt).risk} Risk: {getReliabilityProfile(opt).label}
                              </div>
                           </div>

                           <div className="space-y-6">
                              <div className="space-y-4">
                                 <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Model & Year</label>
                                    <div className="flex gap-2">
                                       <input 
                                         placeholder="Make/Model"
                                         value={opt.makeModel}
                                         onChange={(e) => handleChange(opt.id, 'makeModel', e.target.value)}
                                         className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-1 font-black text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                                       />
                                       <input 
                                         placeholder="Year"
                                         type="number"
                                         value={opt.year}
                                         onChange={(e) => handleChange(opt.id, 'year', e.target.value)}
                                         className="w-16 bg-transparent border-b border-slate-200 dark:border-white/10 py-1 font-black text-slate-900 dark:text-white outline-none focus:border-indigo-500 text-center"
                                       />
                                    </div>
                                 </div>

                                 <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Mileage (KM)</label>
                                    <input 
                                      type="number"
                                      placeholder="e.g. 50000"
                                      value={opt.mileage}
                                      onChange={(e) => handleChange(opt.id, 'mileage', e.target.value)}
                                      className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-1 font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500"
                                    />
                                 </div>

                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Engine</label>
                                       <select 
                                         value={opt.engine}
                                         onChange={(e) => handleChange(opt.id, 'engine', e.target.value)}
                                         className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-[9px] font-black uppercase text-slate-900 dark:text-white border-none outline-none"
                                       >
                                          <option value="gas">Gas</option>
                                          <option value="hybrid">Hybrid</option>
                                          <option value="electric">Electric</option>
                                       </select>
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Method</label>
                                       <select 
                                         value={opt.purchaseType}
                                         onChange={(e) => handleChange(opt.id, 'purchaseType', e.target.value)}
                                         className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-[9px] font-black uppercase text-slate-900 dark:text-white border-none outline-none"
                                       >
                                          <option value="finance">Finance</option>
                                          <option value="lease">Lease</option>
                                          <option value="own">Buy Cash</option>
                                       </select>
                                    </div>
                                 </div>

                                 {opt.purchaseType !== 'own' && (
                                   <div className="space-y-1">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Term (Months)</label>
                                      <div className="flex gap-1">
                                         {['36', '48', '60', '72', '84'].map(t => (
                                           <button 
                                             key={t}
                                             onClick={() => handleChange(opt.id, 'term', t as any)}
                                             className={`flex-1 py-1 text-[8px] font-black rounded-md border transition-all ${opt.term === t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-white/5'}`}
                                           >
                                              {t}m
                                           </button>
                                         ))}
                                      </div>
                                   </div>
                                 )}

                                 <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                                    <div className="flex items-center justify-between text-xs">
                                       <span className="font-bold text-slate-400">Monthly Payment</span>
                                       <input 
                                         type="number"
                                         disabled={opt.purchaseType === 'own'}
                                         value={opt.purchaseType === 'own' ? '0' : opt.payment}
                                         onChange={(e) => handleChange(opt.id, 'payment', e.target.value)}
                                         className="w-16 bg-transparent border-b border-slate-200 dark:border-white/10 font-black text-right outline-none"
                                       />
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                       <span className="font-bold text-slate-400">Insurance Est.</span>
                                       <input 
                                         type="number"
                                         value={opt.insurance}
                                         onChange={(e) => handleChange(opt.id, 'insurance', e.target.value)}
                                         className="w-16 bg-transparent border-b border-slate-200 dark:border-white/10 font-black text-right outline-none"
                                       />
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                       <span className="font-bold text-slate-400">Maint. Est.</span>
                                       <input 
                                         type="number"
                                         value={opt.maintenance}
                                         onChange={(e) => handleChange(opt.id, 'maintenance', e.target.value)}
                                         className="w-16 bg-transparent border-b border-slate-200 dark:border-white/10 font-black text-right outline-none"
                                       />
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                       <span className="font-bold text-slate-400">Fuel/Energy Est.</span>
                                       <input 
                                         type="number"
                                         value={opt.fuel}
                                         onChange={(e) => handleChange(opt.id, 'fuel', e.target.value)}
                                         className="w-16 bg-transparent border-b border-slate-200 dark:border-white/10 font-black text-right outline-none"
                                       />
                                    </div>
                                 </div>
                              </div>

                              <button 
                                onClick={() => setSelectedId(opt.id)}
                                className={`w-full py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedId === opt.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-indigo-50'}`}
                              >
                                {selectedId === opt.id ? 'Vehicle Locked' : 'Select Vehicle'}
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>

                   <button 
                     disabled={!selectedId || isSubmitting}
                     onClick={handleSubmit}
                     className="w-full btn-primary py-7 text-2xl font-black rounded-3xl flex items-center justify-center gap-4 hover:scale-[1.02] shadow-2xl transition-all"
                   >
                      {isSubmitting ? 'Registering VIN...' : 'Finalize Transportation Strategy'}
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
                      <ShieldCheck className="w-12 h-12" />
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic">Keys Handed Over.</h2>
                      <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                        Your {selectedOption?.year} {selectedOption?.makeModel} has been registered to your profile.
                      </p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                      <div className="p-10 bg-slate-50 dark:bg-slate-800 rounded-[3.5rem] border border-slate-100 dark:border-white/5 space-y-2">
                         <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Ownership Score</p>
                         <p className="text-6xl font-black text-slate-900 dark:text-white">{finalScore}/100</p>
                      </div>
                      <div className={`p-10 rounded-[3.5rem] border border-opacity-10 space-y-2 border-current ${feedback.bg} ${feedback.color}`}>
                         <p className="text-[10px] font-black uppercase tracking-widest">Sustainability</p>
                         <p className="text-4xl font-black text-current mt-2 uppercase">{feedback.label}</p>
                      </div>
                   </div>

                   <button 
                     onClick={handleFinalize}
                     className="w-full max-w-md btn-primary py-7 text-2xl font-black rounded-3xl"
                   >
                      Start Daily Commute
                   </button>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
