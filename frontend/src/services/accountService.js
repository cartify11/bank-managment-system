import api from './api';

export const accountService = {
  createAccount: async (accountData) => {
    const response = await api.post('/accounts', accountData);
    return response.data;
  },

  getAllAccounts: async () => {
    const response = await api.get('/accounts');
    return response.data;
  },

  getAccountByNumber: async (accountNumber) => {
    const response = await api.get(`/accounts/${accountNumber}`);
    return response.data;
  },

  getAccountsByCustomerId: async (customerId) => {
    const response = await api.get(`/accounts/customer/${customerId}`);
    return response.data;
  },

  getAccountTypes: async () => {
    const response = await api.get('/account-types');
    return response.data;
  },
};

export default accountService;
