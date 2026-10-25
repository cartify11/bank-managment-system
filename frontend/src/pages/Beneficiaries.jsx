import React, { useState } from 'react';
import { colors, typography } from '../shared/design-system';
import AppCard from '../components/ui/AppCard';
import AppTable from '../components/ui/AppTable';
import AppBadge from '../components/ui/AppBadge';
import AppButton from '../components/ui/AppButton';
import AppModal from '../components/ui/AppModal';
import AppInput from '../components/ui/AppInput';
import { PlusCircle, Trash2, SendHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dataStore from '../services/dataStore';

export const Beneficiaries = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('Enterprise Bank');
  const navigate = useNavigate();

  const [beneficiaries, setBeneficiaries] = useState(() => dataStore.getBeneficiaries());

  const handleAdd = (e) => {
    e.preventDefault();
    const updated = [
      ...beneficiaries,
      { id: Date.now(), name, account: accountNumber, bank: bankName, status: 'ACTIVE' }
    ];
    setBeneficiaries(updated);
    dataStore.saveBeneficiaries(updated);
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    const updated = beneficiaries.filter(b => b.id !== id);
    setBeneficiaries(updated);
    dataStore.saveBeneficiaries(updated);
  };

  const columns = [
    { header: 'Beneficiary Name', render: (row) => <span style={{ fontWeight: typography.fontWeight.semibold }}>{row.name}</span> },
    { header: 'Account Number', accessor: 'account' },
    { header: 'Bank Name', accessor: 'bank' },
    { header: 'Status', render: (row) => <AppBadge variant="success">{row.status}</AppBadge> },
    { header: 'Actions', render: (row) => (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <AppButton size="sm" variant="outline" icon={SendHorizontal} onClick={() => navigate('/transfers')}>
          Send Money
        </AppButton>
        <button onClick={() => handleDelete(row.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.dangerText }}>
          <Trash2 size={16} />
        </button>
      </div>
    )},
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            Saved Transfer Beneficiaries
          </h1>
          <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginTop: '0.2rem' }}>
            Manage saved recipient accounts for fast and secure fund transfers
          </div>
        </div>
        <AppButton variant="primary" icon={PlusCircle} onClick={() => setModalOpen(true)}>Add Beneficiary</AppButton>
      </div>

      <AppCard title="Beneficiary Directory">
        <AppTable columns={columns} data={beneficiaries} />
      </AppCard>

      <AppModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Transfer Beneficiary">
        <form onSubmit={handleAdd}>
          <AppInput label="Recipient Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <AppInput label="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
          <AppInput label="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} required />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <AppButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AppButton>
            <AppButton type="submit" variant="primary">Save Beneficiary</AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default Beneficiaries;


