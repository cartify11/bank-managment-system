import api from './api';

export const fixedDepositService = {
  getFixedDeposits: async (accountId) => {
    const response = await api.get(`/fixed-deposits/account/${accountId}`);
    return response.data;
  },

  createFixedDeposit: async (data) => {
    const response = await api.post('/fixed-deposits', data);
    return response.data;
  },
};

export default fixedDepositService;
