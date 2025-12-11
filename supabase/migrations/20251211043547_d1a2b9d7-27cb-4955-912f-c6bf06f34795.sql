-- Allow users to update their own appointments (for cancellation)
CREATE POLICY "Users can cancel their own agendamentos"
ON public.agendamentos
FOR UPDATE
TO authenticated
USING (cliente_id IN (
  SELECT profiles.id
  FROM profiles
  WHERE profiles.user_id = auth.uid()
))
WITH CHECK (cliente_id IN (
  SELECT profiles.id
  FROM profiles
  WHERE profiles.user_id = auth.uid()
));