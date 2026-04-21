"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Utensils, 
  Ticket, 
  Car, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Star,
  Sparkles,
  Info,
  Calendar,
  Wallet,
  Smile,
  Users
} from 'lucide-react';

interface DateNightChallengeProps {
  onComplete: (data: any, score: number) => void;
  isSingle: boolean;
}

export default function DateNightChallenge({ onComplete, isSingle }: DateNightChallengeProps) {
  const [inputs, setInputs] = useState({
    startTime: '19:00',
    endTime: '22:30',
    foodItem: '',
    foodCost: '',
    eventItem: '',
    eventCost: '',
    miscItem: '',
    miscCost: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const totalCost = useMemo(() => {
    const f = parseFloat(inputs.foodCost) || 0;
    const e = parseFloat(inputs.eventCost) || 0;
    const m = parseFloat(inputs.miscCost) || 0;
    return f + e + m;
  }, [inputs.foodCost, inputs.eventCost, inputs.miscCost]);

  const dateDuration = useMemo(() => {
    const start = inputs.startTime.split(':').map(Number);
    const end = inputs.endTime.split(':').map(Number);
    let diff = (end[0] * 60 + end[1]) - (start[0] * 60 + start[1]);
    if (diff < 0) diff += 24 * 60; // Handle overnight dates
    return diff;
  }, [inputs.startTime, inputs.endTime]);

  const spendingTier = useMemo(() => {
    if (totalCost > 450) return { label: 'Luxury Escapade', color: 'text-indigo-500', feedback: 'High-end experience but costly.' };
    if (totalCost > 150) return { label: 'Balanced Memory', color: 'text-emerald-500', feedback: 'Great balance of fun and affordability.' };
    return { label: 'Economic Social', color: 'text-brand-500', feedback: 'Budget-friendly and creative choice.' };
  }, [totalCost]);

  const calculateHapinessScore = () => {
    let score = 60;
    
    // Duration check: if date is > 4 hours but cost is < $60, it's "cheap"
    if (dateDuration > 240 && totalCost < 60) score -= 20; 
    // Balanced spend
    if (totalCost >= 100 && totalCost <= 350) score += 20;
    // Incidental foresight
    if (parseFloat(inputs.miscCost) > 15) score += 10;
    // Description effort
    if (inputs.foodItem.length > 20) score += 10;

    return Math.min(100, Math.max(0, score));
  };

  const validate = () => {
    if (!inputs.foodItem) return { valid: false, msg: "Please describe your food choice." };
    if (!inputs.eventItem) return { valid: false, msg: "Please describe your activity." };

    const f = parseFloat(inputs.foodCost);
    const e = parseFloat(inputs.eventCost);
    const m = parseFloat(inputs.miscCost || '0');

    if (isNaN(f) || f < 10 || f > 300) return { valid: false, msg: "Food cost must be between $10 and $300." };
    if (isNaN(e) || e < 10 || e > 300) return { valid: false, msg: "Activity cost must be between $10 and $300." };
    if (isNaN(m) || m < 0 || m > 200) return { valid: false, msg: "Additional costs must be between $0 and $200." };

    return { valid: true };
  };

  const handleSubmit = () => {
    const v = validate();
    if (!v.valid) {
      alert(v.msg);
      return;
    }

    setIsSubmitting(true);
    const score = calculateHapinessScore();
    setFinalScore(score);

    setTimeout(() => {
       setIsConfirmed(true);
       setIsSubmitting(false);
    }, 1500);
  };

  const handleFinalize = () => {
    onComplete({
      amount: totalCost,
      label: `DATE NIGHT: ${inputs.eventItem}`,
      paymentMethod: paymentMethod,
      meta: {
        dateStartTime: inputs.startTime,
        dateEndTime: inputs.endTime,
        dateDurationMinutes: dateDuration,
        happinessDelta: finalScore > 80 ? 20 : (finalScore < 50 ? -10 : 5),
        relationalMaturityScore: finalScore,
        paymentInstrument: paymentMethod,
        spendingTier: spendingTier.label
      }
    }, finalScore);
  };

  const titleText = isSingle ? 'Leisure Night Out' : 'The Perfect Date Night';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-6xl w-full bg-white dark:bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5"
    >
      <div className="flex flex-col lg:flex-row min-h-[700px] lg:h-[800px]">
        {/* Sidebar */}
        <div className="lg:w-96 bg-rose-950 p-12 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           
           <div className="relative space-y-12">
              <div className="space-y-4">
                 <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center text-rose-950 shadow-2xl shadow-rose-500/20">
                    <Heart className="w-8 h-8" />
                 </div>
                 <h3 className="text-3xl font-black uppercase tracking-tight italic">{isSingle ? 'Social Lab' : 'Romance Lab'}</h3>
                 <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest leading-none">Challenge #11 (Quality of Life)</p>
              </div>

              <div className="space-y-8">
                 <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-6">
                    <div>
                        <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest mb-2 italic">Budget Allocation</p>
                        <p className="text-5xl font-black text-white italic tracking-tighter">${totalCost.toFixed(0)}</p>
                    </div>
                    <div className="pt-6 border-t border-white/5 space-y-3">
                       <div className="flex justify-between text-[10px] font-bold text-rose-400 uppercase">
                          <span className="flex items-center gap-1.5"><Utensils className="w-3 h-3"/> Food</span>
                          <span>${parseFloat(inputs.foodCost || '0').toFixed(0)}</span>
                       </div>
                       <div className="flex justify-between text-[10px] font-bold text-rose-400 uppercase">
                          <span className="flex items-center gap-1.5"><Ticket className="w-3 h-3"/> Event</span>
                          <span>${parseFloat(inputs.eventCost || '0').toFixed(0)}</span>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-2">
                    <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest">Strategy Rating</p>
                    <p className={`text-xl font-black italic uppercase tracking-tighter ${spendingTier.color}`}>{spendingTier.label}</p>
                    <p className="text-[9px] font-medium text-rose-200/40 leading-tight italic">
                       "{spendingTier.feedback}"
                    </p>
                 </div>

                 {totalCost > 300 && (
                   <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-4">
                      <Star className="w-5 h-5 text-amber-500 mt-0.5" />
                      <p className="text-[10px] font-bold text-amber-500 uppercase leading-relaxed">
                         High-End Experience. You are prioritizing premium memories over short-term liquidity.
                      </p>
                   </div>
                 )}
              </div>
           </div>

           <div className="relative pt-8 border-t border-white/10 italic text-[11px] text-rose-300/60 leading-relaxed font-serif">
             "Money spent on moments is the only capital that never depreciates."
           </div>
        </div>

        {/* Main Interface */}
        <div className="flex-1 p-8 lg:p-14 overflow-y-auto">
           <AnimatePresence mode="wait">
              {!isConfirmed ? (
                <motion.div 
                   key="form"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="space-y-12"
                >
                   <div className="flex justify-between items-end">
                      <div className="space-y-2">
                        <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase underline decoration-rose-500/30">{titleText}</h2>
                        <p className="text-slate-500 font-medium">Design an experience that balances creativity with your current cash flow.</p>
                      </div>
                      <div className="flex items-center gap-2 text-rose-500">
                         <Clock className="w-5 h-5" />
                         <span className="text-lg font-black italic">{inputs.startTime} — {inputs.endTime}</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-10">
                         {/* TIME SECTION */}
                         <div className="space-y-6 p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                               <Calendar className="w-4 h-4" /> Timeline Configuration
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-1">
                                  <label className="text-[10px] font-black text-slate-500 uppercase">Start</label>
                                  <input 
                                    type="time"
                                    value={inputs.startTime}
                                    onChange={(e) => setInputs({...inputs, startTime: e.target.value})}
                                    className="w-full bg-white dark:bg-slate-900 rounded-xl p-3 font-black text-slate-900 dark:text-white outline-none"
                                  />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-[10px] font-black text-slate-500 uppercase">Finish</label>
                                  <input 
                                    type="time"
                                    value={inputs.endTime}
                                    onChange={(e) => setInputs({...inputs, endTime: e.target.value})}
                                    className="w-full bg-white dark:bg-slate-900 rounded-xl p-3 font-black text-slate-900 dark:text-white outline-none"
                                  />
                               </div>
                            </div>
                         </div>

                         {/* FOOD SECTION */}
                         <div className="space-y-6">
                            <div className="flex items-center gap-3">
                               <Utensils className="w-5 h-5 text-rose-500" />
                               <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-white italic">Dining Strategy</h3>
                            </div>
                            <div className="space-y-4">
                               <input 
                                 placeholder="Search for local dining/activity..."
                                 value={inputs.foodItem}
                                 onChange={(e) => setInputs({...inputs, foodItem: e.target.value})}
                                 className="w-full bg-transparent border-b-2 border-slate-100 dark:border-white/5 py-2 font-black text-xl outline-none focus:border-rose-500"
                               />
                               <div className="flex items-center gap-3">
                                  <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Est. Cost</label>
                                  <div className="relative">
                                     <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                     <input 
                                       type="number"
                                       value={inputs.foodCost}
                                       onChange={(e) => setInputs({...inputs, foodCost: e.target.value})}
                                       className="w-32 bg-slate-100 dark:bg-slate-800 rounded-xl p-3 pl-6 font-black text-slate-900 dark:text-white outline-none"
                                     />
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-10">
                         {/* EVENT SECTION */}
                         <div className="space-y-6">
                            <div className="flex items-center gap-3">
                               <Ticket className="w-5 h-5 text-indigo-500" />
                               <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-white italic">Event / Activity</h3>
                            </div>
                            <div className="space-y-4">
                               <input 
                                 placeholder="e.g. Premium IMAX Movie Tickets"
                                 value={inputs.eventItem}
                                 onChange={(e) => setInputs({...inputs, eventItem: e.target.value})}
                                 className="w-full bg-transparent border-b-2 border-slate-100 dark:border-white/5 py-2 font-black text-xl outline-none focus:border-indigo-500"
                               />
                               <div className="flex items-center gap-3">
                                  <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Est. Cost</label>
                                  <div className="relative">
                                     <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                     <input 
                                       type="number"
                                       value={inputs.eventCost}
                                       onChange={(e) => setInputs({...inputs, eventCost: e.target.value})}
                                       className="w-32 bg-slate-100 dark:bg-slate-800 rounded-xl p-3 pl-6 font-black text-slate-900 dark:text-white outline-none"
                                     />
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* MISC SECTION */}
                         <div className="space-y-6 p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-3">
                               <Car className="w-5 h-5 text-slate-400" />
                               <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Logistics & Incidental</h3>
                            </div>
                            <div className="space-y-4">
                               <input 
                                 placeholder="e.g. Uber XL / Secure Parking"
                                 value={inputs.miscItem}
                                 onChange={(e) => setInputs({...inputs, miscItem: e.target.value})}
                                 className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-1 text-sm font-bold outline-none"
                               />
                               <div className="flex items-center gap-3">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cost</label>
                                  <div className="relative">
                                     <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                                     <input 
                                       type="number"
                                       value={inputs.miscCost}
                                       onChange={(e) => setInputs({...inputs, miscCost: e.target.value})}
                                       className="w-24 bg-white dark:bg-slate-900 rounded-lg p-2 pl-4 text-xs font-black outline-none"
                                     />
                                  </div>
                               </div>
                            </div>
                         </div>
                         {/* PAYMENT METHOD SECTION */}
                         <div className="space-y-6 p-8 bg-brand-50 dark:bg-brand-900/10 rounded-[2.5rem] border border-brand-100 dark:border-brand-500/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                               <Wallet className="w-12 h-12" />
                            </div>
                            <div className="space-y-3 relative">
                               <h3 className="text-xs font-black uppercase text-brand-600 tracking-widest flex items-center gap-2">
                                  <Wallet className="w-4 h-4" /> Instrument Strategy
                               </h3>
                               <div className="grid grid-cols-2 gap-4">
                                  <button 
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`py-6 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${paymentMethod === 'cash' ? 'border-brand-600 bg-white dark:bg-slate-900 text-brand-600 shadow-xl' : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800 text-slate-400 opacity-60'}`}
                                  >
                                     <Wallet className="w-5 h-5" />
                                     <span className="text-[10px] font-black uppercase tracking-widest leading-none">Cash Balance</span>
                                  </button>
                                  <button 
                                    onClick={() => setPaymentMethod('credit')}
                                    className={`py-6 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${paymentMethod === 'credit' ? 'border-rose-600 bg-white dark:bg-slate-900 text-rose-600 shadow-xl' : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800 text-slate-400 opacity-60'}`}
                                  >
                                     <CreditCard className="w-5 h-5" />
                                     <span className="text-[10px] font-black uppercase tracking-widest leading-none">Credit Card</span>
                                  </button>
                               </div>
                               {paymentMethod === 'credit' && (
                                 <p className="text-[8px] font-bold text-rose-500 uppercase tracking-tighter animate-pulse text-center">
                                    Strategic Warning: This will accrue interest if not paid in full by end of month.
                                 </p>
                               )}
                            </div>
                         </div>
                      </div>
                   </div>

                   <button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full btn-primary py-8 text-2xl font-black rounded-3xl flex items-center justify-center gap-6 group hover:shadow-2xl hover:shadow-rose-600/30 transition-all uppercase italic"
                   >
                      {isSubmitting ? 'Finalizing Reservations...' : 'Issue Date Night Binder'}
                      <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                   </button>
                </motion.div>
              ) : (
                <motion.div 
                   key="success"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-center py-12 space-y-10"
                >
                   <div className="w-24 h-24 bg-rose-100 dark:bg-rose-950/30 rounded-[2.5rem] flex items-center justify-center text-rose-600 mx-auto shadow-xl">
                      <Smile className="w-12 h-12" />
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Strategy Issued.</h2>
                      <p className="text-xl text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                        Your {isSingle ? 'Social Event' : 'Date Night'} is locked. ${totalCost.toFixed(2)} will be deducted from your bank balance today.
                      </p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                      <div className="p-10 bg-slate-50 dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-white/5 space-y-2">
                         <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Creativity Rating</p>
                         <p className="text-6xl font-black text-slate-900 dark:text-white">{finalScore}<span className="text-xl text-slate-400">/100</span></p>
                      </div>
                      <div className="p-10 bg-slate-50 dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-white/5 space-y-2">
                         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Happiness Yield</p>
                         <p className="text-4xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Maximum Impact</p>
                      </div>
                   </div>

                   <button 
                     onClick={handleFinalize}
                     className="w-full max-w-md btn-primary py-8 text-2xl font-black rounded-3xl"
                   >
                      Add To Daily Ledger
                   </button>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
