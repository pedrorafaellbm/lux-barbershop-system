const API_URL = 'http://localhost:3000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Set token to localStorage
export const setToken = (token) => localStorage.setItem('token', token);

// Remove token from localStorage
export const removeToken = () => localStorage.removeItem('token');

// Base fetch with auth headers
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro na requisição' }));
    throw new Error(error.message || 'Erro na requisição');
  }

  return response.json();
};

// Auth API
export const authApi = {
  register: (data) => fetchWithAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  login: async (email, password) => {
    const response = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },
  
  me: () => fetchWithAuth('/auth/me'),
  
  logout: () => {
    removeToken();
  },
};

// Barbeiros API
export const barbeirosApi = {
  getAll: () => fetchWithAuth('/barbeiros'),
  create: (data) => fetchWithAuth('/barbeiros', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchWithAuth(`/barbeiros/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchWithAuth(`/barbeiros/${id}`, {
    method: 'DELETE',
  }),
};

// Servicos API
export const servicosApi = {
  getAll: () => fetchWithAuth('/servicos'),
  create: (data) => fetchWithAuth('/servicos', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchWithAuth(`/servicos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchWithAuth(`/servicos/${id}`, {
    method: 'DELETE',
  }),
};

// Agendamentos API
export const agendamentosApi = {
  getAll: () => fetchWithAuth('/agendamentos'),
  getByUser: () => fetchWithAuth('/agendamentos/me'),
  create: (data) => fetchWithAuth('/agendamentos', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchWithAuth(`/agendamentos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchWithAuth(`/agendamentos/${id}`, {
    method: 'DELETE',
  }),
};

export default {
  auth: authApi,
  barbeiros: barbeirosApi,
  servicos: servicosApi,
  agendamentos: agendamentosApi,
};
