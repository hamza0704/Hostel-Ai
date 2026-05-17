-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'leave')),
  check_in_time TIME,
  check_out_time TIME,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(profile_id, date)
);

-- Enable RLS
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Policies for students (can view own attendance, can mark own attendance)
CREATE POLICY "Users can view own attendance"
  ON public.attendance FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = attendance.profile_id
    AND profiles.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own attendance"
  ON public.attendance FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = attendance.profile_id
    AND profiles.user_id = auth.uid()
  ));

-- Policies for admins
CREATE POLICY "Admins can view all attendance"
  ON public.attendance FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert attendance"
  ON public.attendance FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update attendance"
  ON public.attendance FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete attendance"
  ON public.attendance FOR DELETE
  USING (is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();