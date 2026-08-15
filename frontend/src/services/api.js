const BASE_URL = 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('hfp_token');

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Error en la solicitud' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
};

// --- Auth ---
export const authApi = {
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),
};

// --- Service Requests ---
export const requestsApi = {
  create: (data) => request('/requests', { method: 'POST', body: JSON.stringify(data) }),
  myRequests: () => request('/requests/mine'),
  available: (params = '') => request(`/requests/available${params}`),
  getById: (id) => request(`/requests/${id}`),
  accept: (id) => request(`/requests/${id}/accept`, { method: 'PUT' }),
  updateStatus: (id, status) => request(`/requests/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  cancel: (id) => request(`/requests/${id}/cancel`, { method: 'PUT' }),
};

// --- Reviews ---
export const reviewsApi = {
  create: (data) => request('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  forTechnician: (id) => request(`/reviews/technician/${id}`),
};

// --- Categories ---
export const categoriesApi = {
  list: () => request('/services/categories'),
};

// --- Notifications ---
export const notificationsApi = {
  list: () => request('/notifications'),
  markRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  unreadCount: () => request('/notifications/unread-count'),
};

// --- Schedule ---
export const scheduleApi = {
  create: (data) => request('/schedule', { method: 'POST', body: JSON.stringify(data) }),
  mine: () => request('/schedule/mine'),
  update: (id, data) => request(`/schedule/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/schedule/${id}`, { method: 'DELETE' }),
};

// --- Verification (KYC) ---
export const verificationApi = {
  pending: () => request('/verification/pending'),
  approve: (id) => request(`/verification/${id}/approve`, { method: 'PUT' }),
  reject: (id, reason) => request(`/verification/${id}/reject`, { method: 'PUT', body: JSON.stringify({ reason }) }),
};

// --- Admin ---
export const adminApi = {
  users: (params = '') => request(`/users${params}`),
  getUser: (id) => request(`/users/${id}`),
  toggleUser: (id) => request(`/users/${id}/toggle`, { method: 'PUT' }),
  overview: () => request('/reports/overview'),
  byCategory: () => request('/reports/by-category'),
  byStatus: () => request('/reports/by-status'),
};

// --- Companies ---
export const companiesApi = {
  mine: () => request('/companies/mine'),
  employees: () => request('/companies/mine/employees'),
  addEmployee: (data) => request('/companies/mine/employees', { method: 'POST', body: JSON.stringify(data) }),
  removeEmployee: (id) => request(`/companies/mine/employees/${id}`, { method: 'DELETE' }),
  assignJob: (data) => request('/companies/mine/assign', { method: 'POST', body: JSON.stringify(data) }),
};
