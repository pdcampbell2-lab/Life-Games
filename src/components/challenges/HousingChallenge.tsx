"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Key, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  Building2,
  DollarSign,
  PieChart,
  Info,
  Users
} from 'lucide-react';

interface HousingOption {
  id: string;
  type: 'rent' | 'own';
  location: string;
  monthlyCost: string;
  propertyValue: string;
  mortgageAmount: string;
  notes: string;
}

interface HousingChallengeProps {
  onComplete: (data: any, score: number) => void;
  monthlyIncome: number;
  hasPartner: boolean;
  currentLeftover?: number;
  blueprint?: any;
}

export default function HousingChallenge({ onComplete, monthlyIncome, hasPartner, currentLeftover, blueprint }: HousingChallengeProps) {
  const [options, setOptions] = useState<HousingOption[]>([
    { id: '1', type: 'rent', location: '', monthlyCost: '', propertyValue: '', mortgageAmount: '', notes: '' },
    { id: '2', type: 'own', location: '', monthlyCost: '', propertyValue: '', mortgageAmount: '', notes: '' },
    { id: '3', type: 'rent', location: '', monthlyCost: '', propertyValue: '', mortgageAmount: '', notes: '' }
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [consultedPartner, setConsultedPartner] = useState(false);

  const annualIncome = monthlyIncome * 12;
  const maxMortgage = annualIncome * 4.5; // Traditional bank limit

  const getBankStatus = (opt: HousingOption) => {
    if (opt.type === 'rent') return { status: 'n/a', color: 'text-slate-400' };
    const mortgage = parseFloat(opt.mortgageAmount) || 0;
    if (mortgage > maxMortgage) return { status: 'Denied', color: 'text-rose-500', msg: 'Mortage exceeds 4.5x income' };
    return { status: 'Approved', color: 'text-emerald-500', msg: 'Within lending limits' };
  };

  const handleChange = (id: string, field: keyof HousingOption, value: any) => {
    setOptions(options.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const validate = () => {
    for (const opt of options) {
      if (!opt.location) return { valid: false, msg: "Please enter locations for all 3 options." };
      const cost = parseFloat(opt.monthlyCost);
      if (isNaN(cost) || cost < 800 || cost > 7000) return { valid: false, msg: `Monthly cost for ${opt.location} must be between $800-$7000.` };
      if (opt.type === 'own') {
        if (!opt.propertyValue || !opt.mortgageAmount) return { valid: false, msg: "For ownership options, please enter property value and mortgage amount." };
        if (getBankStatus(opt).status === 'Denied') return { valid: false, msg: `Bank Denied! Mortgage for ${opt.location} is too high.` };
      }
    }
    if (!selectedId) return { valid: false, msg: "Please select your final housing choice." };
    if (hasPartner && !consultedPartner) return { valid: false, msg: "Consult your spouse/partner before making the final decision." };
    return { valid: true };
  };

  const selectedOption = useMemo(() => options.find(o => o.id === selectedId), [options, selectedId]);
  
  const housingRatio = useMemo(() => {
    if (!selectedOption) return 0;
    const cost = parseFloat(selectedOption.monthlyCost) || 0;
    return (cost / monthlyIncome) * 100;
  }, [selectedOption, monthlyIncome]);

  const affordabilityFeedback = useMemo(() => {
    if (housingRatio <= 30) return { label: 'Affordable', color: 'text-emerald-500', bg: 'bg-emerald-50', icon: CheckCircle2 };
    if (housingRatio <= 50) return { label: 'Moderate Risk', color: 'text-amber-500', bg: 'bg-amber-50', icon: Info };
    return { label: 'High Risk (House Poor)', color: 'text-rose-500', bg: 'bg-rose-50', icon: AlertTriangle };
  }, [housingRatio]);

  const calculateScore = (selected: HousingOption) => {
    const ratio = (parseFloat(selected.monthlyCost) / monthlyIncome) * 100;
    let score = 0;
    
    // Affordability contribution (70 points)
    if (ratio <= 30) score += 70;
    else if (ratio <= 45) score += 45;
    else score += 20;

    // Type bonus (30 points for realistic planning)
    if (selected.type === 'own' && ratio <= 40) score += 30; // Solid ownership plan
    else if (selected.type === 'rent') score += 25; // Safe renting
    else score += 5; // Overextended ownership

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
    const data = {
      housing_cost_type: selectedOption!.type === 'own' ? 'mortgage' : 'rent',
      monthly_housing_payment: parseFloat(selectedOption!.monthlyCost),
      property_value: parseFloat(selectedOption!.propertyValue) || 0,
      mortgage_amount: parseFloat(selectedOption!.mortgageAmount) || 0,
      location: selectedOption!.location,
      housingStress: housingRatio > 50 ? 90 : housingRatio > 30 ? 50 : 10
    };
    onComplete(data, finalScore);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-7xl w-full bg-white dark:bg-slate-900 rounded-[4rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5"
    >
      <div className="flex flex-col lg:flex-row h-[90vh] lg:h-[800px]">
        {/* SIDEBAR: Affordability Live-Track */}
        <div className="lg:w-96 bg-slate-950 p-12 text-white flex flex-col justify-between">
           <div className="space-y-12">
              <div className="space-y-4">
                 <div className="w-16 h-16 bg-brand-600 rounded-3xl flex items-center justify-center">
                    <Home className="w-8 h-8" />
                 </div>
                 <h3 className="text-3xl font-black uppercase tracking-tight italic">Find A Home</h3>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Challenge #3</p>
              </div>

              <div className="space-y-8">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Affordability Meter</p>
                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex relative">
                       <div 
                         className={`h-full transition-all duration-1000 ${housingRatio > 50 ? 'bg-rose-500' : housingRatio > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                         style={{ width: `${Math.min(100, housingRatio)}%` }}
                       />
                       {/* 30% Marker */}
                       <div className="absolute left-[30%] top-0 bottom-0 w-px bg-white/30" />
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                       <span>Safe</span>
                       <span>Current: {housingRatio.toFixed(0)}%</span>
                       <span>Over</span>
                    </div>
                 </div>

                 <AnimatePresence mode="wait">
                   {hasPartner && (
                     <motion.button 
                       onClick={() => setConsultedPartner(true)}
                       className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${consultedPartner ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'}`}
                     >
                        {consultedPartner ? <CheckCircle2 className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                        {consultedPartner ? 'Spouse Consulted' : 'Consult Spouse'}
                     </motion.button>
                   )}
                 </AnimatePresence>

                 <AnimatePresence mode="wait">
                   {selectedOption && (
                     <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className={`p-6 rounded-[2rem] border min-h-[120px] ${affordabilityFeedback.bg} ${affordabilityFeedback.color} border-current border-opacity-10`}
                     >
                        <div className="flex items-center gap-3 mb-2">
                           <affordabilityFeedback.icon className="w-5 h-5" />
                           <p className="text-xs font-black uppercase tracking-widest">{affordabilityFeedback.label}</p>
                        </div>
                        <p className="text-xs font-medium leading-relaxed opacity-80">
                           {housingRatio <= 30 ? "Perfect. You have room to breathe and save for the future." : 
                            housingRatio <= 50 ? "Be careful. One unexpected bill could put you in debt." : 
                            "CRITICAL: You are house-poor. Future stress events are highly likely."}
                        </p>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
           </div>

           <div className="pt-8 border-t border-white/10 space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Monthly Income Cap</p>
              <p className="text-2xl font-black italic">${monthlyIncome.toLocaleString()}</p>
           </div>
        </div>

        {/* MAIN: Property Research Hub */}
        <div className="flex-1 p-8 lg:p-14 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            {!isConfirmed ? (
              <motion.div 
                key="research"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight italic">Market Research</h2>
                  <p className="text-slate-500 font-medium">Compare Rent vs Own across three potential properties.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {options.map((opt, i) => (
                    <div 
                      key={opt.id}
                      className={`p-8 rounded-[3rem] border-2 transition-all relative ${selectedId === opt.id ? 'border-brand-600 bg-brand-50/20' : 'border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/30'}`}
                    >
                      <div className="absolute -top-3 -left-3 w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm font-black shadow-lg">
                        {i + 1}
                      </div>

                      <div className="flex justify-end mb-4 min-h-[20px]">
                         {opt.type === 'own' && opt.mortgageAmount && (
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-current border-opacity-10 text-[8px] font-black uppercase tracking-widest ${getBankStatus(opt).color}`}>
                               {getBankStatus(opt).status === 'Approved' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                               Bank {getBankStatus(opt).status}
                            </div>
                         )}
                      </div>

                      <div className="space-y-6">
                        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                           <button 
                             onClick={() => handleChange(opt.id, 'type', 'rent')}
                             className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${opt.type === 'rent' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                           >Rent</button>
                           <button 
                             onClick={() => handleChange(opt.id, 'type', 'own')}
                             className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${opt.type === 'own' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                           >Own</button>
                        </div>

                        <div className="space-y-4">
                           <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</label>
                              <div className="relative">
                                 <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                 <input 
                                   placeholder="Enter City/Neighborhood..."
                                   value={opt.location}
                                   onChange={(e) => handleChange(opt.id, 'location', e.target.value)}
                                   className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 pl-6 py-1 font-black text-slate-900 dark:text-white focus:border-brand-500 outline-none"
                                 />
                              </div>
                           </div>

                           <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Cost</label>
                              <div className="relative text-2xl font-black">
                                 <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                 <input 
                                   type="number"
                                   placeholder="0"
                                   value={opt.monthlyCost}
                                   onChange={(e) => handleChange(opt.id, 'monthlyCost', e.target.value)}
                                   className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 pl-6 py-1 font-black text-slate-900 dark:text-white focus:border-brand-500 outline-none"
                                 />
                              </div>
                           </div>

                           <AnimatePresence>
                             {opt.type === 'own' && (
                               <motion.div 
                                 initial={{ opacity: 0, height: 0 }}
                                 animate={{ opacity: 1, height: 'auto' }}
                                 exit={{ opacity: 0, height: 0 }}
                                 className="space-y-4 pt-2 overflow-hidden"
                               >
                                  <div className="space-y-1">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Property Value</label>
                                     <input 
                                       type="number"
                                       placeholder="600000"
                                       value={opt.propertyValue}
                                       onChange={(e) => handleChange(opt.id, 'propertyValue', e.target.value)}
                                       className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-1 font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-brand-500"
                                     />
                                  </div>
                                  <div className="space-y-1">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mortgage Amt</label>
                                     <input 
                                       type="number"
                                       placeholder="500000"
                                       value={opt.mortgageAmount}
                                       onChange={(e) => handleChange(opt.id, 'mortgageAmount', e.target.value)}
                                       className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-1 font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-brand-500"
                                     />
                                  </div>
                               </motion.div>
                             )}
                           </AnimatePresence>
                        </div>

                        <button 
                          onClick={() => setSelectedId(opt.id)}
                          className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${selectedId === opt.id ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-brand-50'}`}
                        >
                          {selectedId === opt.id ? 'Final Choice' : 'Select Home'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                   <button 
                     disabled={!selectedId || isSubmitting}
                     onClick={handleSubmit}
                     className="w-full btn-primary py-6 text-xl font-black flex items-center justify-center gap-4 group"
                   >
                     {isSubmitting ? 'Verifying Budget Alignment...' : 'Confirm Housing Decision'}
                     <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-10"
              >
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/40 rounded-[2.5rem] flex items-center justify-center text-emerald-600 mx-auto">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                
                <div className="space-y-4">
                   <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight italic">Welcome Home.</h2>
                   <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto italic">
                     "The foundation of your financial life is now set in {selectedOption?.location}."
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                   <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[3rem] space-y-2 border border-slate-100 dark:border-white/5">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Decision Score</p>
                      <p className="text-5xl font-black text-slate-900 dark:text-white">{finalScore}/100</p>
                   </div>
                   <div className={`p-8 rounded-[3rem] space-y-2 border border-opacity-10 ${affordabilityFeedback.bg} ${affordabilityFeedback.color} border-current`}>
                      <p className="text-[10px] font-black uppercase tracking-widest">Affordability</p>
                      <p className="text-3xl font-black mt-2">{affordabilityFeedback.label}</p>
                   </div>
                </div>

                <div className="pt-8">
                  <button 
                    onClick={handleFinalize}
                    className="w-full max-w-md btn-primary py-7 text-2xl font-black rounded-3xl"
                  >
                    Enter Your New Home
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
