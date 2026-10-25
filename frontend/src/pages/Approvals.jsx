import React, { useState } from 'react';
import { colors, typography } from '../shared/design-system';
import AppCard from '../components/ui/AppCard';
import AppTable from '../components/ui/AppTable';
import AppBadge from '../components/ui/AppBadge';
import AppButton from '../components/ui/AppButton';
import { Check, X, ShieldAlert } from 'lucide-react';
import dataStore from '../services/dataStore';

export const Approvals = () => {
  const [approvalsData, setApprovalsData] = useState(() => dataStore.getApprovals());

  const handleAction = (id, newStatus) => {
    const updated = approvalsData.filter(item => item.id !== id);
    setApprovalsData(updated);
    dataStore.saveApprovals(updated);
    alert(`Operation ${id} has been ${newStatus.toLowerCase()}!`);
  };

  const columns = [
    { header: 'Request ID', render: (row) => <span style={{ fontWeight: typography.fontWeight.semibold, color: colors.primary }}>{row.id}</span> },
    { header: 'Operation Type', accessor: 'type' },
    { header: 'Initiated By (Maker)', accessor: 'maker' },
    { header: 'Operation Details', accessor: 'details' },
    { header: 'Submitted Date', accessor: 'date' },
    { header: 'Status', render: (row) => <AppBadge variant="warning">{row.status}</AppBadge> },
    { header: 'Manager Review (Checker)', render: (row) => (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <AppButton size="sm" variant="primary" icon={Check} onClick={() => handleAction(row.id, 'APPROVED')}>
          Approve
        </AppButton>
        <AppButton size="sm" variant="danger" icon={X} onClick={() => handleAction(row.id, 'REJECTED')}>
          Reject
        </AppButton>
      </div>
    )},
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            Maker-Checker Approval Workflows
          </h1>
          <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginTop: '0.2rem' }}>
            Manager approval queue for high-value transactions, loan authorizations, and account status modifications
          </div>
        </div>
      </div>

      <AppCard title="Pending Approvals Queue">
        <AppTable columns={columns} data={approvalsData} />
      </AppCard>
    </div>
  );
};

export default Approvals;


