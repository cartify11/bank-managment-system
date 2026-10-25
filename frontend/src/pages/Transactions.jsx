import React, { useState } from 'react';
import { colors, typography } from '../shared/design-system';
import AppCard from '../components/ui/AppCard';
import AppTable from '../components/ui/AppTable';
import AppBadge from '../components/ui/AppBadge';
import AppTabs from '../components/ui/AppTabs';
import AppInput from '../components/ui/AppInput';
import AppSelect from '../components/ui/AppSelect';
import AppButton from '../components/ui/AppButton';
import AppModal from '../components/ui/AppModal';
import AppSearchableSelect from '../components/ui/AppSearchableSelect';
import { Search, Download, ArrowUpRight, ArrowDownRight, PlusCircle } from 'lucide-react';
import dataStore from '../services/dataStore';

export const Transactions = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [transactions, setTransactions] = useState(() => dataStore.getTransactions());
  const allAccounts = dataStore.getAccounts();

  const accountOptions = allAccounts.map(a => ({
    value: a.accountNumber,
    label: `${a.accountNumber} - ${a.customerName}`,
    sublabel: `${a.type} | Balance: ${a.balance}`
  }));

  React.useEffect(() => {
    const handleSync = () => setTransactions(dataStore.getTransactions());
    window.addEventListener('bms_data_changed', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('bms_data_changed', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [sourceAcc, setSourceAcc] = useState(allAccounts[0]?.accountNumber || 'ACC109283741');
  const [targetAcc, setTargetAcc] = useState(allAccounts[1]?.accountNumber || 'ACC981273645');
  const [type, setType] = useState('TRANSFER');
  const [amount, setAmount] = useState('');

  const handleCreateTransaction = (e) => {
    e.preventDefault();
    if (!amount) return;

    const newTx = {
      ref: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      source: type === 'DEPOSIT' ? '-' : sourceAcc,
      target: type === 'WITHDRAWAL' ? '-' : targetAcc,
      type,
      amount: `PKR ${parseFloat(amount).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      fee: 'PKR 0.00',
      status: 'Completed',
      date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
    };

    dataStore.executeTransaction(newTx);
    setTransactions(dataStore.getTransactions());

    setAmount('');
    setModalOpen(false);
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesTab = activeTab === 'ALL' || tx.type === activeTab;
    const matchesSearch = tx.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.target.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const columns = [
    { header: 'Reference', render: (row) => (
      <span style={{ fontWeight: typography.fontWeight.semibold, color: colors.primary }}>
        {row.ref}
      </span>
    )},
    { header: 'Type', render: (row) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: typography.fontWeight.medium }}>
        {row.type === 'DEPOSIT' ? <ArrowDownRight size={16} style={{ color: colors.successText }} /> : <ArrowUpRight size={16} style={{ color: colors.dangerText }} />}
        {row.type}
      </span>
    )},
    { header: 'Source Account', accessor: 'source' },
    { header: 'Target Account', accessor: 'target' },
    { header: 'Amount', render: (row) => (
      <span style={{ fontWeight: typography.fontWeight.bold, color: row.type === 'DEPOSIT' ? colors.successText : colors.textPrimary }}>
        {row.amount}
      </span>
    )},
    { header: 'Fee', accessor: 'fee' },
    { header: 'Date', accessor: 'date' },
    { header: 'Status', render: (row) => (
      <AppBadge variant={row.status === 'Completed' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger'}>
        {row.status}
      </AppBadge>
    )},
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            Transactions Audit Log
          </h1>
          <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginTop: '0.2rem' }}>
            Complete immutable transaction record of deposits, withdrawals, and internal transfers
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <AppButton variant="secondary" icon={Download} onClick={() => alert('Transactions exported as CSV!')}>Export CSV</AppButton>
          <AppButton variant="primary" icon={PlusCircle} onClick={() => setModalOpen(true)}>+ New Transaction</AppButton>
        </div>
      </div>

      <AppCard>
        <AppTabs
          tabs={[
            { id: 'ALL', label: 'All Transactions' },
            { id: 'DEPOSIT', label: 'Deposits' },
            { id: 'WITHDRAWAL', label: 'Withdrawals' },
            { id: 'TRANSFER', label: 'Transfers' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div style={{ marginBottom: '1rem' }}>
          <AppInput
            placeholder="Search by transaction reference ID or account number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>

        <AppTable columns={columns} data={filteredTransactions} />
      </AppCard>

      {/* New Transaction Modal */}
      <AppModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Transaction Record">
        <form onSubmit={handleCreateTransaction}>
          <AppSelect
            label="Transaction Category"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { value: 'TRANSFER', label: 'Internal Transfer' },
              { value: 'DEPOSIT', label: 'Cash / Check Deposit' },
              { value: 'WITHDRAWAL', label: 'ATM / Teller Withdrawal' },
            ]}
          />

          {type !== 'DEPOSIT' && (
            <AppSearchableSelect
              label="Source Account"
              placeholder="Search sender account or holder name..."
              value={sourceAcc}
              onChange={(e) => setSourceAcc(e.target.value)}
              options={accountOptions}
              allowCustom={true}
              required
            />
          )}

          {type !== 'WITHDRAWAL' && (
            <AppSearchableSelect
              label="Target / Beneficiary Account"
              placeholder="Search beneficiary account or holder name..."
              value={targetAcc}
              onChange={(e) => setTargetAcc(e.target.value)}
              options={accountOptions}
              allowCustom={true}
              required
            />
          )}

          <AppInput
            label="Transaction Amount (PKR)"
            type="number"
            placeholder="e.g. 500.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <AppButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AppButton>
            <AppButton type="submit" variant="primary">Process Transaction</AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default Transactions;


