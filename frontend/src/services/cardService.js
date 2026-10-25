import api from './api';

export const cardService = {
  getCardsByAccount: async (accountId) => {
    const response = await api.get(`/cards/account/${accountId}`);
    return response.data;
  },

  issueCard: async (data) => {
    const response = await api.post('/cards', data);
    return response.data;
  },

  toggleCardStatus: async (cardId, status) => {
    const response = await api.patch(`/cards/${cardId}/status`, { status });
    return response.data;
  },
};

export default cardService;
