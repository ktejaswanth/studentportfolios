-- Portfolio Project - Database Setup (Idempotent Version)
-- This script safely creates or updates the database schema.

-- 1. Students Table
CREATE TABLE IF NOT EXISTS public.students (
    college_id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role_title TEXT DEFAULT 'Student',
    github_url TEXT,
    linkedin_url TEXT,
    profile_pic_url TEXT,
    resume_url TEXT,
    summary TEXT,
    role TEXT DEFAULT 'student', -- 'student' or 'admin'
    selected_template TEXT DEFAULT 'modern-dark',
    theme_mode TEXT DEFAULT 'dark', -- 'dark' or 'light'
    theme_color TEXT DEFAULT '#E53935',
    portfolio_password TEXT DEFAULT '',
    is_published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    subscription_status TEXT DEFAULT 'free',
    subscription_activated_at TIMESTAMPTZ DEFAULT NOW(),
    subscription_expiry TIMESTAMPTZ,
    font_family TEXT DEFAULT 'Outfit',
    font_size TEXT DEFAULT 'standard',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to students if they don't exist
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS about_me TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS introduction TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS hobbies TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS interests TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS achievements TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS section_order JSONB DEFAULT '["summary", "experience", "projects", "education", "skills", "certifications", "interests", "hobbies"]'::jsonb;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'Outfit';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS font_size TEXT DEFAULT 'standard';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS theme_color TEXT DEFAULT '#E53935';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS portfolio_password TEXT DEFAULT '';

-- 2. Certifications Table
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT REFERENCES public.students(college_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuer TEXT,
    date TEXT,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL, -- 'Free', 'Pro', 'Enterprise'
    amount DECIMAL(10, 2),
    status TEXT, -- 'active', 'expired'
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Experiences Table
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT REFERENCES public.students(college_id) ON DELETE CASCADE,
    company TEXT,
    role TEXT,
    duration TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT REFERENCES public.students(college_id) ON DELETE CASCADE,
    title TEXT,
    description TEXT,
    tech TEXT,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Education Table
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT REFERENCES public.students(college_id) ON DELETE CASCADE,
    college TEXT,
    degree TEXT,
    year TEXT,
    cgpa TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT REFERENCES public.students(college_id) ON DELETE CASCADE,
    name TEXT,
    level INTEGER DEFAULT 80,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT REFERENCES public.students(college_id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 10.00,
    payment_screenshot TEXT NOT NULL,
    transaction_id TEXT,
    status TEXT DEFAULT 'pending',
    approved_by TEXT,
    rejection_reason TEXT,
    expiry_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies (Using DO block to avoid 'already exists' errors)
DO $$
BEGIN
    -- Students Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read students') THEN
        CREATE POLICY "Public read students" ON public.students FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own student record') THEN
        CREATE POLICY "Users can manage their own student record" ON public.students FOR ALL USING (auth.uid() = user_id);
    END IF;

    -- Experiences Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read experiences') THEN
        CREATE POLICY "Public read experiences" ON public.experiences FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own experiences') THEN
        CREATE POLICY "Users can manage their own experiences" ON public.experiences FOR ALL USING (EXISTS (SELECT 1 FROM public.students WHERE students.college_id = experiences.college_id AND students.user_id = auth.uid()));
    END IF;

    -- Projects Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read projects') THEN
        CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own projects') THEN
        CREATE POLICY "Users can manage their own projects" ON public.projects FOR ALL USING (EXISTS (SELECT 1 FROM public.students WHERE students.college_id = projects.college_id AND students.user_id = auth.uid()));
    END IF;

    -- Education Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read education') THEN
        CREATE POLICY "Public read education" ON public.education FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own education') THEN
        CREATE POLICY "Users can manage their own education" ON public.education FOR ALL USING (EXISTS (SELECT 1 FROM public.students WHERE students.college_id = education.college_id AND students.user_id = auth.uid()));
    END IF;

    -- Skills Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read skills') THEN
        CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own skills') THEN
        CREATE POLICY "Users can manage their own skills" ON public.skills FOR ALL USING (EXISTS (SELECT 1 FROM public.students WHERE students.college_id = skills.college_id AND students.user_id = auth.uid()));
    END IF;

    -- Certifications Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read certifications') THEN
        CREATE POLICY "Public read certifications" ON public.certifications FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own certifications') THEN
        CREATE POLICY "Users can manage their own certifications" ON public.certifications FOR ALL USING (EXISTS (SELECT 1 FROM public.students WHERE students.college_id = certifications.college_id AND students.user_id = auth.uid()));
    END IF;

    -- Payment Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own payments') THEN
        CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (EXISTS (SELECT 1 FROM public.students WHERE students.college_id = payments.college_id AND students.user_id = auth.uid()));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create payments') THEN
        CREATE POLICY "Users can create payments" ON public.payments FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.students WHERE students.college_id = payments.college_id AND students.user_id = auth.uid()));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins view all payments') THEN
        CREATE POLICY "Admins view all payments" ON public.payments FOR SELECT USING (EXISTS (SELECT 1 FROM public.students WHERE students.user_id = auth.uid() AND students.role = 'admin'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins update payments') THEN
        CREATE POLICY "Admins update payments" ON public.payments FOR UPDATE USING (EXISTS (SELECT 1 FROM public.students WHERE students.user_id = auth.uid() AND students.role = 'admin'));
    END IF;
END $$;

-- 10. Functions
CREATE OR REPLACE FUNCTION increment_view_count(target_college_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.students
  SET view_count = view_count + 1
  WHERE college_id = target_college_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
