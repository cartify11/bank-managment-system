import api from './api';

export const loanService = {
  getLoansByCustomer: async (customerId) => {
    const response = await api.get(`/loans/customer/${customerId}`);
    return response.data;
  },

  applyForLoan: async (data) => {
    const response = await api.post('/loans', data);
    return response.data;
  },

  makeRepayment: async (loanId, amount) => {
    const response = await api.post(`/loans/${loanId}/repay`, { amount });
    return response.data;
  },
};

export default loanService;
