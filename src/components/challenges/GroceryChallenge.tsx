"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UtensilsCrossed, 
  ShoppingCart, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Apple,
  Clock,
  Beef,
  Leaf,
  Layers,
  Calculator,
  AlertTriangle
} from 'lucide-react';

interface GroceryItem {
  id: string;
  name: string;
  qty: string;
  price: string;
}

interface GroceryChallengeProps {
  onComplete: (data: any, score: number) => void;
  householdSize: number;
}

export default function GroceryChallenge({ onComplete, householdSize }: GroceryChallengeProps) {
  const [step, setStep] = useState(1);
  const [meals, setMeals] = useState({
    breakfast: ['', '', '', '', ''],
    lunch: ['', '', '', '', ''],
    dinner: ['', '', '', '', ''],
    snacks: ''
  });
  const [items, setItems] = useState<GroceryItem[]>([
    { id: '1', name: '', qty: '1', price: '' },
    { id: '2', name: '', qty: '1', price: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), name: '', qty: '1', price: '' }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof GroceryItem, value: string) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const [flyerItems] = useState([
    { name: 'Fresh Produce', discount: 0.15, msg: 'Market Special' },
    { name: 'Pantry Staple', discount: 0.1, msg: 'Bulk Buy' }
  ]);

  const weeklyTotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const q = parseFloat(item.qty) || 0;
      const p = parseFloat(item.price) || 0;
      const flyerMatch = flyerItems.find(f => item.name.toLowerCase().includes(f.name.toLowerCase()));
      const finalPrice = flyerMatch ? p * (1 - flyerMatch.discount) : p;
      return sum + (q * finalPrice);
    }, 0);
  }, [items, flyerItems]);

  const monthlyTotal = weeklyTotal * 4;

  const validate = () => {
    if (step === 1) {
      const allMeals = [...meals.breakfast, ...meals.lunch, ...meals.dinner];
      if (allMeals.some(m => !m)) return { valid: false, msg: "Please fill out all 15 core meals." };
      return { valid: true };
    } else {
      if (items.length < 10) return { valid: false, msg: "Please include at least 10 items in your grocery list." };
      if (items.some(i => !i.name || !i.price)) return { valid: false, msg: "All items must have a name and price." };
      
      const minWeekly = 60 * householdSize;
      if (weeklyTotal < minWeekly) return { valid: false, msg: `Weekly total of $${weeklyTotal.toFixed(0)} is unrealistically low for a family of ${householdSize}. Budget at least $${minWeekly}.` };
      
      return { valid: true };
    }
  };

  const calculateHealthScore = () => {
    const text = (Object.values(meals).flat().join(' ') + items.map(i => i.name).join(' ')).toLowerCase();
    
    const categories = {
      protein: ['chicken', 'beef', 'fish', 'egg', 'tofu', 'beans', 'turkey'],
      greens: ['spinach', 'broccoli', 'salad', 'kale', 'lettuce', 'cucumber', 'vegetable'],
      grains: ['rice', 'bread', 'oats', 'pasta', 'quinoa', 'cereal'],
      junk: ['chips', 'soda', 'candy', 'cookie', 'pizza', 'burger', 'pop', 'fry']
    };

    let score = 60;
    let foundCategories = 0;

    if (categories.protein.some(w => text.includes(w))) { score += 10; foundCategories++; }
    if (categories.greens.some(w => text.includes(w))) { score += 15; foundCategories++; }
    if (categories.grains.some(w => text.includes(w))) { score += 5; foundCategories++; }
    
    // Variety bonus
    if (foundCategories === 3) score += 10;
    
    // Junk penalty
    categories.junk.forEach(w => { if (text.includes(w)) score -= 5; });
    
    return Math.min(100, Math.max(0, score));
  };

  const wasteIndex = useMemo(() => {
    // If they have > 20 items for a small family, waste risk goes up
    const ratio = items.length / (householdSize * 5);
    return Math.min(100, Math.max(0, ratio * 20));
  }, [items, householdSize]);

  const handleNext = () => {
    const v = validate();
    if (v.valid) setStep(2);
    else alert(v.msg);
  };

  const handleSubmit = () => {
    const v = validate();
    if (!v.valid) {
      alert(v.msg);
      return;
    }

    setIsSubmitting(true);
    const score = calculateHealthScore();
    setFinalScore(score);

    setTimeout(() => {
       setIsConfirmed(true);
       setIsSubmitting(false);
    }, 1500);
  };

  const handleFinalize = () => {
    const data = {
      living_groceries: monthlyTotal,
      meta: {
        nutritionScore: finalScore,
        mealComplexity: 'standard',
        weeklyGroceryBill: weeklyTotal,
        groceryWasteRisk: wasteIndex,
        inflationSensitivity: items.filter(i => ['meat', 'milk', 'egg'].some(s => i.name.toLowerCase().includes(s))).length / items.length
      }
    };
    onComplete(data, finalScore);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-6xl w-full bg-white dark:bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5"
    >
      <div className="flex flex-col lg:flex-row min-h-[750px] lg:h-[800px]">
        {/* Sidebar */}
        <div className="lg:w-80 bg-brand-950 p-10 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="relative space-y-12">
              <div className="space-y-4">
                 <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950">
                    <UtensilsCrossed className="w-7 h-7" />
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-tight italic">Provision Lab</h3>
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Challenge #9 (Nutrition)</p>
              </div>

              <div className="space-y-6">
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Monthly Grocery Reserve</p>
                       <p className="text-4xl font-black text-white italic">${monthlyTotal.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                       <Calculator className="w-4 h-4 text-emerald-500" />
                       <span>For {householdSize} People</span>
                    </div>
                 </div>

                 {/* WEEKLY DEALS */}
                 <div className="py-4 space-y-3">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Weekly Deals</p>
                    <div className="space-y-2">
                       {flyerItems.map(f => (
                         <div key={f.name} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-[9px] font-bold text-slate-300">{f.name}</span>
                            <span className="text-[8px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">{f.msg}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* WASTE RISK */}
                 <div className="py-4 space-y-3 border-t border-white/10">
                    <div className="flex justify-between items-end">
                       <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Waste Risk</p>
                       <span className="text-[10px] font-black text-white italic">{wasteIndex.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${wasteIndex}%` }}
                         className={`h-full ${wasteIndex > 40 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                       />
                    </div>
                 </div>
              </div>
           </div>

           <div className="relative pt-8 border-t border-white/10 italic text-[10px] text-slate-500 leading-relaxed">
             "Meal planning is a financial strategy disguised as domestic duty."
           </div>
        </div>

        {/* Main Interface */}
        <div className="flex-1 p-8 lg:p-14 overflow-y-auto">
           <AnimatePresence mode="wait">
              {!isConfirmed ? (
                <motion.div 
                   key={step}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-12"
                >
                   {step === 1 ? (
                     <div className="space-y-10">
                        <div className="space-y-2">
                           <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase underline decoration-emerald-500/30">Meal Architect</h2>
                           <p className="text-slate-500 font-medium">Plan your household survival menu for the next 7 days.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           {['breakfast', 'lunch', 'dinner'].map((type) => (
                             <div key={type} className="space-y-4 p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem]">
                                <div className="flex items-center gap-2 mb-2 text-emerald-600">
                                   {type === 'breakfast' && <Apple className="w-4 h-4" />}
                                   {type === 'lunch' && <Layers className="w-4 h-4" />}
                                   {type === 'dinner' && <Beef className="w-4 h-4" />}
                                   <label className="text-[10px] font-black uppercase tracking-widest">{type}</label>
                                </div>
                                {(meals as any)[type].map((m: string, i: number) => (
                                   <input 
                                     key={i}
                                     placeholder={`Meal Day ${i+1}`}
                                     value={m}
                                     onChange={(e) => {
                                       const newType = [...(meals as any)[type]];
                                       newType[i] = e.target.value;
                                       setMeals({...meals, [type]: newType});
                                     }}
                                     className="w-full bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-xs font-bold outline-none border border-slate-100 dark:border-white/5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                                   />
                                ))}
                             </div>
                           ))}
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-2">Snacks (Free Form)</label>
                           <textarea 
                             rows={2}
                             value={meals.snacks}
                             onChange={(e) => setMeals({...meals, snacks: e.target.value})}
                             placeholder="Fruit, nuts, yogurt, etc."
                             className="w-full bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 text-sm font-medium outline-none border border-slate-100 dark:border-white/5"
                           />
                        </div>

                        <button 
                           onClick={handleNext}
                           className="w-full btn-primary py-7 text-2xl font-black rounded-3xl flex items-center justify-center gap-4 group"
                        >
                           Build My Cart
                           <ShoppingCart className="w-8 h-8 group-hover:scale-110 transition-transform" />
                        </button>
                     </div>
                   ) : (
                     <div className="space-y-10">
                        <div className="flex justify-between items-end">
                           <div className="space-y-2">
                              <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase underline decoration-emerald-500/30">The Digital Cart</h2>
                              <p className="text-slate-500 font-medium font-black italic">Research current prices and fill your weekly supply.</p>
                           </div>
                           <button 
                             onClick={addItem}
                             className="flex items-center gap-2 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-200 transition-colors"
                           >
                              <Plus className="w-4 h-4" /> Add Item
                           </button>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-white/5 overflow-hidden">
                           <div className="grid grid-cols-12 p-6 border-b border-slate-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                              <div className="col-span-6">Item Name</div>
                              <div className="col-span-2 text-center">Qty</div>
                              <div className="col-span-2 text-center">$/Unit</div>
                              <div className="col-span-2 text-right italic">Total</div>
                           </div>
                           <div className="max-h-[350px] overflow-y-auto scrollbar-hide">
                              {items.map((item) => (
                                 <div key={item.id} className="grid grid-cols-12 p-6 items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                    <div className="col-span-6">
                                       <input 
                                         value={item.name}
                                         onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                         placeholder="e.g. 1kg Chicken"
                                         className="w-full bg-transparent font-black text-slate-900 dark:text-white outline-none"
                                       />
                                    </div>
                                    <div className="col-span-2 text-center">
                                       <input 
                                         type="number"
                                         value={item.qty}
                                         onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                                         className="w-12 mx-auto bg-slate-100 dark:bg-slate-900 rounded-lg p-2 text-center text-xs font-bold outline-none"
                                       />
                                    </div>
                                    <div className="col-span-2 text-center flex items-center justify-center gap-1">
                                       <span className="text-slate-400 text-xs">$</span>
                                       <input 
                                         type="number"
                                         value={item.price}
                                         onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                                         className="w-16 bg-slate-100 dark:bg-slate-900 rounded-lg p-2 text-center text-xs font-bold outline-none"
                                       />
                                    </div>
                                    <div className="col-span-2 flex items-center justify-between">
                                       <span className="font-black italic text-emerald-600">${( (parseFloat(item.qty)||0) * (parseFloat(item.price)||0) ).toFixed(2)}</span>
                                       <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                                          <Trash2 className="w-4 h-4" />
                                       </button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                           <div className="p-8 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                              <span className="text-xs font-black uppercase text-slate-400">Weekly Total</span>
                              <span className="text-4xl font-black italic text-slate-900 dark:text-white tracking-tighter">${weeklyTotal.toFixed(2)}</span>
                           </div>
                        </div>

                        <div className="flex gap-4">
                           <button 
                             onClick={() => setStep(1)}
                             className="px-10 py-7 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-black text-[10px] uppercase tracking-widest"
                           >
                              Back To Meals
                           </button>
                           <button 
                              onClick={handleSubmit}
                              disabled={isSubmitting}
                              className="flex-1 btn-primary py-7 text-2xl font-black rounded-3xl flex items-center justify-center gap-4 group"
                           >
                              {isSubmitting ? 'Validating Nutrition...' : 'Finalize Grocery Strategy'}
                              <CheckCircle2 className="w-8 h-8" />
                           </button>
                        </div>
                     </div>
                   )}
                </motion.div>
              ) : (
                <motion.div 
                   key="success"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-center py-12 space-y-12"
                >
                   <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-950/30 rounded-[2.5rem] flex items-center justify-center text-emerald-600 mx-auto">
                      <Apple className="w-12 h-12" />
                   </div>

                   <div className="space-y-4">
                      <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic">Pantry Stocked.</h2>
                      <p className="text-xl text-slate-500 font-medium max-w-sm mx-auto">
                        "Meal planning complete. Your monthly food budget is officially set."
                      </p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                      <div className="p-10 bg-slate-50 dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-white/5 space-y-2">
                         <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Nutrition Score</p>
                         <p className="text-6xl font-black text-slate-900 dark:text-white">{finalScore}<span className="text-xl text-slate-400">/100</span></p>
                      </div>
                      <div className="p-10 bg-slate-50 dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-white/5 space-y-2">
                         <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Strategy Impact</p>
                         <p className="text-4xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Budget Balanced</p>
                      </div>
                   </div>

                   <button 
                     onClick={handleFinalize}
                     className="w-full max-w-md btn-primary py-7 text-2xl font-black rounded-3xl"
                   >
                      Complete Monthly Planning
                   </button>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
