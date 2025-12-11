-- Remove the overly permissive policy
DROP POLICY IF EXISTS "System can manage login attempts" ON public.login_attempts;

-- Add a policy that only allows admins to manage login attempts
CREATE POLICY "Admins can manage login attempts"
ON public.login_attempts
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));