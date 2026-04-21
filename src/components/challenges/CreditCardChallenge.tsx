"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  ChevronRight, 
  CheckCircle2, 
  Info, 
  AlertTriangle,
  Gift,
  HandCoins,
  ShieldCheck,
  TrendingUp,
  Percent
} from 'lucide-react';

interface CardOption {
  id: string;
  companyName: string;
  cardType: string;
  annualFee: string;
  interestRate: string;
  perkDescription: string;
}

interface CreditCardChallengeProps {
  onComplete: (data: any, score: number) => void;
  monthlyIncome: number;
  currentLeftover?: number;
  blueprint?: any;
}

export default function CreditCardChallenge({ onComplete, monthlyIncome, currentLeftover, blueprint }: CreditCardChallengeProps) {
  const [options, setOptions] = useState<CardOption[]>([
    { id: '1', companyName: '', cardType: 'Visa', annualFee: '', interestRate: '', perkDescription: '' },
    { id: '2', companyName: '', cardType: 'Mastercard', annualFee: '', interestRate: '', perkDescription: '' },
    { id: '3', companyName: '', cardType: 'Amex', annualFee: '', interestRate: '', perkDescription: '' }
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleChange = (id: string, field: keyof CardOption, value: any) => {
    setOptions(options.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const validate = () => {
    for (const opt of options) {
      if (!opt.companyName) return { valid: false, msg: "Please enter company names for all cards." };
      const fee = parseFloat(opt.annualFee);
      const rate = parseFloat(opt.interestRate);
      
      if (isNaN(fee) || fee < 0 || fee > 200) return { valid: false, msg: `Annual fee for ${opt.companyName} must be $0-$200.` };
      if (isNaN(rate) || rate < 10 || rate > 30) return { valid: false, msg: `Interest rate for ${opt.companyName} must be 10%-30%.` };
    }
    if (!selectedId) return { valid: false, msg: "Please select your final credit card." };
    return { valid: true };
  };

  const selectedOption = useMemo(() => options.find(o => o.id === selectedId), [options, selectedId]);
  
  const cardValueReport = useMemo(() => {
    if (!selectedOption) return { label: 'Analyzing', color: 'text-slate-400', risk: 'N/A' };
    const rate = parseFloat(selectedOption.interestRate) || 0;
    const fee = parseFloat(selectedOption.annualFee) || 0;

    if (rate <= 15 && fee === 0) return { label: 'Elite Choice', color: 'text-emerald-500', risk: 'Low', msg: 'Low interest and no fees is the gold standard for safety.' };
    if (rate > 22) return { label: 'High Risk', color: 'text-rose-500', risk: 'High', msg: 'High interest rate. Carrying a balance will be extremely expensive.' };
    if (fee > 100) return { label: 'Premium Heavy', color: 'text-indigo-400', risk: 'Moderate', msg: 'High annual fee. Ensure the perks outweigh this sunk cost.' };
    return { label: 'Balanced', color: 'text-brand-500', risk: 'Medium', msg: 'A standard credit option for everyday use.' };
  }, [selectedOption]);

  const calculateScore = (selected: CardOption) => {
    let score = 50;
    const rate = parseFloat(selected.interestRate);
    const fee = parseFloat(selected.annualFee);
    const perkLength = selected.perkDescription.length;

    if (rate < 15) score += 30;
    else if (rate < 20) score += 15;
    
    if (fee === 0) score += 20;
    else if (fee < 100) score += 10;

    if (perkLength > 10) score += 10;

    return Math.min(100, score);
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
      card: {
        provider: selectedOption!.companyName,
        type: selectedOption!.cardType,
        annual_fee: parseFloat(selectedOption!.annualFee),
        interest_rate: parseFloat(selectedOption!.interestRate),
        balance: 0,
        perks: selectedOption!.perkDescription
      },
      meta: {
        lastCreditAction: 'selection',
        creditStrategyScore: finalScore,
        cardPerkStrength: selectedOption!.perkDescription.length > 20 ? 'high' : 'standard'
      }
    };
    onComplete(data, finalScore);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-6xl w-full bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5"
    >
      <div className="flex flex-col lg:flex-row h-[90vh] lg:h-[800px]">
        {/* Sidebar */}
        <div className="lg:w-96 bg-brand-950 p-12 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl text-brand-600" />
           
           <div className="relative space-y-12">
              <div className="space-y-4">
                 <div className="w-16 h-16 bg-brand-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-brand-600/20">
                    <CreditCard className="w-8 h-8" />
                 </div>
                 <h3 className="text-3xl font-black uppercase tracking-tight italic">Credit Underwriting</h3>
                 <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Challenge #8 (Expansion)</p>
              </div>

              <div className="space-y-8">
                 <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-6">
                    <div>
                       <p className="text-[10px] font-black text-brand-300 uppercase tracking-widest mb-2">Strategy Valuation</p>
                       <div className="flex items-center gap-2">
                          {selectedOption && (
                            <>
                              <div className={`p-1 rounded-full bg-current bg-opacity-10 ${cardValueReport.color}`}>
                                <ShieldCheck className="w-4 h-4" />
                              </div>
                              <span className={`text-xl font-black uppercase tracking-tight ${cardValueReport.color}`}>{cardValueReport.label}</span>
                            </>
                          )}
                          {!selectedOption && <span className="text-xl font-black text-white/20 uppercase italic">Awaiting Quote</span>}
                       </div>
                    </div>
                    
                    <div className="pt-6 border-t border-white/10 space-y-4">
                       <div className="flex justify-between items-end">
                          <p className="text-[10px] font-black text-brand-300 uppercase tracking-widest">Interest Risk</p>
                          <p className="text-3xl font-black text-white italic">{selectedOption?.interestRate || '0'}%</p>
                       </div>
                       <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(parseFloat(selectedOption?.interestRate || '0') / 30) * 100}%` }}
                            className={`h-full ${parseFloat(selectedOption?.interestRate || '0') > 22 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          />
                       </div>
                    </div>
                 </div>

                 {selectedOption && (
                   <div className="space-y-4">
                      <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl space-y-4">
                         <div className="flex items-center gap-3">
                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Debt Trap Simulator</p>
                         </div>
                         <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Scenario: $1,000 Balance</p>
                            <div className="flex justify-between items-end">
                               <div className="space-y-1">
                                  <p className="text-[8px] font-black text-slate-500 uppercase">Monthly Interest</p>
                                  <p className="text-2xl font-black text-white italic">${( (1000 * (parseFloat(selectedOption.interestRate)/100 || 0)) / 12 ).toFixed(2)}</p>
                               </div>
                               <div className="text-right space-y-1">
                                  <p className="text-[8px] font-black text-slate-500 uppercase">Time to Pay (Min)</p>
                                  <p className="text-lg font-black text-rose-400 italic">~74 Months</p>
                               </div>
                            </div>
                         </div>
                         <p className="text-[9px] font-medium text-slate-500 italic leading-tight">
                            At {selectedOption.interestRate}%, paying only the minimum would cost you an extra ~$640 in interest alone.
                         </p>
                      </div>
                      <p className="text-xs font-medium text-brand-200/60 leading-relaxed italic">
                        "{cardValueReport.msg}"
                      </p>
                   </div>
                 )}
              </div>
           </div>

           <div className="relative pt-8 border-t border-white/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-600/30 flex items-center justify-center">
                 <HandCoins className="w-5 h-5 text-brand-300" />
              </div>
              <p className="text-[10px] font-black text-brand-300 uppercase tracking-widest leading-tight">
                 Credit is a tool for leverage, not a lifestyle subsidy.
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
                   <div className="flex justify-between items-end">
                      <div className="space-y-2">
                        <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">The Credit Lab</h2>
                        <p className="text-slate-500 font-medium">Profile 3 cards to find your primary financial instrument.</p>
                      </div>
                      <div className="hidden lg:flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                         <Gift className="w-5 h-5 text-brand-600" />
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compare Perks</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {options.map((opt, i) => (
                        <div 
                          key={opt.id}
                          className={`p-8 rounded-[2.5rem] border-2 transition-all relative ${selectedId === opt.id ? 'border-brand-600 bg-white dark:bg-slate-800 shadow-2xl' : 'border-slate-100 dark:border-white/5 bg-white/50 dark:bg-slate-800/30 grayscale opacity-70 hover:grayscale-0 hover:opacity-100'}`}
                        >
                           <div className="absolute -top-3 -left-3 w-10 h-10 rounded-2xl bg-brand-950 text-white flex items-center justify-center text-sm font-black shadow-lg">
                              {i+1}
                           </div>

                           <div className="space-y-8">
                              <div className="space-y-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Institution</label>
                                    <input 
                                      placeholder="Search and enter institution..."
                                      value={opt.companyName}
                                      onChange={(e) => handleChange(opt.id, 'companyName', e.target.value)}
                                      className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-1 font-black text-slate-900 dark:text-white outline-none focus:border-brand-500"
                                    />
                                    <select 
                                      value={opt.cardType}
                                      onChange={(e) => handleChange(opt.id, 'cardType', e.target.value)}
                                      className="w-full mt-2 bg-slate-100 dark:bg-slate-900 rounded-xl p-2 text-[10px] font-black uppercase text-slate-500 border-none outline-none"
                                    >
                                       <option>Visa</option>
                                       <option>Mastercard</option>
                                       <option>Amex</option>
                                       <option>Discover</option>
                                    </select>
                                 </div>

                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Annual Fee</label>
                                       <div className="relative">
                                          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                          <input 
                                            type="number"
                                            value={opt.annualFee}
                                            onChange={(e) => handleChange(opt.id, 'annualFee', e.target.value)}
                                            className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 pl-4 py-1 font-black text-brand-600 outline-none"
                                          />
                                       </div>
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interest (APR)</label>
                                       <div className="relative">
                                          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                                          <input 
                                            type="number"
                                            value={opt.interestRate}
                                            onChange={(e) => handleChange(opt.id, 'interestRate', e.target.value)}
                                            className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 pr-4 py-1 font-black text-rose-500 outline-none"
                                          />
                                       </div>
                                    </div>
                                 </div>

                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Rewards & Perks</label>
                                    <textarea 
                                      rows={2}
                                      placeholder="e.g. 2% Cashback, Scene points, Travel Insurance..."
                                      value={opt.perkDescription}
                                      onChange={(e) => handleChange(opt.id, 'perkDescription', e.target.value)}
                                      className="w-full bg-slate-100 dark:bg-slate-950/50 rounded-2xl p-4 text-xs font-medium text-slate-600 dark:text-slate-400 outline-none focus:ring-1 focus:ring-brand-500 resize-none border-none"
                                    />
                                 </div>
                              </div>

                              <button 
                                onClick={() => setSelectedId(opt.id)}
                                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedId === opt.id ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-brand-50 hover:text-brand-600'}`}
                              >
                                {selectedId === opt.id ? 'Asset Chosen' : 'Select This Profile'}
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>

                   <button 
                     disabled={!selectedId || isSubmitting}
                     onClick={handleSubmit}
                     className="w-full btn-primary py-8 text-2xl font-black rounded-3xl flex items-center justify-center gap-6 group hover:shadow-2xl hover:shadow-brand-600/30 transition-all"
                   >
                      {isSubmitting ? 'Verifying Credit Worthiness...' : 'Issue Final Card Binder'}
                      <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                   </button>
                </motion.div>
              ) : (
                <motion.div 
                   key="success"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-center py-12 space-y-12"
                >
                   <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-950/30 rounded-[2.5rem] flex items-center justify-center text-emerald-600 mx-auto">
                      <ShieldCheck className="w-12 h-12" />
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic">Capital Issued.</h2>
                      <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                        Your {selectedOption?.companyName} {selectedOption?.cardType} has been activated with {selectedOption?.interestRate}% APR.
                      </p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                      <div className="p-12 bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-xl space-y-2 group hover:border-brand-600/30 transition-colors">
                         <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Financial Maturity Score</p>
                         <p className="text-7xl font-black text-slate-900 dark:text-white">{finalScore}<span className="text-xl text-slate-400">/100</span></p>
                      </div>
                      <div className={`p-12 rounded-[3rem] border border-opacity-10 space-y-2 border-current ${cardValueReport.color} bg-white dark:bg-slate-800 shadow-xl`}>
                         <p className="text-[10px] font-black uppercase tracking-widest">Risk Profile</p>
                         <p className="text-4xl font-black text-current mt-2 uppercase">{cardValueReport.label}</p>
                         <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mt-1 italic">Interest calculated monthly</p>
                      </div>
                   </div>

                   <button 
                     onClick={handleFinalize}
                     className="w-full max-w-md btn-primary py-8 text-2xl font-black rounded-3xl"
                   >
                      Integrate with Ledger
                   </button>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
