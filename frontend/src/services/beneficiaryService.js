import api from './api';

export const beneficiaryService = {
  getBeneficiaries: async (customerId) => {
    const response = await api.get(`/beneficiaries/customer/${customerId}`);
    return response.data;
  },

  addBeneficiary: async (data) => {
    const response = await api.post('/beneficiaries', data);
    return response.data;
  },

  deleteBeneficiary: async (id) => {
    const response = await api.delete(`/beneficiaries/${id}`);
    return response.data;
  },
};

export default beneficiaryService;
