"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, 
  Tv, 
  Phone, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  TrendingDown,
  Globe,
  ExternalLink,
  DollarSign
} from 'lucide-react';

interface ResearchCategory {
  id: string;
  name: string;
  icon: any;
  range: { min: number; max: number; avg: number };
  searchPrompt: string;
}

const CATEGORIES: ResearchCategory[] = [
  { 
    id: 'internet', 
    name: 'Internet Service', 
    icon: Wifi, 
    range: { min: 45, max: 150, avg: 85 },
    searchPrompt: "Search: 'High speed internet plans Toronto' or 'Rogers vs Bell Internet prices'"
  },
  { 
    id: 'cable', 
    name: 'Cable & Streaming', 
    icon: Tv, 
    range: { min: 10, max: 150, avg: 65 },
    searchPrompt: "Search: 'Cable TV packages Ontario' or 'Live TV streaming comparison'"
  },
  { 
    id: 'phone', 
    name: 'Home Phone / VoIP', 
    icon: Phone, 
    range: { min: 5, max: 60, avg: 30 },
    searchPrompt: "Search: 'Home phone plans Canada' or 'VOIP providers pricing'"
  }
];

interface ResearchChallengeProps {
  onComplete: (data: any, score: number) => void;
  monthlyIncome: number;
  currentLeftover: number;
  blueprint?: {
    instructions: string;
    [key: string]: any;
  };
}

export default function ResearchChallenge({ onComplete, monthlyIncome, currentLeftover, blueprint }: ResearchChallengeProps) {
  const [research, setResearch] = useState<Record<string, { provider: string; cost: string; details: string }>>({
    internet: { provider: '', cost: '', details: '' },
    cable: { provider: '', cost: '', details: '' },
    phone: { provider: '', cost: '', details: '' }
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);

  const currentTotal = Object.values(research).reduce((acc, curr) => acc + (parseFloat(curr.cost) || 0), 0);
  const projectedLeftover = currentLeftover - currentTotal;

  const handleInputChange = (categoryId: string, field: string, value: string) => {
    setResearch(prev => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], [field]: value }
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    CATEGORIES.forEach(cat => {
      const data = research[cat.id];
      if (!data.provider) newErrors[`${cat.id}_provider`] = "Provider required";
      const cost = parseFloat(data.cost);
      if (isNaN(cost)) {
        newErrors[`${cat.id}_cost`] = "Enter a numeric price";
      } else if (cost < cat.range.min || cost > cat.range.max) {
        newErrors[`${cat.id}_cost`] = `Typical range: $${cat.range.min}-$${cat.range.max}`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateScore = () => {
    let totalScore = 0;
    CATEGORIES.forEach(cat => {
      const cost = parseFloat(research[cat.id].cost);
      // Score based on being close to average (realistic research)
      const diff = Math.abs(cost - cat.range.avg);
      const categoryScore = Math.max(0, 33.33 * (1 - diff/cat.range.avg));
      totalScore += categoryScore;
    });
    return Math.min(100, Math.round(totalScore));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const score = calculateScore();
      setCalculatedScore(score);
      setTimeout(() => {
        setIsConfirmed(true);
        setIsSubmitting(false);
      }, 1200);
    }
  };

  const handleFinalize = () => {
    onComplete({
      internet: parseFloat(research.internet.cost),
      cable: parseFloat(research.cable.cost),
      phone: parseFloat(research.phone.cost)
    }, calculatedScore);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-6xl w-full bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar: Knowledge Hub */}
        <div className="lg:w-80 bg-slate-950 p-10 text-white space-y-8 flex flex-col justify-between">
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center mb-4">
                 <Search className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Research Phase</p>
              <h3 className="text-2xl font-black tracking-tight leading-tight">Market Intelligence</h3>
            </div>
            
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">New Expenses</p>
                  <p className="text-3xl font-black text-red-400">-${currentTotal.toLocaleString()}</p>
               </div>
               <div className="h-px bg-white/10 w-full"></div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Projected Balance</p>
                  <p className={`text-3xl font-black ${projectedLeftover < 0 ? 'text-rose-500' : 'text-emerald-400'}`}>
                    ${projectedLeftover.toLocaleString()}
                  </p>
               </div>
            </div>
          </div>

          <div className="space-y-4 pt-8 border-t border-white/10">
             <div className="flex items-center gap-2 text-brand-500">
                <Globe className="w-4 h-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Research Tool</p>
             </div>
             <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                Open a new tab and search for actual Canadian utility providers to find accurate pricing.
             </p>
          </div>
        </div>

        {/* Main Interface */}
        <div className="flex-1 p-8 md:p-12 relative overflow-y-auto max-h-[85vh]">
          <AnimatePresence mode="wait">
            {!isConfirmed ? (
              <motion.form 
                key="interface"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="space-y-12"
              >
                <div className="space-y-2">
                       <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase">Market Intelligence</h2>
                       <p className="text-slate-500 font-medium max-w-sm">
                          {blueprint?.instructions || "Open a new tab and search for actual Canadian utility providers to find accurate pricing."}
                       </p>
                    </div>

                <div className="space-y-16">
                   {CATEGORIES.map((cat) => (
                     <div key={cat.id} className="space-y-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex items-center justify-center text-brand-600">
                              <cat.icon className="w-5 h-5" />
                           </div>
                           <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{cat.name}</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Provider</label>
                              <input 
                                placeholder="e.g. Rogers, Teksavvy..."
                                value={research[cat.id].provider}
                                onChange={(e) => handleInputChange(cat.id, 'provider', e.target.value)}
                                className={`w-full bg-slate-50 dark:bg-slate-800/50 px-5 py-4 rounded-2xl border-2 transition-all outline-none font-bold ${errors[`${cat.id}_provider`] ? 'border-red-500' : 'border-transparent focus:border-brand-500'}`}
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Cost ($)</label>
                              <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                  placeholder="0.00"
                                  type="number"
                                  value={research[cat.id].cost}
                                  onChange={(e) => handleInputChange(cat.id, 'cost', e.target.value)}
                                  className={`w-full bg-slate-50 dark:bg-slate-800/50 pl-10 pr-5 py-4 rounded-2xl border-2 transition-all outline-none font-black ${errors[`${cat.id}_cost`] ? 'border-red-500' : 'border-transparent focus:border-brand-500'}`}
                                />
                              </div>
                              {errors[`${cat.id}_cost`] && <p className="text-[10px] font-bold text-red-500 pl-1">{errors[`${cat.id}_cost`]}</p>}
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan Details / Notes</label>
                              <input 
                                placeholder="e.g. 150Mbps, Basic TV..."
                                value={research[cat.id].details}
                                onChange={(e) => handleInputChange(cat.id, 'details', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-brand-500 transition-all outline-none font-medium text-sm"
                              />
                           </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between group cursor-help transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
                           <div className="flex items-center gap-3">
                              <HelpCircle className="w-4 h-4 text-brand-600" />
                              <p className="text-[10px] font-black uppercase text-slate-500">{cat.searchPrompt}</p>
                           </div>
                           <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-brand-600" />
                        </div>
                     </div>
                   ))}
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-6 text-xl font-black flex items-center justify-center gap-4 group shadow-2xl shadow-brand-600/20"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Verify Research Accuracy
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-12"
              >
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/40 rounded-[2.5rem] flex items-center justify-center text-emerald-600 mx-auto">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic underline decoration-brand-600 underline-offset-8">Research Logged</h2>
                  <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto">
                    Your market findings have been reconciled with your budget. The simulation will now process these rates monthly.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] space-y-2 border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accuracy Grade</p>
                    <p className="text-4xl font-black text-brand-600">{calculatedScore}%</p>
                  </div>
                  <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] space-y-2 border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Committed</p>
                    <p className="text-4xl font-black text-red-500">${currentTotal}</p>
                  </div>
                  <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] space-y-2 border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Reality</p>
                    <p className={`text-4xl font-black ${calculatedScore > 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                       {calculatedScore > 70 ? 'Realistic' : 'Outlier'}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleFinalize}
                  className="w-full max-w-md btn-primary py-6 text-xl font-black"
                >
                  Commit to Simulation
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
