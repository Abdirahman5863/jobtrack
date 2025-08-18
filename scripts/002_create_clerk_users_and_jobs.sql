-- Create users table to sync with Clerk
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY, -- Clerk user ID
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table with Clerk user ID reference
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn')),
  salary TEXT,
  date_submitted DATE,
  job_link TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_date_submitted ON public.jobs(date_submitted);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (
    id = COALESCE(current_setting('app.current_user_id', true), nullif(current_setting('request.headers', true)::json->>'x-client-user-id',''))
  );

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (
    id = COALESCE(current_setting('app.current_user_id', true), nullif(current_setting('request.headers', true)::json->>'x-client-user-id',''))
  );

-- Create RLS policies for jobs table
CREATE POLICY "Users can view their own jobs" ON public.jobs
  FOR SELECT USING (
    user_id = COALESCE(current_setting('app.current_user_id', true), nullif(current_setting('request.headers', true)::json->>'x-client-user-id',''))
  );

CREATE POLICY "Users can insert their own jobs" ON public.jobs
  FOR INSERT WITH CHECK (
    user_id = COALESCE(current_setting('app.current_user_id', true), nullif(current_setting('request.headers', true)::json->>'x-client-user-id',''))
  );

CREATE POLICY "Users can update their own jobs" ON public.jobs
  FOR UPDATE USING (
    user_id = COALESCE(current_setting('app.current_user_id', true), nullif(current_setting('request.headers', true)::json->>'x-client-user-id',''))
  );

CREATE POLICY "Users can delete their own jobs" ON public.jobs
  FOR DELETE USING (
    user_id = COALESCE(current_setting('app.current_user_id', true), nullif(current_setting('request.headers', true)::json->>'x-client-user-id',''))
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Helper RPC to set app.current_user_id for RLS policies
CREATE OR REPLACE FUNCTION public.set_app_user_id(user_id text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_user_id', user_id, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
