"use client";

import React, { useState, useCallback } from 'react';
import { LifeProfile, SimulationState, Transaction } from '@/types';
import { FINAL_CHALLENGES } from '@/data/challenges';

export function useSimulation(profile: LifeProfile) {
  const [state, setState] = useState<SimulationState>({
    current_day: 15,
    current_month: 9,
    current_year: 2026,
    balance: profile.initial_savings,
    debt: profile.initial_debt,
    transactions: [],
    is_completed: false,
    completed_challenges: []
  });

  const [currentProfile, setCurrentProfile] = useState<LifeProfile>(profile);
  const [finalChallenge, setFinalChallenge] = useState<any>(null);

  // Re-hydrate when profile changes
  React.useEffect(() => {
    setCurrentProfile(profile);
    setState({
      current_day: 15,
      current_month: 9,
      current_year: 2026,
      balance: profile.initial_savings,
      debt: profile.initial_debt,
      transactions: [],
      is_completed: false,
      completed_challenges: []
    });
  }, [profile.id]);

  const updateBudget = (utilitiesUpdates: Partial<LifeProfile['budget']['utilities']>) => {
    setCurrentProfile(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        utilities: {
          ...prev.budget.utilities,
          ...utilitiesUpdates
        }
      }
    }));
  };

  const updateHousing = (housingUpdates: Partial<LifeProfile['budget']['housing']>) => {
    setCurrentProfile(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        housing: {
          ...prev.budget.housing,
          ...housingUpdates
        }
      }
    }));
  };

  const updateTransportation = (transUpdates: Partial<LifeProfile['budget']['transportation']>) => {
    setCurrentProfile(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        transportation: {
          ...prev.budget.transportation,
          ...transUpdates
        }
      }
    }));
  };

  const updateCreditCard = (card: any) => {
    setCurrentProfile(prev => ({
      ...prev,
      credit_card: {
        ...card,
        credit_score: card.credit_score || 700,
        payment_history: card.payment_history || [],
        balance: card.balance || 0
      }
    }));
  };

  const useCreditCard = (amount: number, label: string) => {
    if (!currentProfile.credit_card) return;
    setCurrentProfile(prev => ({
      ...prev,
      credit_card: {
        ...prev.credit_card!,
        balance: prev.credit_card!.balance + amount
      }
    }));
    setState(prev => ({
      ...prev,
      transactions: [{
        id: `cc-${Date.now()}`,
        amount: -amount,
        label: `${label} (Charged to Credit)`,
        type: 'expense',
        category: 'Credit Card',
        day_of_month: prev.current_day,
        created_at: new Date().toISOString()
      }, ...prev.transactions]
    }));
  };

  const makeCreditPayment = (amount: number, type: 'full' | 'min' | 'custom') => {
    if (!currentProfile.credit_card) return;
    
    // Impact on Credit Score: Paying full increases, min/missed decreases
    const scoreImpact = type === 'full' ? 5 : type === 'min' ? 0 : -2;

    setCurrentProfile(prev => ({
      ...prev,
      credit_card: {
        ...prev.credit_card!,
        balance: Math.max(0, prev.credit_card!.balance - amount),
        credit_score: Math.min(900, Math.max(300, prev.credit_card!.credit_score + scoreImpact)),
        payment_history: [...prev.credit_card!.payment_history, { month: state.current_month, amount, type }]
      }
    }));

    setState(prev => ({
      ...prev,
      balance: prev.balance - amount,
      transactions: [{
        id: `pay-${Date.now()}`,
        amount: -amount,
        label: `Credit Card Payment (${type})`,
        type: 'debt_payment',
        category: 'Banking',
        day_of_month: prev.current_day,
        created_at: new Date().toISOString()
      }, ...prev.transactions]
    }));
  };

  const updateMeta = (metaUpdates: Record<string, any>) => {
    setCurrentProfile(prev => ({
      ...prev,
      meta: {
        ...(prev.meta || {}),
        ...metaUpdates
      }
    }));
  };

  const completeChallenge = (id: string, resultsData?: any) => {
    setState(prev => {
      const newState = {
        ...prev,
        completed_challenges: [...prev.completed_challenges, id]
      };

      // PERSIST TO TEACHER STATE IF STUDENT NAME EXISTS
      const studentName = localStorage.getItem('student_name');
      if (studentName) {
        const teacherSaved = localStorage.getItem('life_games_teacher_state');
        if (teacherSaved) {
          try {
            const teacherState = JSON.parse(teacherSaved);
            const student = teacherState.assignments[studentName];
            if (student) {
              student.progress.completed_challenges = Array.from(new Set([...student.progress.completed_challenges, id]));
              student.progress.results = {
                ...(student.progress.results || {}),
                [id]: resultsData || {}
              };
              // Update balance and debt in teacher state too for teacher view
              student.progress.current_balance = prev.balance;
              student.progress.debt_level = prev.debt;
              
              localStorage.setItem('life_games_teacher_state', JSON.stringify(teacherState));
            }
          } catch (e) {
            console.error("Failed to sync challenge result to teacher state", e);
          }
        }
      }

      return newState;
    });
  };

  const generateRandomEvent = (day: number, month: number) => {
    const events = [
      { label: 'Unexpected Car Repair', range: [300, 1500], category: 'Emergency' },
      { label: 'Medical Co-pay', range: [100, 800], category: 'Health' },
      { label: 'Job Bonus', range: [200, 1000], category: 'Income', type: 'income' },
      { label: 'Minor Fender Bender', range: [500, 1000], category: 'Transport' }
    ];
    
    if (Math.random() > 0.95) {
      const event = events[Math.floor(Math.random() * events.length)];
      const amount = Math.floor(Math.random() * (event.range[1] - event.range[0] + 1)) + event.range[0];
      return {
        id: `random-${day}-${month}-${Math.random()}`,
        amount: event.type === 'income' ? amount : -amount,
        label: event.label,
        type: event.type || 'expense',
        category: event.category,
        day_of_month: day,
        created_at: new Date().toISOString()
      } as Transaction;
    }
    return null;
  };

  const applyFinalChoice = (choice: any) => {
    setState(prev => ({
      ...prev,
      balance: prev.balance + choice.balance_impact,
      is_completed: true,
      transactions: [{
        id: `final-${Date.now()}`,
        amount: choice.balance_impact,
        label: `FINAL DECISION: ${choice.text}`,
        type: choice.balance_impact >= 0 ? 'income' : 'expense',
        category: 'Final Challenge',
        day_of_month: prev.current_day,
        created_at: new Date().toISOString()
      }, ...prev.transactions]
    }));
    setFinalChallenge(null);
    return choice.outcome_text;
  };

  const processDay = useCallback((targetDay: number) => {
    setState(prev => {
      let currentDay = prev.current_day;
      let currentMonth = prev.current_month;
      let currentYear = prev.current_year;
      let newBalance = prev.balance;
      const newTransactions = [...prev.transactions];

      for (let d = 1; d <= (targetDay - prev.current_day); d++) {
        currentDay++;
        if (currentDay > 30) {
          currentDay = 1;
          currentMonth++;
          if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
          }
        }

        // Standard Schedule (as defined in previous step)
        if (currentDay === 1) {
           newBalance -= profile.budget.housing.monthly_housing_payment;
           newTransactions.unshift({ id: `h-${currentMonth}-${currentDay}`, amount: -profile.budget.housing.monthly_housing_payment, label: 'Housing Payment', type: 'expense', category: 'Housing', day_of_month: currentDay, created_at: new Date().toISOString() });
        }
        if (currentDay === 8 || currentDay === 22) {
           const pay = profile.budget.income_player_1 + (profile.budget.income_player_2 || 0);
           newBalance += pay;
           newTransactions.unshift({ id: `pay-${currentMonth}-${currentDay}`, amount: pay, label: 'Household Payday', type: 'income', category: 'Income', day_of_month: currentDay, created_at: new Date().toISOString() });
        }
        if (currentDay % 7 === 0) {
           const weekly = 250;
           newBalance -= weekly;
           newTransactions.unshift({ id: `weekly-${currentMonth}-${currentDay}`, amount: -weekly, label: 'Weekly Essentials', type: 'expense', category: 'Living', day_of_month: currentDay, created_at: new Date().toISOString() });
        }

        const randomEvent = generateRandomEvent(currentDay, currentMonth);
        if (randomEvent) {
          newBalance += randomEvent.amount;
          newTransactions.unshift(randomEvent);
        }

        // FINAL CHALLENGE TRIGGER
        if (currentMonth === 6 && currentDay === 15) {
           const challenge = FINAL_CHALLENGES.find(c => 
             c.player_id === profile.id || 
             (profile.household_id && c.household_id === profile.household_id)
           );
           if (challenge) {
             setFinalChallenge(challenge);
             return { ...prev, current_day: currentDay, current_month: currentMonth, current_year: currentYear, balance: newBalance, transactions: newTransactions };
           }
           return { ...prev, current_day: currentDay, current_month: currentMonth, current_year: currentYear, balance: newBalance, transactions: newTransactions, is_completed: true };
        }
      }

      return {
        ...prev,
        current_day: currentDay,
        current_month: currentMonth,
        current_year: currentYear,
        balance: newBalance,
        transactions: newTransactions
      };
    });
  }, [profile]);

  const manualTransaction = (amount: number, label: string, method: 'cash' | 'credit' = 'cash') => {
    if (method === 'credit') {
      useCreditCard(amount, label);
      return;
    }

    const newTransaction: Transaction = {
      id: Math.random().toString(),
      date: `${state.current_year}-${String(state.current_month).padStart(2, '0')}-${String(state.current_day).padStart(2, '0')}`,
      amount: -amount,
      label,
      type: 'expense',
      category: 'leisure',
      day_of_month: state.current_day,
      created_at: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      balance: prev.balance - amount,
      transactions: [newTransaction, ...prev.transactions]
    }));
  };

  const getBlueprints = () => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem('life_games_teacher_state');
    if (!saved) return {};
    try {
      const ts = JSON.parse(saved);
      return ts.blueprints || {};
    } catch (e) {
      return {};
    }
  };

  const blueprints = getBlueprints();

  const getBlueprint = (id: string) => blueprints[id] || null;

  return {
    state,
    currentProfile,
    blueprints,
    getBlueprint,
    processDay,
    updateBudget,
    updateHousing,
    updateTransportation,
    updateCreditCard,
    useCreditCard,
    makeCreditPayment,
    updateMeta,
    completeChallenge,
    manualTransaction,
    finalChallenge,
    applyFinalChoice: (choiceId: string) => {
      // Choice logic
      completeChallenge('FINAL_OUTCOME');
    }
  };
}
