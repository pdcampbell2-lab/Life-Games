"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, 
  Wifi, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Plus,
  Trash2,
  Info,
  DollarSign,
  Signal
} from 'lucide-react';

interface PhoneOption {
  id: string;
  provider: string;
  planName: string;
  cost: string;
  data: string;
  features: string;
}

const PROVIDER_METADATA: Record<string, { tier: 'premium' | 'budget'; quality: number }> = {
  'Bell': { tier: 'premium', quality: 95 },
  'Rogers': { tier: 'premium', quality: 92 },
  'Telus': { tier: 'premium', quality: 94 },
  'Fido': { tier: 'budget', quality: 75 },
  'Freedom Mobile': { tier: 'budget', quality: 65 },
  'Freedom': { tier: 'budget', quality: 65 },
};

interface CellPhoneChallengeProps {
  onComplete: (data: { cell_phone: number; planDetail: string; planQuality: number }, score: number) => void;
  currentLeftover: number;
  blueprint?: any;
}

export default function CellPhoneChallenge({ onComplete, currentLeftover, blueprint }: CellPhoneChallengeProps) {
  const [options, setOptions] = useState<PhoneOption[]>([
    { id: '1', provider: '', planName: '', cost: '', data: '', features: '' }
  ]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalFeedback, setFinalFeedback] = useState("");

  const addOption = () => {
    if (options.length < 3) {
      setOptions([...options, { id: Date.now().toString(), provider: '', planName: '', cost: '', data: '', features: '' }]);
    }
  };

  const removeOption = (id: string) => {
    if (options.length > 1) {
      setOptions(options.filter(o => o.id !== id));
      if (selectedOptionId === id) setSelectedOptionId(null);
    }
  };

  const handleChange = (id: string, field: keyof PhoneOption, value: string) => {
    setOptions(options.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const validate = () => {
    for (const opt of options) {
      if (!opt.provider) return { valid: false, msg: "Please enter provider names for all options." };
      const cost = parseFloat(opt.cost);
      const data = parseFloat(opt.data);
      if (isNaN(cost) || cost < 40 || cost > 150) return { valid: false, msg: `Cost for ${opt.provider} plan must be between $40-$150.` };
      if (isNaN(data) || data < 5 || data > 100) return { valid: false, msg: `Data for ${opt.provider} plan must be between 5GB-100GB.` };
    }
    if (!selectedOptionId) return { valid: false, msg: "Please select one plan as your final choice." };
    return { valid: true };
  };

  const calculateScore = (selected: PhoneOption) => {
    const cost = parseFloat(selected.cost);
    const data = parseFloat(selected.data);
    const meta = PROVIDER_METADATA[selected.provider] || { tier: 'budget', quality: 50 };
    
    // Value = Data / Cost ratio
    const valueRatio = data / cost; 
    
    let score = 0;
    // Realism Score (40 points) - Staying in sweet spot
    if (cost >= 50 && cost <= 90) score += 40;
    else score += 20;

    // Value Bonus (60 points) - weighted by meta quality
    const valueBase = valueRatio > 0.8 ? 60 : valueRatio > 0.4 ? 40 : 20;
    score += (valueBase * (meta.quality / 100));

    return Math.round(score);
  };

  const handleSubmit = () => {
    const v = validate();
    if (!v.valid) {
      alert(v.msg);
      return;
    }

    const selected = options.find(o => o.id === selectedOptionId)!;
    setIsSubmitting(true);
    const score = calculateScore(selected);
    setFinalScore(score);

    // Generate psychographic feedback
    const meta = PROVIDER_METADATA[selected.provider] || { tier: 'budget', quality: 50 };
    const cost = parseFloat(selected.cost);
    if (meta.tier === 'premium' && cost > 100) setFinalFeedback("You chose a premium provider at a higher cost for maximum reliability.");
    else if (meta.tier === 'budget' && cost < 60) setFinalFeedback("You chose a budget-friendly option to maximize your monthly savings.");
    else setFinalFeedback("Your plan provides a strong balance between cost and data connectivity.");

    setTimeout(() => {
      setIsConfirmed(true);
      setIsSubmitting(false);
    }, 1200);
  };

  const handleFinalize = () => {
    const selected = options.find(o => o.id === selectedOptionId)!;
    const meta = PROVIDER_METADATA[selected.provider] || { tier: 'budget', quality: 50 };
    onComplete({
      cell_phone: parseFloat(selected.cost),
      planDetail: `${selected.provider} - ${selected.data}GB Plan`,
      planQuality: meta.quality
    }, finalScore);
  };

  const selectedOption = options.find(o => o.id === selectedOptionId);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-6xl w-full bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Info */}
        <div className="lg:w-80 bg-brand-600 p-10 text-white space-y-8">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Smartphone className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black uppercase tracking-tight">Challenge #2</h3>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Mobile Connectivity</p>
          </div>
          <p className="text-sm font-medium leading-relaxed opacity-90 italic">
            "Your phone is your lifeline, but data isn't cheap. Compare plans to find the bridge between 'Unlimited 5G' and 'Broke by Wednesday'."
          </p>
          
          <div className="space-y-4 pt-6 border-t border-white/20">
             <div className="flex items-center gap-3">
                <Info className="w-5 h-5 opacity-70" />
                <p className="text-[10px] font-black uppercase tracking-widest">Validation Rules</p>
             </div>
             <p className="text-xs font-bold leading-relaxed px-2">
               • Cost: $40 - $150<br/>
               • Data: 5GB - 100GB<br/>
               • Provider Required
             </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 md:p-12 relative overflow-y-auto max-h-[85vh]">
          <AnimatePresence mode="wait">
            {!isConfirmed ? (
              <motion.div 
                key="comparison"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-10"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Plan Comparison</h2>
                    <p className="text-slate-500 font-medium">Research up to 3 options and select your final path.</p>
                  </div>
                  {options.length < 3 && (
                    <button 
                      onClick={addOption}
                      className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 transition-all rounded-2xl text-xs font-black uppercase tracking-widest"
                    >
                      <Plus className="w-4 h-4" />
                      Add Plan
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {options.map((opt, index) => (
                    <div 
                      key={opt.id}
                      className={`relative p-8 rounded-[2.5rem] border-2 transition-all group ${selectedOptionId === opt.id ? 'border-brand-500 bg-brand-50/10' : 'border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/20'}`}
                    >
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">
                        {index + 1}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Provider</label>
                          <input 
                            placeholder="Enter Company Name..."
                            value={opt.provider}
                            onChange={(e) => handleChange(opt.id, 'provider', e.target.value)}
                            className="w-full bg-transparent border-b-2 border-slate-200 dark:border-white/10 py-1 font-black text-slate-900 dark:text-white focus:border-brand-500 transition-colors outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Cost ($)</label>
                          <input 
                            type="number"
                            placeholder="40-150"
                            value={opt.cost}
                            onChange={(e) => handleChange(opt.id, 'cost', e.target.value)}
                            className="w-full bg-transparent border-b-2 border-slate-200 dark:border-white/10 py-1 font-black text-slate-900 dark:text-white focus:border-brand-500 transition-colors outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data (GB)</label>
                          <input 
                            type="number"
                            placeholder="5-100"
                            value={opt.data}
                            onChange={(e) => handleChange(opt.id, 'data', e.target.value)}
                            className="w-full bg-transparent border-b-2 border-slate-200 dark:border-white/10 py-1 font-black text-slate-900 dark:text-white focus:border-brand-500 transition-colors outline-none"
                          />
                        </div>
                        <div className="flex items-end justify-between">
                          <button 
                            onClick={() => setSelectedOptionId(opt.id)}
                            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedOptionId === opt.id ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-white/5'}`}
                          >
                            {selectedOptionId === opt.id ? 'Selected' : 'Select This Plan'}
                          </button>
                          {options.length > 1 && (
                            <button 
                              onClick={() => removeOption(opt.id)}
                              className="w-10 h-10 ml-2 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Monthly Impact</p>
                         <p className="text-2xl font-black text-red-500">
                           -${selectedOption ? parseFloat(selectedOption.cost || '0').toLocaleString() : '0'}
                         </p>
                      </div>
                      <div className="h-10 w-px bg-slate-100 dark:bg-white/5"></div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Value Score</p>
                         <p className="text-2xl font-black text-brand-600">
                           {selectedOption ? (parseFloat(selectedOption.data || '0') / parseFloat(selectedOption.cost || '1')).toFixed(2) : '0.00'} 
                           <span className="text-xs opacity-50 ml-1">GB/$</span>
                         </p>
                      </div>
                   </div>

                   <button 
                     disabled={!selectedOptionId || isSubmitting}
                     onClick={handleSubmit}
                     className="px-10 py-5 bg-brand-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-xl shadow-brand-600/20"
                   >
                     {isSubmitting ? 'Verifying...' : 'Finalize Selection'}
                     <ArrowRight className="w-5 h-5" />
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
                   <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight italic">Provisioned!</h2>
                   <p className="text-xl text-slate-900 dark:text-white font-black max-w-lg mx-auto leading-tight">
                     {finalFeedback}
                   </p>
                   <p className="text-sm text-slate-500 font-medium">
                     Your mobile connectivity has been established with {selectedOption?.provider}.
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                   <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] space-y-2 border border-slate-100 dark:border-white/5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-emerald-500 flex items-center justify-center gap-2">
                        <Signal className="w-3 h-3" />
                        Network Quality
                      </p>
                      <p className="text-4xl font-black text-slate-900 dark:text-white">
                        {(PROVIDER_METADATA[selectedOption?.provider || '']?.tier === 'premium') ? 'Premium' : 'Basic'}
                      </p>
                   </div>
                   <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] space-y-2 border border-slate-100 dark:border-white/5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-brand-600 flex items-center justify-center gap-2">
                        <BarChart3 className="w-3 h-3" />
                        Value Grade
                      </p>
                      <p className="text-4xl font-black text-slate-900 dark:text-white">{finalScore > 80 ? 'Elite' : finalScore > 50 ? 'Smart' : 'Basic'}</p>
                   </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleFinalize}
                    className="w-full max-w-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-6 text-xl font-black rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
                  >
                    Lock In Selection
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
