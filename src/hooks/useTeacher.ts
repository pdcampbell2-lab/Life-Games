import React from 'react';
import { TeacherState, StudentAssignment } from '@/types/teacher';
import { MOCK_PROFILES } from '@/data/profiles';

const INITIAL_TEACHER_STATE: TeacherState = {
  class_code: "LG-2026",
  is_game_paused: false,
  unlocked_challenge_index: 1,
  assignments: {}
};

export const useTeacher = () => {
  const [state, setState] = React.useState<TeacherState>(INITIAL_TEACHER_STATE);
  const [isHydrated, setIsHydrated] = React.useState(false);

  const saveState = (newState: TeacherState) => {
    localStorage.setItem('life_games_teacher_state', JSON.stringify(newState));
  };

  // Persistence management - LOAD
  React.useEffect(() => {
    const saved = localStorage.getItem('life_games_teacher_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
      } catch (e) {
        console.error("Failed to load teacher state", e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Persistence management - SAVE
  React.useEffect(() => {
    if (isHydrated) {
      saveState(state);
    }
  }, [state, isHydrated]);

  // Teaching Tips Repository
  const teachingTips: Record<string, any> = {
    challenge_1: {
      concept: "Market Research",
      lesson: "Prices vary wildly for the same item; comparison is the only way to find value.",
      prompts: ["What surprised you about the price of basic goods?", "Does higher price always mean higher quality?"]
    },
    challenge_2: {
      concept: "Recurring Fixed Costs",
      lesson: "Cell phone plans are long-term commitments that drain monthly liquidity.",
      prompts: ["Is unlimited data a need or a want?", "How does a $60/month bill affect your yearly savings?"]
    },
    challenge_3: {
      concept: "Gross vs. Net Realism",
      lesson: "The rule of thumb: Housing should not exceed 30% of your gross income.",
      prompts: ["Did you have to compromise on location or size?", "What happens if rent increases by 10%?"]
    },
    challenge_8: {
      concept: "The Interest Trap",
      lesson: "Credit cards are high-interest debt instruments, not 'free money'.",
      prompts: ["How long does it take to pay off a $1000 balance at 20% interest?", "Why do banks offer rewards?"]
    }
  };

  const batchAssignStudents = (assignments: { name: string, profileId: string }[]) => {
    setState(prev => {
      const newAssignments = { ...prev.assignments };
      
      assignments.forEach(({ name, profileId }) => {
        const profile = MOCK_PROFILES.find(p => p.id === profileId);
        if (!profile) return;

        newAssignments[name] = {
          student_name: name,
          profile_id: profileId,
          assigned_at: new Date().toISOString(),
          progress: {
            completed_challenges: [],
            current_balance: profile.initial_savings,
            debt_level: profile.initial_debt,
            score: 0,
            results: {}
          },
          financials: {
            gross_income: (profile.budget.income_player_1 * 26),
            net_income: (profile.budget.income_player_1 * 26) * 0.75,
            cpp: 0,
            ei: 0,
            tax: 0,
            starting_balance: profile.initial_savings
          }
        };
      });

      const newState = { ...prev, assignments: newAssignments };
      saveState(newState);
      return newState;
    });
  };

  const unlockNextChallenge = () => {
    setState(prev => {
      const newState = {
        ...prev,
        unlocked_challenge_index: Math.min(prev.unlocked_challenge_index + 1, 11)
      };
      saveState(newState);
      return newState;
    });
  };

  const togglePause = () => {
    setState(prev => {
      const newState = { ...prev, is_game_paused: !prev.is_game_paused };
      saveState(newState);
      return newState;
    });
  };

  const saveStudentResults = (studentName: string, challengeId: string, data: any) => {
    setState(prev => {
      const student = prev.assignments[studentName];
      if (!student) return prev;
      
      const newState = {
        ...prev,
        assignments: {
          ...prev.assignments,
          [studentName]: {
            ...student,
            progress: {
              ...student.progress,
              completed_challenges: Array.from(new Set([...student.progress.completed_challenges, challengeId])),
              results: {
                ...student.progress.results,
                [challengeId]: data
              }
            }
          }
        }
      };
      saveState(newState);
      return newState;
    });
  };

  const updateStudentChallengeData = (studentName: string, challengeId: string, data: any) => {
    setState(s => {
      if (!s.assignments[studentName]) return s;
      const updated = { ...s };
      updated.assignments[studentName].progress.results = {
        ...updated.assignments[studentName].progress.results,
        [challengeId]: data
      };
      saveState(updated);
      return updated;
    });
  };

  const updateBlueprint = (challengeId: string, config: any) => {
    setState(s => {
      const updated = {
        ...s,
        blueprints: {
          ...(s.blueprints || {}),
          [challengeId]: {
            ...(s.blueprints?.[challengeId] || {}),
            ...config
          }
        }
      };
      saveState(updated);
      return updated;
    });
  };

  const removeStudent = (studentName: string) => {
    setState(s => {
      const updated = { ...s, assignments: { ...s.assignments } };
      delete updated.assignments[studentName];
      saveState(updated);
      return updated;
    });
  };

  return {
    state,
    assignStudent: (name: string, profileId: string) => batchAssignStudents([{ name, profileId }]),
    batchAssignStudents,
    unlockNextChallenge,
    togglePause,
    saveStudentResults,
    updateStudentChallengeData,
    updateBlueprint,
    removeStudent,
    teachingTips,
    profiles: MOCK_PROFILES,
    isHydrated
  };
};
