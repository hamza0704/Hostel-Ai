-- Create leave_applications table
CREATE TABLE public.leave_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  parent_phone TEXT,
  parent_consent_obtained BOOLEAN DEFAULT FALSE,
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leave_applications ENABLE ROW LEVEL SECURITY;

-- Students can view their own leave applications
CREATE POLICY "Users can view own leave applications"
ON public.leave_applications
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = leave_applications.profile_id
  AND profiles.user_id = auth.uid()
));

-- Students can insert their own leave applications
CREATE POLICY "Users can insert own leave applications"
ON public.leave_applications
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = leave_applications.profile_id
  AND profiles.user_id = auth.uid()
));

-- Students can update their own pending leave applications
CREATE POLICY "Users can update own pending leave applications"
ON public.leave_applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = leave_applications.profile_id
    AND profiles.user_id = auth.uid()
  ) AND status = 'pending'
);

-- Admins can view all leave applications
CREATE POLICY "Admins can view all leave applications"
ON public.leave_applications
FOR SELECT
USING (is_admin(auth.uid()));

-- Admins can update all leave applications
CREATE POLICY "Admins can update all leave applications"
ON public.leave_applications
FOR UPDATE
USING (is_admin(auth.uid()));

-- Admins can delete leave applications
CREATE POLICY "Admins can delete leave applications"
ON public.leave_applications
FOR DELETE
USING (is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_leave_applications_updated_at
BEFORE UPDATE ON public.leave_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();