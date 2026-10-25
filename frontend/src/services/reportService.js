import api from './api';

export const reportService = {
  getFinancialSummary: async () => {
    const response = await api.get('/reports/financial-summary');
    return response.data;
  },

  downloadAccountStatement: async (accountNumber, startDate, endDate, format = 'pdf') => {
    const response = await api.get(`/reports/statements/${accountNumber}?startDate=${startDate}&endDate=${endDate}&format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default reportService;
