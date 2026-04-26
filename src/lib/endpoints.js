import { api } from './api.js'

// // Auth
// export const authApi = {
//   login: (data) => api.post('/api/auth/login', data).then((r) => r.data),
//   register: (data) => api.post('/api/auth/register', data).then((r) => r.data),
//   verifyEmail: (token) => api.get('/api/auth/verify-email', { params: { token } }).then((r) => r.data),
//   logout: () => api.post('/api/auth/logout').then((r) => r.data).catch(() => null),
//   deleteUser: (id) => api.delete(`/api/auth/${id}`).then((r) => r.data),
// }

// // Users
// export const usersApi = {
//   list: () => api.get('/api/User').then((r) => r.data),
//   get: (id) => api.get(`/api/User/${id}`).then((r) => r.data),
//   update: (id, data) => api.put(`/api/User/${id}`, data).then((r) => r.data),
//   me: () => api.get('/api/User/me').then((r) => r.data),
// }

// // Accounts
// export const accountsApi = {
//   list: () => api.get('/api/BankAccount').then((r) => r.data),
//   get: (id) => api.get(`/api/BankAccount/${id}`).then((r) => r.data),
//   create: (data) => api.post('/api/BankAccount', data).then((r) => r.data),
//   update: (id, data) => api.put(`/api/BankAccount/${id}`, data).then((r) => r.data),
//   remove: (id) => api.delete(`/api/BankAccount/${id}`).then((r) => r.data),
// }

// // Transactions
// export const transactionsApi = {
//   list: () => api.get('/api/Transaction').then((r) => r.data),
//   get: (id) => api.get(`/api/Transaction/${id}`).then((r) => r.data),
//   deposit: (data) => api.post('/api/Transaction/Deposit', data).then((r) => r.data),
//   withdraw: (data) => api.post('/api/Transaction/Withdraw', data).then((r) => r.data),
//   transfer: (data) => api.post('/api/Transaction/Transfer', data).then((r) => r.data),
// }

// // Cards
// export const cardsApi = {
//   list: () => api.get('/api/Card').then((r) => r.data),
//   get: (id) => api.get(`/api/Card/${id}`).then((r) => r.data),
//   remove: (id) => api.delete(`/api/Card/${id}`).then((r) => r.data),
// }

// // Card requests
// export const cardRequestsApi = {
//   list: () => api.get('/api/CardRequest').then((r) => r.data),
//   get: (id) => api.get(`/api/CardRequest/${id}`).then((r) => r.data),
//   create: (data) => api.post('/api/CardRequest', data).then((r) => r.data),
//   remove: (id) => api.delete(`/api/CardRequest/${id}`).then((r) => r.data),
//    approve: (id) =>
//     api.post(`/api/CardRequest/approve`, { id }).then((r) => r.data),
//   reject: (id) =>
//     api.post(`/api/CardRequest/reject`, { id }).then((r) => r.data),
// }

// // Loans
// export const loansApi = {
//   list: () => api.get('/api/Loan').then((r) => r.data),
//   get: (id) => api.get(`/api/Loan/${id}`).then((r) => r.data),
// }

// // Loan requests
// export const loanRequestsApi = {
//   list: () => api.get('/api/LoanRequest').then((r) => r.data),
//   get: (id) => api.get(`/api/LoanRequest/${id}`).then((r) => r.data),
//   create: (data) => api.post('/api/LoanRequest', data).then((r) => r.data),
//   remove: (id) => api.delete(`/api/LoanRequest/${id}`).then((r) => r.data),
//   approve: (id) =>
//     api.post(`/api/LoanRequest/approve`, { id }).then((r) => r.data),
//   reject: (id) =>
//     api.post(`/api/LoanRequest/reject`, { id }).then((r) => r.data),
// };

// // Roles

// export const rolesApi = {
//   list: () => api.get("/api/Role").then((r) => r.data),
//   get: (id) => api.get(`/api/Role/${id}`).then((r) => r.data),
//   create: (data) =>
//     api.post("/api/Role", data).then((r) => r.data),
//   update: (id, data) =>
//     api.put(`/api/Role/${id}`, data).then((r) => r.data),
//   remove: (id) => api.delete(`/api/Role/${id}`).then((r) => r.data),
//   assign: (data) =>
//     api.post(`/api/Role/assign`, data).then((r) => r.data),
// };


    
  //  import { api } from './api.js'

// Auth
export const authApi = {
  login: (data) => api.post('/api/auth/login', data).then((r) => r.data),
  register: (data) => api.post('/api/auth/register', data).then((r) => r.data), // Corrected path
  verifyEmail: (token) => api.get('/api/auth/verify-email', { params: { token } }).then((r) => r.data),
  logout: () => api.post('/api/auth/logout').then((r) => r.data).catch(() => null),
  deleteUser: (email) => api.delete(`/api/auth/delete-user/${email}`).then((r) => r.data), // Changed parameter to email and corrected path
}

// Users
export const usersApi = {
  list: () => api.get('/api/User').then((r) => r.data),
  get: (id) => api.get(`/api/User/${id}`).then((r) => r.data),
  update: (id, data) => api.put(`/api/User/${id}`, data).then((r) => r.data),
  me: () => api.get('/api/User/me').then((r) => r.data), // Already correct, ensures consistency
}

// Accounts
export const accountsApi = {
  list: () => api.get('/api/bankaccount').then((r) => r.data),
  get: (id) => api.get(`/api/bankaccount/${id}`).then((r) => r.data),
  myAccounts: () => api.get('/api/bankaccount/my-accounts').then((r) => r.data),
  create: (data) => api.post('/api/bankaccount', data).then((r) => r.data),
  update: (id, data) => api.put(`/api/bankaccount/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/api/bankaccount/${id}`).then((r) => r.data),
}

// Transactions
export const transactionsApi = {
  list: () => api.get('/api/Transaction').then((r) => r.data),
  myTransactions: () => api.get('/api/Transaction/my-transactions').then((r) => r.data), 
  get: (id) => api.get(`/api/Transaction/${id}`).then((r) => r.data),
  deposit: (data) => api.post('/api/Transaction/Deposit', data).then((r) => r.data),
  withdraw: (data) => api.post('/api/Transaction/Withdraw', data).then((r) => r.data),
  transfer: (data) => api.post('/api/Transaction/Transfer', data).then((r) => r.data), 
}

// Cards
export const cardsApi = {
  list: () => api.get('/api/Card').then((r) => r.data),
    myCards: () => api.get('/api/Card/my-cards').then((r) => r.data), 
  get: (id) => api.get(`/api/Card/${id}`).then((r) => r.data),
  remove: (id) => api.delete(`/api/Card/${id}`).then((r) => r.data),
}

// Card requests
export const cardRequestsApi = {
  list: () => api.get('/api/CardRequest').then((r) => r.data),
  myRequests: () => api.get('/api/CardRequest/my-requests').then((r) => r.data),
  get: (id) => api.get(`/api/CardRequest/${id}`).then((r) => r.data),
  create: (data) => api.post('/api/CardRequest', data).then((r) => r.data),
  update: (id, data) => api.put(`/api/CardRequest/${id}`, data).then((r) => r.data), // Added update method based on Swagger
  
  approve: (data) =>
    api.post('/api/CardRequest/approve', data).then((r) => r.data),
  reject: (data) => 
    api.post('/api/CardRequest/reject', data).then((r) => r.data),
  remove: (id) => api.delete(`/api/CardRequest/${id}`).then((r) => r.data),
}

// Loans
export const loansApi = {
  list: () => api.get('/api/Loan').then((r) => r.data),
    myLoans: () => api.get('/api/Loan/my-loans').then((r) => r.data), 
  get: (id) => api.get(`/api/Loan/${id}`).then((r) => r.data),
  create: (data) => api.post('/api/Loan', data).then((r) => r.data), // Added create method based on Swagger
  update: (id, data) => api.put(`/api/Loan/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/api/Loan/${id}`).then((r) => r.data),
}

// Loan requests
export const loanRequestsApi = {
  list: () => api.get('/api/LoanRequest').then((r) => r.data),
  get: (id) => api.get(`/api/LoanRequest/${id}`).then((r) => r.data),
  myRequests: () => api.get('/api/LoanRequest/my-requests').then((r) => r.data),
  create: (data) => api.post('/api/LoanRequest', data).then((r) => r.data),
  update: (id, data) => api.put(`/api/LoanRequest/${id}`, data).then((r) => r.data), // Added update method based on Swagger
  approve: (data) => // Updated to match LoanApprovalDTO
    api.post('/api/LoanRequest/approve', data).then((r) => r.data),
  reject: (data) => // Implemented reject matching LoanApprovalDTO structure
    api.post('/api/LoanRequest/reject', data).then((r) => r.data),
  remove: (id) => api.delete(`/api/LoanRequest/${id}`).then((r) => r.data),
};

// Roles
export const rolesApi = {
  list: () => api.get("/api/roles").then((r) => r.data), // Corrected path
  get: (roleId) => api.get(`/api/roles/${roleId}`).then((r) => r.data), // Corrected path and parameter name
  create: (data) => api.post("/api/roles", data).then((r) => r.data), // Corrected path
  update: (roleId, data) =>
    api.put("/api/roles", data, { params: { roleId } }).then((r) => r.data),
  assign: (data) => api.post(`/api/roles/assign-role-to-user`, data).then((r) => r.data), // Corrected path
  remove: (roleId) =>
    api.delete("/api/roles", { params: { roleId } }).then((r) => r.data),
};
