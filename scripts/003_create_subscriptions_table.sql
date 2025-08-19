-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'free' CHECK (status IN ('free', 'pro', 'cancelled', 'past_due')),
  payment_reference TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own subscription" ON public.subscriptions
  FOR SELECT USING (
    user_id = COALESCE(current_setting('app.current_user_id', true),
                       nullif(current_setting('request.headers', true)::json->>'x-client-user-id',''))
  );

CREATE POLICY "Users can update their own subscription" ON public.subscriptions
  FOR UPDATE USING (
    user_id = COALESCE(current_setting('app.current_user_id', true),
                       nullif(current_setting('request.headers', true)::json->>'x-client-user-id',''))
  );

CREATE POLICY "Users can insert their own subscription" ON public.subscriptions
  FOR INSERT WITH CHECK (
    user_id = COALESCE(current_setting('app.current_user_id', true),
                       nullif(current_setting('request.headers', true)::json->>'x-client-user-id',''))
  );

-- Create trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
