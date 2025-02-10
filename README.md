Successful payment: 4242 4242 4242 4242
Failed payment: 4000 0000 0000 0002
Expiry date: Any future date
CVC: Any 3 digits

###  SQL to update the user_subscriptions table with proper foreign key

create table if not exists public.user_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  plan_id text not null references public.subscription_plans(id),
  status text not null default 'active',
  start_date timestamp with time zone default timezone('utc'::text, now()),
  end_date timestamp with time zone not null,
  payment_id text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

###  Add foreign key indexes
create index if not exists user_subscriptions_user_id_idx on public.user_subscriptions(user_id);
create index if not exists user_subscriptions_plan_id_idx on public.user_subscriptions(plan_id);


## Run this in Supabase SQL editor to clean up duplicate active subscriptions
UPDATE public.user_subscriptions 
SET status = 'expired'
WHERE id NOT IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
    FROM public.user_subscriptions
    WHERE status = 'active'
  ) t
  WHERE rn = 1
);


## After signing up, run this SQL in Supabase SQL editor to make the user an admin:

UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');

create an RLS policy to allow project insertion:
CREATE POLICY "Users can insert their own projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);