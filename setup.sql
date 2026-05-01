-- 1. Create Students Table
CREATE TABLE public.students (
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
    role TEXT DEFAULT 'student', --'student' or 'admin'
    selected_template TEXT DEFAULT 'modern-dark',
    theme_mode TEXT DEFAULT 'dark', -- 'dark' or 'light'
    is_published BOOLEAN DEFAULT false,
    subscription_status TEXT DEFAULT 'free', -- 'free', 'pro', 'canceled'
    subscription_expiry TIMESTAMPTZ,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Subscriptions Table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL, -- 'Free', 'Pro', 'Enterprise'
    amount DECIMAL(10, 2),
    status TEXT, -- 'active', 'expired'
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Experiences Table
CREATE TABLE public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT REFERENCES public.students(college_id) ON DELETE CASCADE,
    company TEXT,
    role TEXT,
    duration TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Projects Table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT REFERENCES public.students(college_id) ON DELETE CASCADE,
    title TEXT,
    description TEXT,
    tech TEXT,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Education Table
CREATE TABLE public.education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT REFERENCES public.students(college_id) ON DELETE CASCADE,
    college TEXT,
    degree TEXT,
    year TEXT,
    cgpa TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Skills Table
CREATE TABLE public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT REFERENCES public.students(college_id) ON DELETE CASCADE,
    name TEXT,
    level INTEGER DEFAULT 80,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Payments Table (Manual Verification System)
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT REFERENCES public.students(college_id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 10.00,
    payment_screenshot TEXT NOT NULL,
    transaction_id TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    approved_by TEXT,
    rejection_reason TEXT,
    expiry_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies

-- Public Read Access
CREATE POLICY "Public read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Public read experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);

-- Owner Write Access (Students)
-- Fixed: Removed recursive admin check that caused 500 errors.
CREATE POLICY "Users can manage their own student record" ON public.students
    FOR ALL USING (auth.uid() = user_id);

-- Owner Write Access (Related Tables)
CREATE POLICY "Users can manage their own experiences" ON public.experiences
    FOR ALL USING (EXISTS (SELECT 1 FROM public.students WHERE students.college_id = experiences.college_id AND students.user_id = auth.uid()));

CREATE POLICY "Users can manage their own projects" ON public.projects
    FOR ALL USING (EXISTS (SELECT 1 FROM public.students WHERE students.college_id = projects.college_id AND students.user_id = auth.uid()));

CREATE POLICY "Users can manage their own education" ON public.education
    FOR ALL USING (EXISTS (SELECT 1 FROM public.students WHERE students.college_id = education.college_id AND students.user_id = auth.uid()));

CREATE POLICY "Users can manage their own skills" ON public.skills
    FOR ALL USING (EXISTS (SELECT 1 FROM public.students WHERE students.college_id = skills.college_id AND students.user_id = auth.uid()));

-- Payment Policies
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.students WHERE students.college_id = payments.college_id AND students.user_id = auth.uid())
    );

CREATE POLICY "Users can create payments" ON public.payments
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.students WHERE students.college_id = payments.college_id AND students.user_id = auth.uid())
    );

CREATE POLICY "Admins view all payments" ON public.payments
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.students WHERE students.user_id = auth.uid() AND students.role = 'admin')
    );

CREATE POLICY "Admins update payments" ON public.payments
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.students WHERE students.user_id = auth.uid() AND students.role = 'admin')
    );

-- 10. Analytics Functions
CREATE OR REPLACE FUNCTION increment_view_count(target_college_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.students
  SET view_count = view_count + 1
  WHERE college_id = target_college_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
