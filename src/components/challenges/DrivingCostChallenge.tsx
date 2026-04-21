"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Fuel, 
  Wrench, 
  Calculator, 
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Info,
  Droplets,
  Zap,
  Gauge
} from 'lucide-react';

interface DrivingCostChallengeProps {
  onComplete: (data: { gas: number; maintenance: number; meta: any }, score: number) => void;
  monthlyIncome: number;
  vehicleMeta: {
    year: number;
    description: string;
    engine: string;
  };
}

export default function DrivingCostChallenge({ onComplete, monthlyIncome, vehicleMeta }: DrivingCostChallengeProps) {
  const [inputs, setInputs] = useState({
    gasPrice: '',
    litresPerFill: '',
    fillsPerMonth: '',
    annualMaint: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Car-age influence: Older cars need significantly more maintenance reserves
  const carAge = new Date().getFullYear() - (vehicleMeta.year || 2020);
  const minAnnualMaint = Math.max(400, carAge * 200); // Floor of $400, adds $200 per year of age
  const maxAnnualMaint = 5000;

  // Engine influence: EVs have lower 'fuel' but higher insurance/tire costs (tires in maint)
  const isEV = vehicleMeta.engine === 'electric';
  const fuelLabel = isEV ? 'Electricity / Charging' : 'Gas Price / Litre';
  const fillLabel = isEV ? 'Charge Cycles / Month' : 'Fills / Month';

  // Auto-calculations
  const costPerFill = useMemo(() => {
    const p = parseFloat(inputs.gasPrice) || 0;
    const l = parseFloat(inputs.litresPerFill) || 0;
    return p * l;
  }, [inputs.gasPrice, inputs.litresPerFill]);

  const monthlyGasCost = useMemo(() => {
    const f = parseFloat(inputs.fillsPerMonth) || 0;
    return costPerFill * f;
  }, [costPerFill, inputs.fillsPerMonth]);

  const monthlyMaintCost = useMemo(() => {
    const a = parseFloat(inputs.annualMaint) || 0;
    return a / 12;
  }, [inputs.annualMaint]);

  const totalOperatingCost = monthlyGasCost + monthlyMaintCost;

  const validate = () => {
    const gp = parseFloat(inputs.gasPrice);
    const lf = parseFloat(inputs.litresPerFill);
    const fm = parseFloat(inputs.fillsPerMonth);
    const am = parseFloat(inputs.annualMaint);

    if (isNaN(gp) || gp < 1.00 || gp > 2.50) return { valid: false, msg: `${fuelLabel} must be $1.00 - $2.50.` };
    if (isNaN(lf) || lf < 30 || lf > 100) return { valid: false, msg: "Litres per fill must be 30L - 100L." };
    if (isNaN(fm) || fm < 1 || fm > 20) return { valid: false, msg: `${fillLabel} must be 1 - 20.` };
    if (isNaN(am) || am < minAnnualMaint) return { valid: false, msg: `For a ${carAge} year old vehicle, annual maintenance should be at least $${minAnnualMaint}.` };

    return { valid: true };
  };

  const calculateScore = () => {
    let score = 60; 
    const am = parseFloat(inputs.annualMaint);
    
    // Safety score: How much above the bare minimum are they budgeting?
    const safetyBuffer = (am / minAnnualMaint);
    if (safetyBuffer >= 1.5) score += 20; // Proactive maintenance
    else if (safetyBuffer >= 1.1) score += 10;

    return Math.min(100, score);
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
    }, 1500);
  };

  const handleFinalize = () => {
    onComplete({
      gas: monthlyGasCost,
      maintenance: monthlyMaintCost,
      meta: {
        gasPriceAnchor: parseFloat(inputs.gasPrice),
        fillsFrequency: parseFloat(inputs.fillsPerMonth),
        totalAnnualMaint: parseFloat(inputs.annualMaint),
        breakdownSafetyScore: (parseFloat(inputs.annualMaint) / minAnnualMaint) * 100,
        transportVolatilityRisk: isEV ? 10 : 80
      }
    }, finalScore);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-5xl w-full bg-white dark:bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5"
    >
      <div className="flex flex-col lg:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="lg:w-80 bg-slate-950 p-10 text-white flex flex-col justify-between">
           <div className="space-y-10">
              <div className="space-y-4">
                 <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950">
                    <Gauge className="w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-tight italic">Operational Lab</h3>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Challenge #7</p>
              </div>

              <div className="space-y-8">
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Total Operating</p>
                        <p className="text-3xl font-black text-emerald-400 italic">${totalOperatingCost.toFixed(0)}<span className="text-xs text-slate-500">/mo</span></p>
                    </div>
                    <div className="pt-4 border-t border-white/5 space-y-2">
                       <div className="flex justify-between text-[10px] font-bold text-slate-400">
                          <span>Fuel</span>
                          <span>${monthlyGasCost.toFixed(0)}</span>
                       </div>
                       <div className="flex justify-between text-[10px] font-bold text-slate-400">
                          <span>Service</span>
                          <span>${monthlyMaintCost.toFixed(0)}</span>
                       </div>
                    </div>
                 </div>

                 {totalOperatingCost > (monthlyIncome * 0.15) && (
                   <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <p className="text-[10px] font-bold text-amber-400 uppercase tracking-tight leading-relaxed">
                         High overhead detected. Mobility takes {( (totalOperatingCost/monthlyIncome)*100 ).toFixed(0)}% of your pay.
                      </p>
                   </div>
                 )}
              </div>
           </div>

           <p className="text-[10px] font-medium text-slate-500 italic">
             "A car doesn't just run on fuel; it runs on foresight."
           </p>
        </div>

        {/* Main Interface */}
        <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
           <AnimatePresence mode="wait">
              {!isConfirmed ? (
                <motion.div 
                   key="calc"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="space-y-12"
                >
                   <div className="space-y-2">
                      <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight italic">Formula For Driving</h2>
                      <p className="text-slate-500 font-medium">Calculate the variable costs of maintaining your car.</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {/* FUEL SECTION */}
                      <div className="space-y-8">
                         <div className="flex items-center gap-3">
                            <Fuel className="w-6 h-6 text-brand-600" />
                            <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-white italic">Fuel Strategy</h3>
                         </div>

                         <div className="space-y-6">
                            <div className="space-y-1">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{fuelLabel} ($)</label>
                               <input 
                                 type="number"
                                 placeholder="e.g. 1.65"
                                 value={inputs.gasPrice}
                                 onChange={(e) => setInputs({...inputs, gasPrice: e.target.value})}
                                 className="w-full bg-transparent border-b-2 border-slate-100 dark:border-white/5 py-1 font-black text-2xl outline-none focus:border-brand-500"
                               />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Litres / Full Fill</label>
                               <input 
                                 type="number"
                                 placeholder="e.g. 50"
                                 value={inputs.litresPerFill}
                                 onChange={(e) => setInputs({...inputs, litresPerFill: e.target.value})}
                                 className="w-full bg-transparent border-b-2 border-slate-100 dark:border-white/5 py-1 font-black text-2xl outline-none focus:border-brand-500"
                               />
                            </div>
                            <div className="p-5 bg-brand-50 dark:bg-brand-900/10 rounded-2xl flex items-center justify-between">
                               <div className="flex flex-col">
                                  <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Cost Per Fill</span>
                                  <span className="text-2xl font-black text-brand-700 dark:text-brand-300 italic">${costPerFill.toFixed(2)}</span>
                               </div>
                               <Droplets className="w-8 h-8 text-brand-400 opacity-40" />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{fillLabel}</label>
                               <input 
                                 type="number"
                                 placeholder="e.g. 3"
                                 value={inputs.fillsPerMonth}
                                 onChange={(e) => setInputs({...inputs, fillsPerMonth: e.target.value})}
                                 className="w-full bg-transparent border-b-2 border-slate-100 dark:border-white/5 py-1 font-black text-2xl outline-none focus:border-brand-500"
                               />
                            </div>
                         </div>
                      </div>

                      {/* MAINTENANCE SECTION */}
                      <div className="space-y-8">
                         <div className="flex items-center gap-3">
                            <Wrench className="w-6 h-6 text-amber-500" />
                            <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-white italic">Service Lab</h3>
                         </div>

                         <div className="space-y-8">
                            <div className="space-y-1">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projected Annual Service ($)</label>
                               <input 
                                 type="number"
                                 placeholder={`Min: $${minAnnualMaint}`}
                                 value={inputs.annualMaint}
                                 onChange={(e) => setInputs({...inputs, annualMaint: e.target.value})}
                                 className="w-full bg-transparent border-b-2 border-slate-100 dark:border-white/5 py-1 font-black text-2xl outline-none focus:border-amber-500"
                               />
                               <p className="text-[9px] font-bold text-slate-400 mt-2 italic">Recommended for a {carAge} year old vehicle: ${minAnnualMaint}+</p>
                            </div>

                            <div className="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/20 space-y-4">
                               <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Monthly Allocation</span>
                                  <Calculator className="w-5 h-5 text-amber-400" />
                               </div>
                               <p className="text-5xl font-black text-amber-700 dark:text-amber-400 italic">${monthlyMaintCost.toFixed(0)}</p>
                               <p className="text-[10px] font-medium text-amber-600/60 leading-relaxed italic">
                                 "Setting this aside monthly prevents repair-bill debt shocks later."
                               </p>
                            </div>
                         </div>
                      </div>
                   </div>

                   <button 
                     disabled={isSubmitting}
                     onClick={handleSubmit}
                     className="w-full btn-primary py-7 text-2xl font-black rounded-3xl flex items-center justify-center gap-4 group"
                   >
                     {isSubmitting ? 'Simulating Road Costs...' : 'Complete Operational Strategy'}
                     <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                   </button>
                </motion.div>
              ) : (
                <motion.div 
                   key="success"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-center py-10 space-y-10"
                >
                   <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic">Engine Calibrated.</h2>
                      <p className="text-lg text-slate-500 font-medium max-w-sm mx-auto">
                         "You've normalized your variable driving costs. Your monthly ledger is now strictly realistic."
                      </p>
                   </div>

                   <div className="flex flex-col md:flex-row gap-6 max-w-2xl mx-auto">
                      <div className="flex-1 p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Calculation Precision</p>
                         <p className="text-4xl font-black text-indigo-600">{finalScore}/100</p>
                      </div>
                      <div className="flex-1 p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Mobility Impact</p>
                         <p className="text-4xl font-black text-emerald-600 italic">Realistic</p>
                      </div>
                   </div>

                   <button 
                     onClick={handleFinalize}
                     className="w-full max-w-md btn-primary py-7 text-2xl font-black rounded-3xl"
                   >
                      Apply To Ledger
                   </button>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
