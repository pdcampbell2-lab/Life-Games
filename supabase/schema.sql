-- Life Games: Education Platform Schema

-- 1. Classes
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL,
  class_name TEXT NOT NULL,
  class_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Profiles (Templates for the "Players")
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  job_title TEXT NOT NULL,
  base_salary DECIMAL NOT NULL, -- Monthly
  housing_type TEXT,
  initial_savings DECIMAL DEFAULT 0,
  initial_debt DECIMAL DEFAULT 0,
  image_url TEXT,
  metadata JSONB -- For extra details like family, health
);

-- 3. Student Progress & Current State
-- This tracks where each student is in their simulation
CREATE TABLE student_simulation_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  profile_id UUID REFERENCES profiles(id),
  current_day INTEGER DEFAULT 1, -- Day of the month (1-30)
  current_balance DECIMAL NOT NULL,
  current_debt DECIMAL DEFAULT 0,
  decision_score INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Transactions (The Audit Log)
-- Every payday or expense creates a record here
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  amount DECIMAL NOT NULL,
  label TEXT NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense', 'debt_payment')),
  category TEXT,
  day_of_month INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
