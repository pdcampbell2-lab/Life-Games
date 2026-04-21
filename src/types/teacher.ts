import { LifeProfile, SimulationState } from "./index";

export interface StudentAssignment {
  student_name: string;
  profile_id: string;
  assigned_at: string;
  progress: {
    completed_challenges: string[];
    current_balance: number;
    debt_level: number;
    score: number;
    results: Record<string, any>; // Stores research data/choices for each challenge
  };
  financials: {
    gross_income: number;
    net_income: number;
    cpp: number;
    ei: number;
    tax: number;
    starting_balance: number;
  };
}

export interface TeacherState {
  class_code: string;
  is_game_paused: boolean;
  unlocked_challenge_index: number; // 1-11
  assignments: Record<string, StudentAssignment>; // student_name as key
  blueprints?: Record<string, any>;
}
