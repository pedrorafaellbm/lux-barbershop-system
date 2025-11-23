-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE app_role AS ENUM ('admin', 'operador', 'cliente');

-- Create enum for appointment status
CREATE TYPE appointment_status AS ENUM ('pendente', 'confirmado', 'cancelado', 'concluido');

-- Create enum for payment methods
CREATE TYPE payment_method AS ENUM ('dinheiro', 'pix', 'cartao_debito', 'cartao_credito');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'cliente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create barbeiros table
CREATE TABLE public.barbeiros (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  foto TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create servicos table
CREATE TABLE public.servicos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  duracao INTEGER NOT NULL, -- in minutes
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agendamentos table
CREATE TABLE public.agendamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  barbeiro_id UUID NOT NULL REFERENCES public.barbeiros(id) ON DELETE CASCADE,
  servico_id UUID NOT NULL REFERENCES public.servicos(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  status appointment_status DEFAULT 'pendente',
  pago BOOLEAN DEFAULT FALSE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pagamentos table
CREATE TABLE public.pagamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agendamento_id UUID NOT NULL REFERENCES public.agendamentos(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  metodo payment_method NOT NULL,
  data_pagamento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cupons table
CREATE TABLE public.cupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo TEXT NOT NULL UNIQUE,
  desconto DECIMAL(5,2) NOT NULL, -- percentage
  valido_ate DATE NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create planos table
CREATE TABLE public.planos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  desconto DECIMAL(5,2) NOT NULL, -- percentage
  duracao_meses INTEGER NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create login_attempts table for security
CREATE TABLE public.login_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  tentativas INTEGER DEFAULT 0,
  bloqueado_ate TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbeiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Create function to check if user has role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, nome, telefone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'telefone');
  
  -- Assign default role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'cliente');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for barbeiros
CREATE POLICY "Anyone can view active barbeiros"
  ON public.barbeiros FOR SELECT
  USING (ativo = TRUE OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'operador'));

CREATE POLICY "Admins can manage barbeiros"
  ON public.barbeiros FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for servicos
CREATE POLICY "Anyone can view active servicos"
  ON public.servicos FOR SELECT
  USING (ativo = TRUE OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'operador'));

CREATE POLICY "Admins can manage servicos"
  ON public.servicos FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for agendamentos
CREATE POLICY "Users can view their own agendamentos"
  ON public.agendamentos FOR SELECT
  USING (
    cliente_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'operador')
  );

CREATE POLICY "Users can create their own agendamentos"
  ON public.agendamentos FOR INSERT
  WITH CHECK (cliente_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins and operadores can manage agendamentos"
  ON public.agendamentos FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'operador'));

-- RLS Policies for pagamentos
CREATE POLICY "Users can view their own pagamentos"
  ON public.pagamentos FOR SELECT
  USING (
    agendamento_id IN (
      SELECT id FROM public.agendamentos 
      WHERE cliente_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'operador')
  );

CREATE POLICY "Admins and operadores can manage pagamentos"
  ON public.pagamentos FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'operador'));

-- RLS Policies for cupons
CREATE POLICY "Anyone authenticated can view active cupons"
  ON public.cupons FOR SELECT
  USING (ativo = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage cupons"
  ON public.cupons FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for planos
CREATE POLICY "Anyone authenticated can view active planos"
  ON public.planos FOR SELECT
  USING (ativo = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage planos"
  ON public.planos FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for login_attempts
CREATE POLICY "Users can view their own login attempts"
  ON public.login_attempts FOR SELECT
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "System can manage login attempts"
  ON public.login_attempts FOR ALL
  USING (TRUE);

-- Insert initial data
INSERT INTO public.barbeiros (nome, foto) VALUES
  ('Carlos Silva', NULL),
  ('João Santos', NULL),
  ('Pedro Costa', NULL);

INSERT INTO public.servicos (nome, preco, duracao) VALUES
  ('Corte simples', 35.00, 30),
  ('Barba simples', 20.00, 30),
  ('Corte na tesoura', 25.00, 30),
  ('Barba na gilete', 25.00, 30),
  ('Corte degradê', 35.00, 30),
  ('Combo Corte + Barba', 50.00, 30),
  ('Sobrancelha', 15.00, 30);