import api from './api';

export const supportTicketService = {
  getTicketsByCustomer: async (customerId) => {
    const response = await api.get(`/support-tickets/customer/${customerId}`);
    return response.data;
  },

  getAllTickets: async () => {
    const response = await api.get('/support-tickets');
    return response.data;
  },

  createTicket: async (data) => {
    const response = await api.post('/support-tickets', data);
    return response.data;
  },
};

export default supportTicketService;
