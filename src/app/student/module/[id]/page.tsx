"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_GAME_DATA } from '@/data/games';
import { MOCK_PROFILES } from '@/data/profiles';
import { 
  ArrowLeft, 
  ChevronRight, 
  Award, 
  Wallet,
  CheckCircle2, 
  Info,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { PERSONA_SCENARIOS } from '@/data/persona_scenarios';

export default function GameModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.id as string;
  
  // 1. State Declarations First
  const [profile, setProfile] = useState<any>(null);
  const [module, setModule] = useState<any>(null);
  const [currentScenarioId, setCurrentScenarioId] = useState('start');
  const [balance, setBalance] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<any>(null);
  const [showConsequence, setShowConsequence] = useState(false);
  const [score, setScore] = useState(85); 
  const [isCompleted, setIsCompleted] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState<{ id: string, label: string, amount: number }[]>([]);

  // 2. Effects
  React.useEffect(() => {
    const savedId = localStorage.getItem('selected_profile_id') || '1';
    const foundProfile = MOCK_PROFILES.find(p => p.id === savedId) || MOCK_PROFILES[0];
    setProfile(foundProfile);

    // Merge generic scenarios with persona-specific ones
    const baseModule = MOCK_GAME_DATA[moduleId];
    if (baseModule) {
      const personaScenarios = PERSONA_SCENARIOS[savedId] || [];
      const mergedScenarios = [...baseModule.scenarios, ...personaScenarios];
      setModule({ ...baseModule, scenarios: mergedScenarios });
      
      // Auto-set the first scenario if we are at the start
      if (currentScenarioId === 'start' && mergedScenarios.length > 0) {
        setCurrentScenarioId(mergedScenarios[0].id);
      }
    }
  }, [moduleId, currentScenarioId]);

  // Initialize balance once profile is loaded
  React.useEffect(() => {
    if (profile) setBalance(profile.initial_savings);
  }, [profile]);

  const scenario = module?.scenarios?.find((s:any) => s.id === currentScenarioId);

  // 1. Loading State
  if (!profile || !module) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold animate-pulse">Initializing Personal Simulation...</p>
      </div>
    );
  }

  // 2. Real Not Found State
  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Scenario not found</h2>
          <Link href="/student/dashboard" className="text-brand-600 font-bold">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const handleChoiceSelect = (choice: any) => {
    setSelectedChoice(choice);
    setShowConsequence(true);
    // Update balance: only if it's a monetary cost (negative score_delta doesn't always mean money)
    const cost = choice.text.includes('$') ? parseInt(choice.text.match(/\$(\d+)/)?.[1] || '0') : 0;
    if (cost > 0) setBalance(prev => prev - cost);
    
    setScore(prev => prev + choice.score_delta);
    setTransactionHistory(prev => [
      { id: Math.random().toString(), label: choice.text, amount: cost > 0 ? -cost : choice.score_delta },
      ...prev
    ]);
  };

  const handleContinue = () => {
    if (selectedChoice.next_scenario_id === 'end') {
      setIsCompleted(true);
      setShowConsequence(false);
    } else {
      setCurrentScenarioId(selectedChoice.next_scenario_id);
      setSelectedChoice(null);
      setShowConsequence(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Simulation Header */}
      <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/student/dashboard')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white leading-tight">{module.title}</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Life Balance Simulation</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={`hidden md:flex items-center gap-3 px-6 py-2.5 rounded-2xl border ${balance >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
            <Wallet className={`w-5 h-5 ${balance >= 0 ? 'text-emerald-600' : 'text-red-500'}`} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Account Balance</p>
              <p className={`text-xl font-black ${balance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>${balance.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 @container">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div 
              key={currentScenarioId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-200 dark:border-slate-800 p-8 md:p-14 space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-brand-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-600/20">
                      Scenario Event
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                    {scenario.prompt}
                  </h2>
                </div>

                <div className="grid gap-4">
                  {scenario.choices.map((choice: any, idx: number) => (
                    <button
                      key={choice.id}
                      disabled={showConsequence}
                      onClick={() => handleChoiceSelect(choice)}
                      className={`group relative flex items-center p-6 rounded-[1.5rem] border-2 transition-all duration-300 text-left ${
                        selectedChoice?.id === choice.id 
                          ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-900/10' 
                          : 'border-slate-100 dark:border-slate-800 hover:border-brand-300 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg mr-5 transition-colors ${
                        selectedChoice?.id === choice.id ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className={`flex-1 text-lg font-bold leading-tight ${
                        selectedChoice?.id === choice.id ? 'text-brand-900 dark:text-brand-100' : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {choice.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl text-center space-y-10"
            >
              <div className="h-40 w-40 bg-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl rotate-3">
                < Award className="w-20 h-20 text-white" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Month Complete</h2>
                <p className="text-xl text-slate-500 font-medium max-w-md mx-auto leading-relaxed">You've successfully managed your finances through these monthly events.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                 <div className="text-left space-y-1">
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Ending Balance</p>
                   <p className={`text-4xl font-black ${balance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>${balance.toLocaleString()}</p>
                 </div>
                 <div className="text-left space-y-1 border-x border-slate-100 dark:border-slate-800 px-6">
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Controlled Debt</p>
                   <p className="text-4xl font-black text-slate-900 dark:text-white">GOOD</p>
                 </div>
                 <div className="text-left space-y-1 pl-4">
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Decision Score</p>
                   <p className="text-4xl font-black text-brand-600">A+</p>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => router.push('/student/dashboard')}
                  className="flex-1 btn-primary py-5 text-lg"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Impact Overlay */}
      <AnimatePresence>
        {showConsequence && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative"
            >
              <div className="p-10 space-y-8">
                <div className="flex items-start justify-between">
                  <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center ${selectedChoice.score_delta > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {selectedChoice.score_delta > 0 ? <ArrowUpRight className="w-8 h-8" /> : <ArrowDownRight className="w-8 h-8" />}
                  </div>
                  <div className={`px-6 py-2 rounded-2xl font-black text-lg ${selectedChoice.score_delta > 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {selectedChoice.score_delta > 0 ? '+' : ''}${selectedChoice.score_delta.toLocaleString()}
                  </div>
                </div>

                <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">The Consequence</h3>
                  <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    {selectedChoice.consequence}
                  </p>
                </div>

                <div className="p-8 bg-brand-50 dark:bg-brand-900/20 rounded-[2rem] border-2 border-brand-100 dark:border-brand-800 space-y-4">
                  <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-black uppercase tracking-widest text-[10px]">
                    <Target className="w-4 h-4" />
                    Real-World Logic
                  </div>
                  <p className="text-sm text-brand-900 dark:text-brand-200 font-semibold leading-relaxed italic">
                    "{selectedChoice.logic || 'Every decision you make reflects a priority. Managing life responsibly means balancing today\'s comfort with tomorrow\'s security.'}"
                  </p>
                </div>

                <div className="pt-4">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">Reflective Prompt</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {selectedChoice.reflection || 'How might this choice change your plans for next month?'}
                  </p>
                </div>
              </div>

                <button 
                  onClick={handleContinue}
                  className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-2"
                >
                  Continue Simulation
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
