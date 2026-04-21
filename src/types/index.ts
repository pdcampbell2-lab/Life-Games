export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  school_id?: string;
}

export interface Expense {
  id?: string;
  label: string;
  amount: number;
  type?: 'fixed' | 'variable';
  category?: string;
  day_of_month?: number;
}

export interface Child {
  name: string;
  age: number;
}

export interface HousingBudget {
  property_value?: number;
  mortgage_amount?: number;
  interest_rate?: number;
  housing_cost_type: 'mortgage' | 'rent';
  monthly_housing_payment: number;
  // Breakdown (optional/legacy)
  mortgage?: number;
  rent?: number;
  property_tax?: number;
  home_insurance?: number;
  maintenance_fees?: number;
}

export interface UtilitiesBudget {
  hydro: number;
  water: number;
  gas: number;
  internet: number;
  cable?: number;
  home_phone?: number;
  cell_phone: number;
}

export interface TransportBudget {
  car_payment: number;
  car_insurance: number;
  automobile_gas: number;
}

export interface StandardBudget {
  income_player_1: number; // Bi-weekly
  income_player_2?: number; // Bi-weekly
  housing: HousingBudget;
  utilities: UtilitiesBudget;
  transportation: TransportBudget;
  living_groceries: number;
  childcare?: number;
}

export interface CreditCardProfile {
  provider: string;
  type: string;
  annual_fee: number;
  interest_rate: number;
  balance: number;
  perks: string;
  credit_score: number; // 300 - 900
  payment_history: { month: number; amount: number; type: 'full' | 'min' | 'custom' }[];
}

export interface LifeProfile {
  id: string;
  title: string;
  job_title: string;
  marital_status: string;
  household_id?: string;
  bank_name: string;
  balance_type: 'individual' | 'household_primary' | 'household_secondary';
  budget: StandardBudget;
  children: Child[];
  housing_type: string;
  vehicles: string[];
  pets: string[];
  health: string[];
  notes: string[];
  initial_savings: number;
  initial_debt: number;
  credit_card?: CreditCardProfile;
  fixed_expenses: Expense[];
  image: string;
  meta?: Record<string, any>;
}

export interface MonthlyState {
  month: number;
  balance: number;
  savings: number;
  debt: number;
  active_expenses: Expense[];
}

export interface Class {
  id: string;
  teacher_id: string;
  class_name: string;
  class_code: string;
}

export interface Choice {
  id: string;
  scenario_id: string;
  text: string;
  consequence: string;
  score_delta: number;
  next_scenario_id: string | 'end';
  logic?: string;
  reflection?: string;
}

export interface Scenario {
  id: string;
  module_id: string;
  title: string;
  prompt: string;
  choices: Choice[];
}

export interface Module {
  id: string;
  title: string;
  category: string;
  description?: string;
  scenarios: Scenario[];
}

export interface Progress {
  id: string;
  student_id: string;
  module_id: string;
  current_month: number;
  current_balance: number;
  total_score: number;
  completed: boolean;
  profile_id?: string;
  history: MonthlyState[];
  decisions_log: { scenario_id: string; choice_id: string; impact: number }[];
  completed_at?: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  class_id: string;
}

export interface CalendarEvent {
  id: string;
  label: string;
  amount: number;
  type: 'fixed' | 'weekly' | 'bi-weekly' | 'random';
  category: string;
  day_of_month?: number;
}

export interface Transaction {
  id: string;
  amount: number;
  label: string;
  type: 'income' | 'expense' | 'debt_payment';
  category?: string;
  day_of_month: number;
  created_at: string;
}

export interface SimulationState {
  current_day: number;
  current_month: number; // 9 = Sept, etc.
  current_year: number;
  balance: number;
  debt: number;
  transactions: Transaction[];
  is_completed: boolean;
  completed_challenges: string[];
}
