import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, typography } from '../shared/design-system';
import AppCard from '../components/ui/AppCard';
import AppTable from '../components/ui/AppTable';
import AppBadge from '../components/ui/AppBadge';
import AppButton from '../components/ui/AppButton';
import AppInput from '../components/ui/AppInput';
import AppSelect from '../components/ui/AppSelect';
import AppSearchableSelect from '../components/ui/AppSearchableSelect';
import AppModal from '../components/ui/AppModal';
import { Search, PlusCircle, Eye } from 'lucide-react';
import dataStore from '../services/dataStore';

export const Accounts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState(() => dataStore.getAccounts());
  const allCustomers = dataStore.getCustomers();

  const customerOptions = allCustomers.map(c => ({
    value: c.name,
    label: c.name,
    sublabel: `${c.email || ''}${c.phone ? ' | ' + c.phone : ''}`
  }));

  React.useEffect(() => {
    const handleSync = () => setAccounts(dataStore.getAccounts());
    window.addEventListener('bms_data_changed', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('bms_data_changed', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  // Modal & Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [accountType, setAccountType] = useState('Savings');
  const [initialDeposit, setInitialDeposit] = useState('1000');

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (!customerName) return;

    const newAccNum = `ACC${Math.floor(100000000 + Math.random() * 900000000)}`;
    const depositAmt = parseFloat(initialDeposit || 0).toFixed(2);

    const newAccount = {
      accountNumber: newAccNum,
      customerName,
      type: accountType,
      balance: `PKR ${parseFloat(depositAmt).toLocaleString('en-PK', { minimumFractionDigits: 2 })}`,
      currency: 'PKR',
      status: 'Active',
    };

    const updated = [newAccount, ...accounts];
    setAccounts(updated);
    dataStore.saveAccounts(updated);

    setCustomerName('');
    setAccountType('Savings');
    setInitialDeposit('1000');
    setModalOpen(false);
  };

  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          acc.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || acc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const columns = [
    { header: 'Account Number', render: (row) => (
      <span style={{ fontWeight: typography.fontWeight.semibold, color: colors.primary }}>
        {row.accountNumber}
      </span>
    )},
    { header: 'Customer Holder', accessor: 'customerName' },
    { header: 'Account Type', accessor: 'type' },
    { header: 'Balance', render: (row) => (
      <span style={{ fontWeight: typography.fontWeight.bold }}>
        {row.balance}
      </span>
    )},
    { header: 'Status', render: (row) => (
      <AppBadge variant={row.status === 'Active' ? 'success' : row.status === 'Frozen' ? 'warning' : 'danger'}>
        {row.status}
      </AppBadge>
    )},
    { header: 'Actions', render: (row) => (
      <button onClick={() => navigate(`/accounts/${row.accountNumber}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.primary }}>
        <Eye size={16} /> View Details
      </button>
    )},
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            Account Management
          </h1>
          <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginTop: '0.2rem' }}>
            List of all Savings and Current accounts across the bank
          </div>
        </div>
        <AppButton variant="primary" icon={PlusCircle} onClick={() => setModalOpen(true)}>Create New Account</AppButton>
      </div>

      <AppCard>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <AppInput
              placeholder="Search by account number or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
          <div style={{ width: '180px' }}>
            <AppSelect
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Account Types' },
                { value: 'Savings', label: 'Savings Only' },
                { value: 'Current', label: 'Current Only' },
              ]}
            />
          </div>
        </div>

        <AppTable columns={columns} data={filteredAccounts} />
      </AppCard>

      {/* Create Account Modal */}
      <AppModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Bank Account">
        <form onSubmit={handleCreateAccount}>
          <AppSearchableSelect
            label="Customer Holder Name"
            placeholder="Search existing customer or enter new name..."
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            options={customerOptions}
            allowCustom={true}
            required
          />
          <AppSelect
            label="Account Type"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            options={[
              { value: 'Savings', label: 'Savings Account (Interest Bearing)' },
              { value: 'Current', label: 'Current Account (Checking)' },
            ]}
          />
          <AppInput
            label="Initial Deposit Amount (PKR)"
            type="number"
            placeholder="1000.00"
            value={initialDeposit}
            onChange={(e) => setInitialDeposit(e.target.value)}
            required
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <AppButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AppButton>
            <AppButton type="submit" variant="primary">Open Account</AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default Accounts;


