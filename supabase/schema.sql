-- Kamaryar Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer Not to Say')),
  age INTEGER,
  country_name TEXT,
  back_pain_years INTEGER,
  job_type TEXT CHECK (job_type IN ('Mostly Sitting', 'Mostly Standing', 'Physically Active', 'Manual Labor')),
  weekly_activity_level TEXT CHECK (weekly_activity_level IN ('Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active')),
  language TEXT CHECK (language IN ('en', 'fa', 'ar')) DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assessment_type TEXT CHECK (assessment_type IN ('red_flags', 'start_back', 'rmdq', 'vas')) NOT NULL,
  score NUMERIC,
  raw_answers JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pain logs table
CREATE TABLE IF NOT EXISTS pain_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vas_score NUMERIC CHECK (vas_score >= 0 AND vas_score <= 10) NOT NULL,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content: Exercises
CREATE TABLE IF NOT EXISTS content_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name JSONB NOT NULL, -- {en: "Bird-Dog", fa: "...", ar: "..."}
  description JSONB NOT NULL,
  video_url TEXT NOT NULL,
  category TEXT CHECK (category IN ('Motor Control', 'Directional Preference', 'Mobility')),
  sets INTEGER DEFAULT 2,
  reps INTEGER DEFAULT 8,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content: Meditations
CREATE TABLE IF NOT EXISTS content_meditations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title JSONB NOT NULL,
  description JSONB NOT NULL,
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content: Education (PNE Tips)
CREATE TABLE IF NOT EXISTS content_education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title JSONB NOT NULL,
  body JSONB NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly plans table
CREATE TABLE IF NOT EXISTS weekly_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily activities table
CREATE TABLE IF NOT EXISTS daily_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES weekly_plans(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6) NOT NULL,
  content_type TEXT CHECK (content_type IN ('exercise', 'meditation', 'education')) NOT NULL,
  content_id UUID NOT NULL,
  status TEXT CHECK (status IN ('pending', 'complete')) DEFAULT 'pending',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_type ON assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_pain_logs_user_id ON pain_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_pain_logs_logged_at ON pain_logs(logged_at);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_user_id ON weekly_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_start_date ON weekly_plans(start_date);
CREATE INDEX IF NOT EXISTS idx_daily_activities_plan_id ON daily_activities(plan_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_day ON daily_activities(day_of_week);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Assessments policies
CREATE POLICY "Users can view own assessments"
  ON assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Pain logs policies
CREATE POLICY "Users can view own pain logs"
  ON pain_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pain logs"
  ON pain_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Weekly plans policies
CREATE POLICY "Users can view own weekly plans"
  ON weekly_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly plans"
  ON weekly_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Daily activities policies
CREATE POLICY "Users can view own daily activities"
  ON daily_activities FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM weekly_plans WHERE id = plan_id));

CREATE POLICY "Users can update own daily activities"
  ON daily_activities FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM weekly_plans WHERE id = plan_id));

CREATE POLICY "Users can insert own daily activities"
  ON daily_activities FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM weekly_plans WHERE id = plan_id));

-- Content tables are public (read-only for authenticated users)
ALTER TABLE content_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_meditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view exercises"
  ON content_exercises FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view meditations"
  ON content_meditations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view education"
  ON content_education FOR SELECT
  TO authenticated
  USING (true);

