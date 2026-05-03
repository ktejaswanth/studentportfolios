-- 1. Add new columns to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS portfolio_password TEXT,
ADD COLUMN IF NOT EXISTS section_order JSONB DEFAULT '["summary", "experience", "projects", "education", "skills"]'::jsonb;

-- 2. Create Page Views table for Analytics
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT REFERENCES public.students(college_id) ON DELETE CASCADE,
    section TEXT DEFAULT 'home',
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS on page_views
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for page_views
-- Anyone can insert a page view
CREATE POLICY "Public insert page views" ON public.page_views
    FOR INSERT WITH CHECK (true);

-- Only owners (students) or admins can select/read page views
CREATE POLICY "Users can view own page views" ON public.page_views
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.students WHERE students.college_id = page_views.college_id AND students.user_id = auth.uid())
    );
