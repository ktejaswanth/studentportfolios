-- Database Optimization Script for Portfolia

-- 1. Create Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_college_id ON public.students(college_id);
CREATE INDEX IF NOT EXISTS idx_experiences_college_id ON public.experiences(college_id);
CREATE INDEX IF NOT EXISTS idx_projects_college_id ON public.projects(college_id);
CREATE INDEX IF NOT EXISTS idx_education_college_id ON public.education(college_id);
CREATE INDEX IF NOT EXISTS idx_skills_college_id ON public.skills(college_id);
CREATE INDEX IF NOT EXISTS idx_page_views_college_id ON public.page_views(college_id);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON public.page_views(viewed_at);

-- 2. Add Triggers for updated_at tracking
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to main tables
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_students_updated_at') THEN
        CREATE TRIGGER tr_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    END IF;
END $$;

-- 3. Cleanup old page views (Maintenance)
-- (Optional: Run this periodically to keep the table size manageable)
-- DELETE FROM public.page_views WHERE viewed_at < NOW() - INTERVAL '6 months';
