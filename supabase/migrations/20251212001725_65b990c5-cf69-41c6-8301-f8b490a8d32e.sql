-- Criar tabela galeria para armazenar imagens
CREATE TABLE public.galeria (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  alt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.galeria ENABLE ROW LEVEL SECURITY;

-- Política para permitir que todos vejam as imagens
CREATE POLICY "Anyone can view galeria"
ON public.galeria
FOR SELECT
USING (true);

-- Política para admin gerenciar galeria
CREATE POLICY "Admins can manage galeria"
ON public.galeria
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));