import { supabase } from '@/integrations/supabase/client';

// Barbeiros API
export const barbeirosApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('barbeiros')
      .select('*')
      .order('nome');
    if (error) throw error;
    return data;
  },
  create: async (barbeiro) => {
    const { data, error } = await supabase
      .from('barbeiros')
      .insert(barbeiro)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  update: async (id, barbeiro) => {
    const { data, error } = await supabase
      .from('barbeiros')
      .update(barbeiro)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id) => {
    const { error } = await supabase
      .from('barbeiros')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// Servicos API
export const servicosApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .order('nome');
    if (error) throw error;
    return data;
  },
  create: async (servico) => {
    const { data, error } = await supabase
      .from('servicos')
      .insert(servico)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  update: async (id, servico) => {
    const { data, error } = await supabase
      .from('servicos')
      .update(servico)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id) => {
    const { error } = await supabase
      .from('servicos')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// Agendamentos API
export const agendamentosApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        barbeiro:barbeiros(id, nome),
        servico:servicos(id, nome, preco, duracao),
        cliente:profiles(id, nome, telefone)
      `)
      .order('data', { ascending: true })
      .order('hora_inicio', { ascending: true });
    if (error) throw error;
    return data;
  },
  getByUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');
    
    // Get profile id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (profileError) throw profileError;
    
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        barbeiro:barbeiros(id, nome),
        servico:servicos(id, nome, preco, duracao)
      `)
      .eq('cliente_id', profile.id)
      .order('data', { ascending: true })
      .order('hora_inicio', { ascending: true });
    if (error) throw error;
    return data;
  },
  create: async (agendamento) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');
    
    // Get profile id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (profileError) throw profileError;
    
    const { data, error } = await supabase
      .from('agendamentos')
      .insert({ ...agendamento, cliente_id: profile.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  update: async (id, agendamento) => {
    const { data, error } = await supabase
      .from('agendamentos')
      .update(agendamento)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id) => {
    const { error } = await supabase
      .from('agendamentos')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// Galeria API
export const galeriaApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('galeria')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  create: async (item) => {
    const { data, error } = await supabase
      .from('galeria')
      .insert(item)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  delete: async (id) => {
    const { error } = await supabase
      .from('galeria')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// Pagamentos API
export const pagamentosApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('pagamentos')
      .select(`
        *,
        agendamento:agendamentos(
          *,
          barbeiro:barbeiros(nome),
          servico:servicos(nome, preco),
          cliente:profiles(nome)
        )
      `)
      .order('data_pagamento', { ascending: false });
    if (error) throw error;
    return data;
  },
  create: async (pagamento) => {
    const { data, error } = await supabase
      .from('pagamentos')
      .insert(pagamento)
      .select()
      .single();
    if (error) throw error;
    
    // Mark agendamento as paid
    await supabase
      .from('agendamentos')
      .update({ pago: true })
      .eq('id', pagamento.agendamento_id);
    
    return data;
  },
};

// Cupons API
export const cuponsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('cupons')
      .select('*')
      .order('valido_ate', { ascending: false });
    if (error) throw error;
    return data;
  },
  validate: async (codigo) => {
    const { data, error } = await supabase
      .from('cupons')
      .select('*')
      .eq('codigo', codigo)
      .eq('ativo', true)
      .gte('valido_ate', new Date().toISOString().split('T')[0])
      .maybeSingle();
    if (error) throw error;
    return data;
  },
};

// Planos API
export const planosApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('planos')
      .select('*')
      .eq('ativo', true)
      .order('preco');
    if (error) throw error;
    return data;
  },
};

export default {
  barbeiros: barbeirosApi,
  servicos: servicosApi,
  agendamentos: agendamentosApi,
  galeria: galeriaApi,
  pagamentos: pagamentosApi,
  cupons: cuponsApi,
  planos: planosApi,
};
