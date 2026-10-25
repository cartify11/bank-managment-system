import api from './api';

export const auditLogService = {
  getAllAuditLogs: async () => {
    const response = await api.get('/audit-logs');
    return response.data;
  },
};

export default auditLogService;
