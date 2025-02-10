/*
  # Initial Database Schema

  1. New Tables
    - `profiles`
      - Stores user profile information
      - Links to auth.users
    - `subscriptions`
      - Stores subscription plans and user subscriptions
    - `projects`
      - Stores project information
    - `project_funding`
      - Tracks funding transactions
    - `payments`
      - Stores payment information
    
  2. Security
    - Enable RLS on all tables
    - Add policies for data access
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  avatar_url text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal NOT NULL,
  duration interval NOT NULL,
  features jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subscription plans"
  ON subscription_plans FOR SELECT
  TO authenticated
  USING (true);

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  plan_id uuid REFERENCES subscription_plans(id),
  status text DEFAULT 'active',
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  payment_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  title text NOT NULL,
  description text,
  target_amount decimal NOT NULL,
  current_amount decimal DEFAULT 0,
  status text DEFAULT 'pending',
  repayment_schedule jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view approved projects"
  ON projects FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Project funding table
CREATE TABLE IF NOT EXISTS project_funding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id),
  funder_id uuid REFERENCES profiles(id),
  amount decimal NOT NULL,
  status text DEFAULT 'pending',
  payment_intent_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_funding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their funding transactions"
  ON project_funding FOR SELECT
  USING (auth.uid() = funder_id);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  amount decimal NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending',
  payment_type text NOT NULL,
  payment_intent_id text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price, duration, features)
VALUES
  ('Basic', 'Perfect for starters', 9.99, interval '1 month', '["Submit up to 2 projects", "Basic analytics", "Email support"]'),
  ('Pro', 'For growing projects', 29.99, interval '1 month', '["Submit up to 5 projects", "Advanced analytics", "Priority support", "Custom branding"]'),
  ('Enterprise', 'For large organizations', 99.99, interval '1 month', '["Unlimited projects", "Enterprise analytics", "24/7 support", "Custom solutions", "API access"]');

-- Update the subscription_plans table
alter table subscription_plans
add column description text,
add column features jsonb;

-- Update the user_subscriptions table
alter table user_subscriptions
add column payment_id text,
add column start_date timestamp with time zone default now(),
alter column status set data type text 
  check (status in ('active', 'cancelled', 'expired'));