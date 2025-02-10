## Helpful information on how to initialize queries for this project

### Successful and Failed Payment Test Cards
```bash
Successful payment: 4242 4242 4242 4242
Failed payment: 4000 0000 0000 0002
Expiry date: Any future date
CVC: Any 3 digits
```
### SQL to update the user_subscriptions table with proper foreign key
```sql
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_id TEXT NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now())
);
```
### Add foreign key indexes
```sql
CREATE INDEX IF NOT EXISTS user_subscriptions_user_id_idx ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS user_subscriptions_plan_id_idx ON public.user_subscriptions(plan_id);
```

### Run this in Supabase SQL editor to clean up duplicate active subscriptions
```sql
UPDATE public.user_subscriptions 
SET status = 'expired'
WHERE id NOT IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
    FROM public.user_subscriptions
    WHERE status = 'active'
  ) t
  WHERE rn = 1
);
```

### After signing up, run this SQL in Supabase SQL editor to make the user an admin
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

### Create an RLS policy to allow project insertion
```sql
CREATE POLICY "Users can insert their own projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```