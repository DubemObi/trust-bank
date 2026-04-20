import { api } from './api.js'

// Auth
export const authApi = {
  login: (data) => api.post('/api/Auth/login', data).then((r) => r.data),
  register: (data) => api.post('/api/Auth/register', data).then((r) => r.data),
  verifyEmail: (token) => api.get('/api/Auth/verify-email', { params: { token } }).then((r) => r.data),
  logout: () => api.post('/api/Auth/logout').then((r) => r.data).catch(() => null),
  deleteUser: (id) => api.delete(`/api/Auth/${id}`).then((r) => r.data),
}

// Users
export const usersApi = {
  list: () => api.get('/api/User').then((r) => r.data),
  get: (id) => api.get(`/api/User/${id}`).then((r) => r.data),
  update: (id, data) => api.put(`/api/User/${id}`, data).then((r) => r.data),
  me: () => api.get('/api/User/me').then((r) => r.data),
}

// Accounts
export const accountsApi = {
  list: () => api.get('/api/BankAccount').then((r) => r.data),
  get: (id) => api.get(`/api/BankAccount/${id}`).then((r) => r.data),
  create: (data) => api.post('/api/BankAccount', data).then((r) => r.data),
  update: (id, data) => api.put(`/api/BankAccount/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/api/BankAccount/${id}`).then((r) => r.data),
}

// Transactions
export const transactionsApi = {
  list: () => api.get('/api/Transaction').then((r) => r.data),
  get: (id) => api.get(`/api/Transaction/${id}`).then((r) => r.data),
  deposit: (data) => api.post('/api/Transaction/Deposit', data).then((r) => r.data),
  withdraw: (data) => api.post('/api/Transaction/Withdraw', data).then((r) => r.data),
  transfer: (data) => api.post('/api/Transaction/Transfer', data).then((r) => r.data),
}

// Cards
export const cardsApi = {
  list: () => api.get('/api/Card').then((r) => r.data),
  get: (id) => api.get(`/api/Card/${id}`).then((r) => r.data),
  remove: (id) => api.delete(`/api/Card/${id}`).then((r) => r.data),
}

// Card requests
export const cardRequestsApi = {
  list: () => api.get('/api/CardRequest').then((r) => r.data),
  get: (id) => api.get(`/api/CardRequest/${id}`).then((r) => r.data),
  create: (data) => api.post('/api/CardRequest', data).then((r) => r.data),
  remove: (id) => api.delete(`/api/CardRequest/${id}`).then((r) => r.data),
   approve: (id) =>
    api.post(`/api/CardRequest/approve`, { id }).then((r) => r.data),
  reject: (id) =>
    api.post(`/api/CardRequest/reject`, { id }).then((r) => r.data),
}

// Loans
export const loansApi = {
  list: () => api.get('/api/Loan').then((r) => r.data),
  get: (id) => api.get(`/api/Loan/${id}`).then((r) => r.data),
}

// Loan requests
export const loanRequestsApi = {
  list: () => api.get('/api/LoanRequest').then((r) => r.data),
  get: (id) => api.get(`/api/LoanRequest/${id}`).then((r) => r.data),
  create: (data) => api.post('/api/LoanRequest', data).then((r) => r.data),
  remove: (id) => api.delete(`/api/LoanRequest/${id}`).then((r) => r.data),
  approve: (id) =>
    api.post(`/api/LoanRequest/approve`, { id }).then((r) => r.data),
  reject: (id) =>
    api.post(`/api/LoanRequest/reject`, { id }).then((r) => r.data),
};

// Roles

export const rolesApi = {
  list: () => api.get("/api/Role").then((r) => r.data),
  get: (id) => api.get(`/api/Role/${id}`).then((r) => r.data),
  create: (data) =>
    api.post("/api/Role", data).then((r) => r.data),
  update: (id, data) =>
    api.put(`/api/Role/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/api/Role/${id}`).then((r) => r.data),
  assign: (data) =>
    api.post(`/api/Role/assign`, data).then((r) => r.data),
};