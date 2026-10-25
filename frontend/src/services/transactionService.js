import api from './api';

export const transactionService = {
  processTransaction: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },

  getAllTransactions: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },

  getTransactionByReference: async (reference) => {
    const response = await api.get(`/transactions/reference/${reference}`);
    return response.data;
  },

  getTransactionsByAccount: async (accountNumber) => {
    const response = await api.get(`/transactions/account/${accountNumber}`);
    return response.data;
  },
};

export default transactionService;
