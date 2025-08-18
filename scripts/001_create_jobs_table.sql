-- Create jobs table for job application tracking
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn')),
  salary TEXT,
  date_submitted DATE NOT NULL DEFAULT CURRENT_DATE,
  job_link TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS jobs_user_id_idx ON jobs(user_id);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status);

-- Enable Row Level Security (RLS)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own jobs
CREATE POLICY "Users can view own jobs" ON jobs
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own jobs
CREATE POLICY "Users can insert own jobs" ON jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own jobs
CREATE POLICY "Users can update own jobs" ON jobs
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own jobs
CREATE POLICY "Users can delete own jobs" ON jobs
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
