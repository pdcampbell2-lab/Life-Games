"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import { 
  Play, 
  ArrowRight,
  Wallet,
  Calendar,
  CreditCard,
  Briefcase,
  TrendingDown,
  ArrowUpRight,
  Plus,
  X,
  Users,
  Car,
  Heart,
  Zap,
  Home,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { MOCK_PROFILES } from '@/data/profiles';
import { useSimulation } from '@/hooks/useSimulation';
import ResearchChallenge from '@/components/challenges/ResearchChallenge';
import CellPhoneChallenge from '@/components/challenges/CellPhoneChallenge';
import HousingChallenge from '@/components/challenges/HousingChallenge';
import UtilityCostsChallenge from '@/components/challenges/UtilityCostsChallenge';
import VehicleChallenge from '@/components/challenges/VehicleChallenge';
import InsuranceChallenge from '@/components/challenges/InsuranceChallenge';
import DrivingCostChallenge from '@/components/challenges/DrivingCostChallenge';
import CreditCardChallenge from '@/components/challenges/CreditCardChallenge';
import GroceryChallenge from '@/components/challenges/GroceryChallenge';
import ChildcareChallenge from '@/components/challenges/ChildcareChallenge';
import DateNightChallenge from '@/components/challenges/DateNightChallenge';

export default function StudentDashboard() {
  const [showJoinModal, setShowJoinModal] = React.useState(false);
  const [profile, setProfile] = React.useState(MOCK_PROFILES[0]);
  const [outcome, setOutcome] = React.useState<string | null>(null);
  
  // Simulation engine linked to the dynamic profile
  const { 
    state, 
    processDay, 
    finalChallenge, 
    applyFinalChoice,
    currentProfile,
    updateBudget,
    updateHousing,
    updateTransportation,
    updateMeta,
    completeChallenge,
    blueprints
  } = useSimulation(profile);

  // Find household partner if exists
  const partner = React.useMemo(() => {
    if (!currentProfile.household_id) return null;
    return MOCK_PROFILES.find(p => p.household_id === currentProfile.household_id && p.id !== currentProfile.id);
  }, [currentProfile]);

  React.useEffect(() => {
    const savedId = localStorage.getItem('selected_profile_id');
    if (savedId) {
      const found = MOCK_PROFILES.find(p => p.id === savedId);
      if (found) setProfile(found);
    }
  }, []);

  const payAmount = (currentProfile.budget.income_player_1 + (currentProfile.budget.income_player_2 || 0));

  // Determine if onboarding challenge should show
  // Challenge #1: Research (First week of simulation)
  const [isChallengeMinimized, setIsChallengeMinimized] = React.useState(false);

  const currentChallengeId = state.completed_challenges.length < 11 
    ? `challenge_${state.completed_challenges.length + 1}`
    : null;

  const showResearchChallenge = state.current_month === 9 && state.current_day <= 22 && !state.completed_challenges.includes('challenge_1') && !isChallengeMinimized;
  const showCellChallenge = state.current_month === 9 && state.current_day <= 22 && state.completed_challenges.includes('challenge_1') && !state.completed_challenges.includes('challenge_2') && !isChallengeMinimized;
  const showHousingChallenge = state.current_month === 9 && state.current_day <= 22 && state.completed_challenges.includes('challenge_2') && !state.completed_challenges.includes('challenge_3') && !isChallengeMinimized;
  const showUtilityChallenge = state.current_month === 9 && state.current_day <= 22 && state.completed_challenges.includes('challenge_3') && !state.completed_challenges.includes('challenge_4') && !isChallengeMinimized;
  const showVehicleChallenge = state.current_month === 9 && state.current_day <= 22 && state.completed_challenges.includes('challenge_4') && !state.completed_challenges.includes('challenge_5') && !isChallengeMinimized;
  const showInsuranceChallenge = state.current_month === 9 && state.current_day <= 22 && state.completed_challenges.includes('challenge_5') && !state.completed_challenges.includes('challenge_6') && !isChallengeMinimized;
  const showDrivingChallenge = state.current_month === 9 && state.current_day <= 22 && state.completed_challenges.includes('challenge_6') && !state.completed_challenges.includes('challenge_7') && !isChallengeMinimized;
  const showCreditChallenge = state.current_month === 9 && 
                              state.current_day <= 22 && 
                              state.completed_challenges.includes('challenge_7') &&
                              !state.completed_challenges.includes('challenge_8') &&
                              !isChallengeMinimized;

  const showGroceryChallenge = state.current_month === 9 && 
                               state.current_day <= 22 && 
                               state.completed_challenges.includes('challenge_8') &&
                               !state.completed_challenges.includes('challenge_9') &&
                               !isChallengeMinimized;

  const showChildcareChallenge = state.current_month === 9 && 
                                 state.current_day <= 22 && 
                                 state.completed_challenges.includes('challenge_9') &&
                                 !state.completed_challenges.includes('challenge_10') &&
                                 !isChallengeMinimized;

  const showDateChallenge = state.current_month === 9 && 
                            state.current_day <= 22 && 
                            state.completed_challenges.includes('challenge_10') &&
                            !state.completed_challenges.includes('challenge_11') &&
                            !isChallengeMinimized;

  const householdSize = 1 + (currentProfile.marital_status?.toLowerCase().includes('married') ? 1 : 0) + (currentProfile.children?.length || 0);
  const childrenCount = currentProfile.children?.length || 0;
  const isSingle = currentProfile.marital_status?.toLowerCase().includes('single');

  // Calendar view based on the current engine rules
  const schedule = [
    { day: 1, label: 'Housing Payment', amount: currentProfile.budget.housing.monthly_housing_payment, type: 'expense', icon: Home },
    { day: 8, label: 'Household Payday', amount: payAmount, type: 'income', icon: ArrowUpRight },
    { day: 15, label: 'Property Tax', amount: currentProfile.budget.housing.property_tax || 0, type: 'expense', icon: CreditCard },
    { day: 22, label: 'Household Payday', amount: payAmount, type: 'income', icon: ArrowUpRight },
  ].sort((a, b) => a.day - b.day);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* ONBOARDING RESEARCH CHALLENGE */}
      <AnimatePresence>
        {showResearchChallenge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <ResearchChallenge 
              onComplete={(data, score) => {
                const { meta, ...results } = data;
                updateMeta(meta);
                completeChallenge('challenge_1', data);
              }} 
              monthlyIncome={currentProfile.monthly_income}
              currentLeftover={state.current_balance}
              blueprint={blueprints['challenge_1']}
            />
            <button 
              onClick={() => setIsChallengeMinimized(true)}
              className="absolute top-8 right-8 z-[200] px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all flex items-center gap-2 group"
            >
               <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
               Minimize Research
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CELL PHONE RESEARCH CHALLENGE */}
      <AnimatePresence>
        {showCellChallenge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <CellPhoneChallenge 
              onComplete={(data) => {
                const { meta, ...budget } = data;
                updateBudget(budget);
                updateMeta(meta);
                completeChallenge('challenge_2', data);
              }} 
              monthlyIncome={currentProfile.monthly_income}
              currentLeftover={state.current_balance}
              blueprint={blueprints['challenge_2']}
            />
            <button 
              onClick={() => setIsChallengeMinimized(true)}
              className="absolute top-8 right-8 z-[200] px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all flex items-center gap-2 group"
            >
               <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
               Minimize Research
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HOUSING RESEARCH CHALLENGE */}
      <AnimatePresence>
        {showHousingChallenge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <HousingChallenge 
              onComplete={(data) => {
                const { meta, ...housing } = data;
                updateHousing(housing);
                updateMeta(meta);
                completeChallenge('challenge_3', data);
              }} 
              monthlyIncome={currentProfile.monthly_income}
              currentLeftover={state.current_balance}
              hasPartner={currentProfile.has_partner}
              blueprint={blueprints['challenge_3']}
            />
            <button 
              onClick={() => setIsChallengeMinimized(true)}
              className="absolute top-8 right-8 z-[200] px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all flex items-center gap-2 group"
            >
               <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
               Minimize Research
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UTILITY COSTS RESEARCH CHALLENGE */}
      <AnimatePresence>
        {showUtilityChallenge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <UtilityCostsChallenge 
              monthlyIncome={((currentProfile.budget.income_player_1 + (currentProfile.budget.income_player_2 || 0)) * 2)}
              homeValue={currentProfile.budget.housing.property_value || 0}
              onComplete={(data, score) => {
                updateBudget({
                  hydro: data.hydro,
                  gas: data.gas,
                  water: data.water
                });
                updateMeta({ utilityEfficiency: data.utilityEfficiency });
                completeChallenge('challenge_4', data);
              }} 
              blueprint={blueprints['challenge_4']}
            />
            <button 
              onClick={() => setIsChallengeMinimized(true)}
              className="absolute top-8 right-8 z-[200] px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all flex items-center gap-2 group"
            >
               <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
               Minimize Research
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VEHICLE RESEARCH CHALLENGE */}
      <AnimatePresence>
        {showVehicleChallenge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <VehicleChallenge 
              monthlyIncome={((currentProfile.budget.income_player_1 + (currentProfile.budget.income_player_2 || 0)) * 2)}
              onComplete={(data, score) => {
                const { meta, ...budget } = data;
                updateTransportation(budget);
                updateMeta(meta);
                completeChallenge('challenge_5', data);
              }} 
              blueprint={blueprints['challenge_5']}
            />
            <button 
              onClick={() => setIsChallengeMinimized(true)}
              className="absolute top-8 right-8 z-[200] px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all flex items-center gap-2 group"
            >
               <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
               Minimize Research
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INSURANCE RESEARCH CHALLENGE */}
      <AnimatePresence>
        {showInsuranceChallenge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <InsuranceChallenge 
              monthlyIncome={((currentProfile.budget.income_player_1 + (currentProfile.budget.income_player_2 || 0)) * 2)}
              vehicleDescription={currentProfile.meta?.carDescription || 'Current Vehicle'}
              onComplete={(data, score) => {
                const { meta, insurance } = data;
                updateTransportation({ insurance });
                updateMeta(meta);
                completeChallenge('challenge_6', data);
              }} 
              blueprint={blueprints['challenge_6']}
            />
            {/* GLOBAL MINIMIZE BUTTON */}
            <button 
              onClick={() => setIsChallengeMinimized(true)}
              className="absolute top-8 right-8 z-[200] px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all flex items-center gap-2 group"
            >
               <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
               Minimize Research
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DRIVING COST CALCULATION CHALLENGE */}
      <AnimatePresence>
        {showDrivingChallenge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <DrivingCostChallenge 
              monthlyIncome={((currentProfile.budget.income_player_1 + (currentProfile.budget.income_player_2 || 0)) * 2)}
              vehicleMeta={{
                year: parseInt(currentProfile.meta?.carDescription?.split(' ')[0] || '2020'),
                description: currentProfile.meta?.carDescription || 'Current Vehicle',
                engine: currentProfile.meta?.carEngine || 'gas'
              }}
              onComplete={(data, score) => {
                const { meta, ...budget } = data;
                updateTransportation(budget);
                updateMeta(meta);
                completeChallenge('challenge_7', data);
              }} 
              blueprint={blueprints['challenge_7']}
            />
            {/* GLOBAL MINIMIZE BUTTON */}
            <button 
              onClick={() => setIsChallengeMinimized(true)}
              className="absolute top-8 right-8 z-[200] px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all flex items-center gap-2 group"
            >
               <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
               Minimize Research
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREDIT CARD SELECTION CHALLENGE */}
      <AnimatePresence>
        {showCreditChallenge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-brand-950/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <CreditCardChallenge 
              monthlyIncome={((currentProfile.budget.income_player_1 + (currentProfile.budget.income_player_2 || 0)) * 2)}
              onComplete={(data, score) => {
                const { meta, card } = data;
                updateCreditCard(card);
                updateMeta(meta);
                completeChallenge('challenge_8', data);
              }} 
              blueprint={blueprints['challenge_8']}
            />
            {/* GLOBAL MINIMIZE BUTTON */}
            <button 
              onClick={() => setIsChallengeMinimized(true)}
              className="absolute top-8 right-8 z-[200] px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all flex items-center gap-2 group"
            >
               <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
               Minimize Research
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GROCERY & MEAL PLANNING CHALLENGE */}
      <AnimatePresence>
        {showGroceryChallenge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-brand-950/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <GroceryChallenge 
              householdSize={householdSize}
              onComplete={(data, score) => {
                const { meta, ...budget } = data;
                updateBudget(budget);
                updateMeta(meta);
                completeChallenge('challenge_9', data);
              }} 
              blueprint={blueprints['challenge_9']}
            />
            {/* GLOBAL MINIMIZE BUTTON */}
            <button 
              onClick={() => setIsChallengeMinimized(true)}
              className="absolute top-8 right-8 z-[200] px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all flex items-center gap-2 group"
            >
               <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
               Minimize Research
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHILDCARE & AFTER-SCHOOL CHALLENGE */}
      <AnimatePresence>
        {showChildcareChallenge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-indigo-950/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <ChildcareChallenge 
              children={currentProfile.children || []}
              monthlyIncome={((currentProfile.budget.income_player_1 + (currentProfile.budget.income_player_2 || 0)) * 2)}
              onComplete={(data, score) => {
                const { meta, ...budget } = data;
                updateBudget(budget);
                updateMeta(meta);
                completeChallenge('challenge_10', data);
              }} 
            />
            {/* GLOBAL MINIMIZE BUTTON */}
            <button 
              onClick={() => setIsChallengeMinimized(true)}
              className="absolute top-8 right-8 z-[200] px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all flex items-center gap-2 group"
            >
               <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
               Minimize Research
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DATE NIGHT CHALLENGE */}
      <AnimatePresence>
        {showDateChallenge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-rose-950/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <DateNightChallenge 
              isSingle={isSingle}
              onComplete={(data, score) => {
                const { amount, label, paymentMethod, meta } = data;
                manualTransaction(amount, label, paymentMethod);
                updateMeta(meta);
                completeChallenge('challenge_11', data);
              }} 
            />
            
            {/* GLOBAL MINIMIZE BUTTON */}
            <button 
              onClick={() => setIsChallengeMinimized(true)}
              className="absolute top-8 right-8 z-[200] px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all flex items-center gap-2 group"
            >
               <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
               Minimize Research
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINAL CHALLENGE OVERLAY */}
      <AnimatePresence>
        {finalChallenge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-3xl w-full bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-white/10"
            >
              <div className="p-12 space-y-8 text-center">
                <div className="space-y-4">
                  <span className="px-4 py-2 bg-brand-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-full">Final Life Challenge</span>
                  <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{finalChallenge.title}</h2>
                  <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{finalChallenge.description}</p>
                </div>

                <div className="grid gap-4">
                  {finalChallenge.choices.map((choice: any) => (
                    <button
                      key={choice.id}
                      onClick={() => setOutcome(applyFinalChoice(choice))}
                      className="group p-8 bg-slate-50 dark:bg-slate-800 hover:bg-brand-600 dark:hover:bg-brand-600 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] transition-all text-left flex items-start gap-6 w-full"
                    >
                      <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white/20 group-hover:text-white transition-colors">
                        <Star className="w-6 h-6" />
                      </div>
                      <div className="flex-1 text-left">
                         <p className="text-lg font-black text-slate-900 dark:text-white group-hover:text-white mb-1">{choice.text}</p>
                         <p className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-white/80">{choice.description}</p>
                      </div>
                      <div className="text-right">
                         <p className={`text-xl font-black ${choice.balance_impact >= 0 ? 'text-emerald-500' : 'text-red-500'} group-hover:text-white`}>
                           {choice.balance_impact >= 0 ? '+' : ''}${Math.abs(choice.balance_impact).toLocaleString()}
                         </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* OUTCOME OVERLAY */}
        {outcome && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[110] bg-brand-600 flex items-center justify-center p-6 text-white"
          >
            <div className="max-w-2xl text-center space-y-10">
               <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="space-y-4">
                  <Star className="w-20 h-20 mx-auto text-white fill-white opacity-50" />
                  <h2 className="text-6xl font-black tracking-tighter">The Outcome</h2>
                  <p className="text-2xl font-bold opacity-90">{outcome}</p>
               </motion.div>
               <button 
                onClick={() => window.location.reload()} 
                className="px-12 py-5 bg-white text-brand-600 rounded-full text-xl font-black shadow-2xl hover:scale-105 transition-transform"
               >
                 Simulation Complete
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-10">
      {/* TOP NOTIFICATIONS / MISSION CONTROL */}
      <AnimatePresence>
        {isChallengeMinimized && currentChallengeId && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="sticky top-[64px] left-0 right-0 z-[140] px-6 py-2"
          >
            <div className="max-w-7xl mx-auto">
              <div className="bg-brand-600 rounded-2xl p-4 flex items-center justify-between text-white shadow-2xl shadow-brand-600/40 relative overflow-hidden group border border-white/20">
                 <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="flex items-center gap-4 relative">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
                       <Play className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                       <p className="text-[8px] font-black uppercase tracking-widest opacity-80">Mission Minimized</p>
                       <p className="text-xl font-black italic tracking-tight uppercase leading-tight">
                         {currentChallengeId.replace('challenge_', 'Challenge #')} 
                         <span className="ml-2 opacity-50 font-medium normal-case tracking-normal">In Progress</span>
                       </p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setIsChallengeMinimized(false)}
                   className="px-6 py-3 bg-white text-brand-600 rounded-xl text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl relative z-20"
                 >
                    Resume Challenge
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        {/* Academic Year Progress */}
        <section className="space-y-4">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Calendar className="w-5 h-5 text-brand-600" />
                 <span className="text-xs font-black uppercase tracking-widest text-slate-500">School Year Progress</span>
              </div>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {(() => {
                  const months = ["Sept", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "June"];
                  const idx = (state.current_month >= 9 ? state.current_month - 9 : state.current_month + 3);
                  return months[idx] || "June";
                })()} {state.current_year}
              </span>
           </div>
           <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((state.current_month >= 9 ? state.current_month - 9 : state.current_month + 3) / 9) * 100}%` }}
                className="h-full bg-brand-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.3)]"
              />
           </div>
        </section>

        {/* Profile & Status Header */}
        <section className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-2">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Financial Life Simulator</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Navigating the {state.current_month === 9 ? 'start' : 'middle'} of the academic year.</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-emerald-500 text-white p-6 rounded-[2rem] shadow-xl shadow-emerald-500/20 flex items-center gap-6 min-w-[320px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-white/20 transition-all"></div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center relative z-10">
                <Wallet className="w-8 h-8" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{profile.bank_name}</p>
                  <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80 capitalize">{profile.balance_type.replace('_', ' ')}</p>
                </div>
                <p className="text-4xl font-black tracking-tighter">${state.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Property Portfolio - GTA Market Data */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-500">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Housing Type</p>
                <p className="text-sm font-black text-slate-900 dark:text-white capitalize">{profile.housing_type.replace('_', ' ')}</p>
              </div>
           </div>

           {profile.budget.housing.housing_cost_type === 'mortgage' ? (
             <>
               <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Property Value</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white line-clamp-1">${profile.budget.housing.property_value?.toLocaleString()}</p>
               </div>
               <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Mortgage Principal</p>
                  <p className="text-2xl font-black text-red-500 line-clamp-1">${profile.budget.housing.mortgage_amount?.toLocaleString()}</p>
               </div>
               <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Interest Rate</p>
                  <p className="text-2xl font-black text-brand-600">{(profile.budget.housing.interest_rate! * 100).toFixed(2)}%</p>
               </div>
             </>
           ) : (
             <div className="col-span-3 bg-indigo-600 p-8 rounded-[2.5rem] text-white flex items-center justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="space-y-1 relative z-10">
                  <h3 className="text-2xl font-black">Monthly Rental Unit</h3>
                  <p className="text-indigo-100 font-medium">You are currently renting your primary residence.</p>
                </div>
                <div className="text-right relative z-10">
                  <p className="text-xs font-black uppercase tracking-widest opacity-70">Monthly Lease</p>
                  <p className="text-4xl font-black">${profile.budget.housing.monthly_housing_payment.toLocaleString()}</p>
                </div>
             </div>
           )}
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Simulation View */}
          <section className="lg:col-span-2 space-y-8">
            {/* Monthly Timeline Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-brand-600" />
                  Monthly Calendar
                </h3>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  {(() => {
                    const months = ["September", "October", "November", "December", "January", "February", "March", "April", "May", "June"];
                    const idx = (state.current_month >= 9 ? state.current_month - 9 : state.current_month + 3);
                    return months[idx] || "June";
                  })()} {state.current_year}
                </span>
              </div>

              <div className="relative pt-4 overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-[600px]">
                  {schedule.map((event, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`flex-1 min-w-[140px] p-6 rounded-[2rem] border-2 flex flex-col items-center text-center gap-3 ${
                        event.type === 'income' 
                        ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800' 
                        : 'bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800'
                      }`}
                    >
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Day {event.day}</span>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${event.type === 'income' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        <event.icon className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight min-h-[32px]">{event.label}</p>
                      <p className={`text-sm font-black ${event.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                        {event.type === 'income' ? '+' : '-'}${event.amount.toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulation Controls */}
            <div className="bg-brand-50 border-2 border-brand-100 dark:bg-brand-900/10 dark:border-brand-800 rounded-[3rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="space-y-1">
                 <h3 className="text-xl font-black text-brand-900 dark:text-brand-400">Time Progression</h3>
                 <p className="text-sm font-medium text-brand-600/60">Simulate the monthly cycle to trigger paydays and bills.</p>
               </div>
               <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-brand-100 dark:border-brand-800">
                  <span className="px-4 py-2 text-sm font-black text-slate-400 uppercase tracking-widest">Day {state.current_day}</span>
                  <button 
                    onClick={() => processDay(state.current_day + 1)}
                    disabled={state.current_day >= 30}
                    className="btn-primary py-3 px-8 flex items-center gap-2"
                  >
                    Next Day
                    <ArrowRight className="w-5 h-5" />
                  </button>
               </div>
            </div>

            {/* Monthly Ledger - Standard Budget System */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                   <Briefcase className="w-8 h-8 text-indigo-500" />
                   Monthly Ledger
                 </h3>
                 <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Standardized Flow</span>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                  {/* Income Column */}
                  <div className="p-8 space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Income</p>
                     <div className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                          <span className="text-slate-500">Bi-Weekly 1</span>
                          <span className="text-emerald-500">${currentProfile.budget.income_player_1.toLocaleString()}</span>
                        </div>
                        {currentProfile.budget.income_player_2 && (
                          <div className="flex justify-between text-sm font-bold">
                            <span className="text-slate-500">Bi-Weekly 2</span>
                            <span className="text-emerald-500">${currentProfile.budget.income_player_2.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="pt-2 border-t border-slate-50 dark:border-slate-800 flex justify-between">
                           <span className="text-xs font-black uppercase text-slate-400">Total</span>
                           <span className="text-lg font-black text-slate-900 dark:text-white">${((currentProfile.budget.income_player_1 + (currentProfile.budget.income_player_2 || 0)) * 2).toLocaleString()}</span>
                        </div>
                     </div>
                  </div>

                  {/* Housing Column */}
                  <div className="p-8 space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Housing & Utils</p>
                     <div className="space-y-2 text-sm font-bold">
                        <div className="flex justify-between">
                          <span className="text-slate-500 capitalize">{currentProfile.budget.housing.housing_cost_type}</span>
                          <span className="text-slate-900 dark:text-white">${currentProfile.budget.housing.monthly_housing_payment.toLocaleString()}</span>
                        </div>
                        {Object.entries(currentProfile.budget.utilities).map(([k, v]) => v > 0 && (
                           <div key={k} className="flex justify-between">
                             <span className="text-slate-500 capitalize">{k.replace('_', ' ')}</span>
                             <span className="text-slate-900 dark:text-white">${v.toLocaleString()}</span>
                           </div>
                        ))}
                        <div className="pt-2 border-t border-slate-50 dark:border-slate-800 flex justify-between">
                           <span className="text-xs font-black uppercase text-slate-400">Fixed Total</span>
                           <span className="text-lg font-black text-red-500">
                             ${(currentProfile.budget.housing.monthly_housing_payment + Object.values(currentProfile.budget.utilities).reduce((a:any, b:any) => a + (b || 0), 0)).toLocaleString()}
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* Transport Column */}
                  <div className="p-8 space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Living & Transport</p>
                     <div className="space-y-2 text-sm font-bold">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Groceries</span>
                          <span className="text-slate-900 dark:text-white">${currentProfile.budget.living_groceries.toLocaleString()}</span>
                        </div>
                        {Object.entries(currentProfile.budget.transportation).map(([k, v]) => v > 0 && (
                           <div key={k} className="flex justify-between">
                             <span className="text-slate-500 capitalize">{k.replace('_', ' ')}</span>
                             <span className="text-slate-900 dark:text-white">${v.toLocaleString()}</span>
                           </div>
                        ))}
                        <div className="pt-2 border-t border-slate-50 dark:border-slate-800 flex justify-between">
                           <span className="text-xs font-black uppercase text-slate-400">Variable Total</span>
                           <span className="text-lg font-black text-red-500">
                             ${(currentProfile.budget.living_groceries + Object.values(currentProfile.budget.transportation).reduce((a:any, b:any) => a + (b || 0), 0)).toLocaleString()}
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* Net Summary Column */}
                  <div className="p-8 bg-slate-50 dark:bg-slate-800/20 space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Leftover</p>
                     <div className="space-y-1">
                        {(() => {
                           const income = (currentProfile.budget.income_player_1 + (currentProfile.budget.income_player_2 || 0)) * 2;
                           const expenses = currentProfile.budget.housing.monthly_housing_payment +
                                            Object.values(currentProfile.budget.utilities).reduce((a:any, b:any) => a + (Number(b) || 0), 0) +
                                            Object.values(currentProfile.budget.transportation).reduce((a:any, b:any) => a + (Number(b) || 0), 0) +
                                            currentProfile.budget.living_groceries +
                                            (currentProfile.fixed_expenses?.reduce((a, b) => a + b.amount, 0) || 0);
                           const leftover = income - expenses;
                           return (
                             <>
                               <p className={`text-4xl font-black tracking-tighter ${leftover >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                 ${leftover.toLocaleString()}
                               </p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Projected Savings</p>
                             </>
                           );
                        })()}
                     </div>
                  </div>
               </div>
            </div>

            {/* Transaction History Feed */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <TrendingDown className="w-8 h-8 text-brand-600" />
                  Recent Activity
                </h3>
              </div>

              <div className="space-y-4">
                {state.transactions.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No activity yet</p>
                    <p className="text-slate-300 text-sm">Advance to Day 1 to trigger initial bills.</p>
                  </div>
                ) : (
                  state.transactions.map((t, idx) => (
                    <motion.div 
                      key={t.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                           {t.type === 'income' ? <ArrowUpRight className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white">{t.label}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Day {t.day_of_month} • {t.category}</p>
                        </div>
                      </div>
                      <p className={`text-lg font-black ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                        {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toLocaleString()}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Profile & Sidebar */}
          <aside className="space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
               
               <div className="space-y-6">
                 <div className="w-full h-48 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 rotate-2">
                   <img src={profile.image} className="w-full h-full object-cover" alt="Profile" />
                 </div>
                 
                 <div>
                   <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{profile.title}</h2>
                   <p className="text-brand-600 font-black uppercase tracking-widest text-[10px]">{profile.job_title}</p>
                 </div>
               </div>

               {/* TOP NOTIFICATIONS / MISSION CONTROL */}
      <AnimatePresence>
        {isChallengeMinimized && currentChallengeId && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="bg-brand-600 rounded-[2.5rem] p-8 flex items-center justify-between text-white shadow-2xl shadow-brand-600/20 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="flex items-center gap-6 relative">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center animate-pulse">
                     <Play className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Mission Minimized</p>
                     <p className="text-2xl font-black italic tracking-tight">Onboarding Phase: {currentChallengeId.replace('_', ' #')}</p>
                  </div>
               </div>
               <button 
                 onClick={() => setIsChallengeMinimized(false)}
                 className="px-10 py-5 bg-white text-brand-600 rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
               >
                  Resume Research
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DAILY FLOW GRID */}
               <div className="space-y-6">
                 <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>
                 
                 {/* Children */}
                 <div className="space-y-3">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     <Users className="w-3.5 h-3.5 text-brand-500" />
                     Dependents
                   </p>
                   {profile.children.length > 0 ? (
                     <div className="space-y-2">
                       {profile.children.map((child, i) => (
                         <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                           <span className="text-xs font-black text-slate-700 dark:text-slate-300">{child.name}</span>
                           <span className="text-[10px] font-bold text-slate-400 opacity-60">Age: {child.age}</span>
                         </div>
                       ))}
                     </div>
                   ) : <p className="text-xs font-bold text-slate-400 italic px-2">No children in this life profile.</p>}
                 </div>

                 {/* Assets & Health */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Car className="w-3.5 h-3.5 text-amber-500" />
                        Vehicles
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {profile.vehicles.length > 0 ? profile.vehicles.map((v, i) => (
                          <span key={i} className="px-2 py-1 bg-amber-50 dark:bg-amber-900/10 text-amber-600 rounded-lg text-[9px] font-black border border-amber-100 dark:border-amber-800 uppercase">{v}</span>
                        )) : <span className="text-[9px] text-slate-400 font-bold uppercase">None</span>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        Health
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {profile.health.length > 0 ? profile.health.map((h, i) => (
                          <span key={i} className="px-2 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-lg text-[9px] font-black border border-rose-100 dark:border-rose-800 uppercase">{h}</span>
                        )) : <span className="text-[9px] text-emerald-500 font-black uppercase">Stable</span>}
                      </div>
                    </div>
                 </div>

                 {/* Household Context */}
                 {partner && (
                   <div className="p-5 bg-brand-50 dark:bg-brand-900/20 rounded-[2rem] border border-brand-100 dark:border-brand-800 space-y-3">
                      <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-3.5 h-3.5" />
                        Household Partner
                      </p>
                      <div className="flex items-center gap-3">
                        <img src={partner.image} className="w-10 h-10 rounded-xl object-cover" alt="Partner" />
                        <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white leading-none">{partner.title}</p>
                          <p className="text-[10px] font-bold text-slate-500">{partner.job_title}</p>
                        </div>
                      </div>
                   </div>
                 )}
               </div>
               
               <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                 <button 
                   onClick={() => setShowJoinModal(true)}
                   className="btn-secondary w-full py-4 flex items-center justify-center gap-2 text-sm"
                 >
                   <Plus className="w-4 h-4" />
                   Join Class Session
                 </button>

                 <Link href="/student/module/1" className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg group">
                   Start Module
                   <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                 </Link>
               </div>
            </div>
          </aside>

        <AnimatePresence>
          {showJoinModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 space-y-8 relative shadow-2xl"
              >
                <button 
                  onClick={() => setShowJoinModal(false)}
                  className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight text-center">Join Class</h3>
                  <p className="text-slate-500 font-medium text-center">Ask your teacher for the 6-digit class code.</p>
                </div>

                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Ex: LG-2026"
                    className="w-full px-6 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-center text-2xl font-black tracking-widest text-brand-600 focus:border-brand-500 outline-none transition-all uppercase"
                  />
                  <button 
                    onClick={() => {
                        alert("Successfully connected to Class Session: LG-2026");
                        setShowJoinModal(false);
                    }}
                    className="w-full btn-primary py-5 text-lg font-black"
                  >
                    Connect to Class
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-brand-600 rounded-[3rem] p-8 text-white space-y-1 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
           <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Monthly Strategy</p>
           <h3 className="text-xl font-black">Avoid Life Debt</h3>
           <p className="text-brand-100 text-sm font-medium leading-relaxed mt-2">
             Finishing the month with a positive balance increases your decision score for next semester.
           </p>
        </div>
      </div>
    </main>
  </div>
);
}
