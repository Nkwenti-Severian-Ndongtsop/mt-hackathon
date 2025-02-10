create table public.subscription_plans (
  id text primary key,
  name text not null,
  description text,
  price integer not null,
  features jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert some default plans
insert into public.subscription_plans (id, name, description, price, features) values
  ('basic', 'Basic Plan', 'Perfect for getting started', 1000, '["Feature 1", "Feature 2", "Feature 3"]'),
  ('pro', 'Pro Plan', 'For growing businesses', 2000, '["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"]'),
  ('enterprise', 'Enterprise Plan', 'For large organizations', 5000, '["All Features", "Priority Support", "Custom Solutions"]'); 