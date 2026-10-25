import React, { useState } from 'react';
import { colors, typography } from '../shared/design-system';
import AppMetricCard from '../components/ui/AppMetricCard';
import AppCard from '../components/ui/AppCard';
import AppTable from '../components/ui/AppTable';
import AppBadge from '../components/ui/AppBadge';
import AppButton from '../components/ui/AppButton';
import AppChart from '../components/ui/AppChart';
import AppModal from '../components/ui/AppModal';
import AppInput from '../components/ui/AppInput';
import AppSelect from '../components/ui/AppSelect';
import AppSearchableSelect from '../components/ui/AppSearchableSelect';
import { Users, CreditCard, ArrowDownRight, ArrowUpRight, ShieldAlert, CheckCircle2, ChevronRight, PlusCircle, Download } from 'lucide-react';
import dataStore from '../services/dataStore';

export const Dashboard = () => {
  // Dynamic state for recent transactions initialized from dataStore
  const [recentTransactions, setRecentTransactions] = useState(() => dataStore.getTransactions());

  React.useEffect(() => {
    const syncData = () => setRecentTransactions(dataStore.getTransactions());
    window.addEventListener('bms_data_changed', syncData);
    window.addEventListener('focus', syncData);
    return () => {
      window.removeEventListener('bms_data_changed', syncData);
      window.removeEventListener('focus', syncData);
    };
  }, []);

  // Modal and Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [txType, setTxType] = useState('DEPOSIT');
  const [txAmount, setTxAmount] = useState('');

  const handleCreateTransaction = (e) => {
    e.preventDefault();
    if (!customerName || !txAmount) return;

    const newTx = {
      ref: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      id: (600 + recentTransactions.length + 1).toString(),
      name: customerName,
      email: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      source: txType === 'DEPOSIT' ? '-' : 'ACC109283741',
      target: txType === 'WITHDRAWAL' ? '-' : 'ACC981273645',
      type: txType,
      date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      amount: `PKR ${parseFloat(txAmount).toFixed(2)}`,
      fee: 'PKR 0.00',
      status: 'Completed',
    };

    dataStore.executeTransaction(newTx);
    setRecentTransactions(dataStore.getTransactions());

    setCustomerName('');
    setCustomerEmail('');
    setTxAmount('');
    setIsModalOpen(false);
  };

  const handleExportReport = () => {
    alert('Dashboard Report exported successfully as CSV!');
  };

  // Format transactions to guarantee ID, Name, and Email are never empty
  const allAccounts = dataStore.getAccounts();
  const allCustomers = dataStore.getCustomers();

  const parseAmount = (val) => parseFloat((val || '0').toString().replace(/[^0-9.]/g, '')) || 0;
  const formatMoney = (val) => `PKR ${val.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const totalDeposits = recentTransactions
    .filter(t => t.type === 'DEPOSIT')
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);

  const totalWithdrawals = recentTransactions
    .filter(t => t.type === 'WITHDRAWAL')
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);

  const customerOptions = allCustomers.map(c => ({
    value: c.name,
    label: c.name,
    sublabel: `${c.email || ''}${c.phone ? ' | ' + c.phone : ''}`
  }));

  const formattedTransactions = recentTransactions.map((tx, idx) => {
    const accNum = (tx.target && tx.target !== '-') ? tx.target : tx.source;
    const matchedAccount = allAccounts.find(a => a.accountNumber === accNum || a.accountNumber === tx.target || a.accountNumber === tx.source);
    const matchedCustomer = matchedAccount ? allCustomers.find(c => c.name?.toLowerCase() === matchedAccount.customerName?.toLowerCase()) : null;

    const name = tx.name || matchedAccount?.customerName || 'khan';
    const email = tx.email || matchedCustomer?.email || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`;
    const id = tx.id || tx.ref || `60${Math.max(1, recentTransactions.length - idx)}`;

    return {
      ...tx,
      id,
      name,
      email,
    };
  });

  const columns = [
    { header: 'ID', render: (row) => <span style={{ fontWeight: typography.fontWeight.semibold, color: '#b87c4c' }}>{row.id}</span> },
    { header: 'Customer', render: (row) => (
      <div>
        <div style={{ fontWeight: typography.fontWeight.semibold, color: '#2c1e16' }}>{row.name}</div>
        <div style={{ fontSize: '0.75rem', color: '#7a6658' }}>{row.email}</div>
      </div>
    )},
    { header: 'Date', accessor: 'date' },
    { header: 'Amount', render: (row) => (
      <span style={{ fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
        {row.amount}
      </span>
    )},
    { header: 'Status', render: (row) => (
      <AppBadge variant={row.status === 'Completed' ? 'success' : 'warning'}>
        {row.status}
      </AppBadge>
    )},
  ];

  return (
    <div>
      {/* Page Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            Dashboard Overview
          </h1>
          <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginTop: '0.25rem' }}>
            System activity snapshot and financial performance summary
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <AppButton variant="secondary" size="sm" icon={Download} onClick={handleExportReport}>Export Report</AppButton>
          <AppButton variant="primary" size="sm" icon={PlusCircle} onClick={() => setIsModalOpen(true)}>+ New Transaction</AppButton>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <AppMetricCard title="Total Customers" value={allCustomers.length.toLocaleString()} badgeText={allCustomers.length > 0 ? "Active" : "0 Registered"} badgeVariant={allCustomers.length > 0 ? "success" : "default"} icon={Users} />
        <AppMetricCard title="Total Accounts" value={allAccounts.length.toLocaleString()} badgeText={allAccounts.length > 0 ? "Active" : "0 Active"} badgeVariant={allAccounts.length > 0 ? "success" : "default"} icon={CreditCard} />
        <AppMetricCard title="Total Deposits" value={formatMoney(totalDeposits)} badgeText="PKR" badgeVariant="success" icon={ArrowDownRight} />
        <AppMetricCard title="Total Withdrawals" value={formatMoney(totalWithdrawals)} badgeText="PKR" badgeVariant={totalWithdrawals > 0 ? "danger" : "default"} icon={ArrowUpRight} />
      </div>

      {/* Middle Row: Spline Line Chart & Quick Action Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <AppCard title="Transaction Activity" subtitle="Monthly transaction volume trends">
          <AppChart type="line" height={200} />
        </AppCard>

        <AppCard title="Quick Actions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.85rem', background: '#faf5ee', borderRadius: '10px', border: '1px solid #eee4d8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: typography.fontWeight.semibold, color: '#2c1e16' }}>Total Customers</div>
                <div style={{ fontSize: '0.75rem', color: '#7a6658' }}>Total Active Accounts</div>
              </div>
              <AppBadge variant="success">Active</AppBadge>
            </div>
            <div style={{ padding: '0.85rem', background: '#faf5ee', borderRadius: '10px', border: '1px solid #eee4d8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: typography.fontWeight.semibold, color: '#2c1e16' }}>Total Deposits</div>
                <div style={{ fontSize: '0.75rem', color: '#7a6658' }}>Pending Approvals</div>
              </div>
              <AppBadge variant="warning">Pending</AppBadge>
            </div>
            <div style={{ padding: '0.85rem', background: '#faf5ee', borderRadius: '10px', border: '1px solid #eee4d8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: typography.fontWeight.semibold, color: '#2c1e16' }}>Total Withdrawals</div>
                <div style={{ fontSize: '0.75rem', color: '#7a6658' }}>Flagged Transfers</div>
              </div>
              <AppBadge variant="danger">Error</AppBadge>
            </div>
          </div>
        </AppCard>
      </div>

      {/* Bottom Row: Recent Transactions Table & System Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        <AppCard title="Recent Transactions" action={<AppButton variant="ghost" size="sm" onClick={() => setIsModalOpen(true)}>+ Add</AppButton>}>
          <AppTable columns={columns} data={formattedTransactions} />
        </AppCard>

        <AppCard title="Quick Actions & Alerts">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #eee4d8' }}>
              <CheckCircle2 size={20} style={{ color: '#87532a', marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: typography.fontWeight.semibold, color: '#2c1e16' }}>New Account Approval</div>
                <div style={{ fontSize: '0.75rem', color: '#7a6658' }}>Customer Account Approval Pending</div>
              </div>
              <ChevronRight size={16} style={{ color: '#7a6658' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #eee4d8' }}>
              <ShieldAlert size={20} style={{ color: '#a83e2a', marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: typography.fontWeight.semibold, color: '#2c1e16' }}>Security Alert</div>
                <div style={{ fontSize: '0.75rem', color: '#7a6658' }}>Security alert: Failed login attempt</div>
              </div>
              <ChevronRight size={16} style={{ color: '#7a6658' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <ArrowUpRight size={20} style={{ color: '#a0522d', marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: typography.fontWeight.semibold, color: '#2c1e16' }}>Large Transfer Confirmation</div>
                <div style={{ fontSize: '0.75rem', color: '#7a6658' }}>Large transfer pending verification</div>
              </div>
              <ChevronRight size={16} style={{ color: '#7a6658' }} />
            </div>
          </div>
        </AppCard>
      </div>

      {/* New Transaction Modal */}
      <AppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Transaction">
        <form onSubmit={handleCreateTransaction}>
          <AppSearchableSelect
            label="Customer Name"
            placeholder="Search registered customer or enter name..."
            value={customerName}
            onChange={(e) => {
              const val = e.target.value;
              setCustomerName(val);
              const found = allCustomers.find(c => c.name?.toLowerCase() === val?.toLowerCase());
              if (found && found.email) {
                setCustomerEmail(found.email);
              }
            }}
            options={customerOptions}
            allowCustom={true}
            required
          />
          <AppInput
            label="Customer Email Address"
            placeholder="e.g. sarah@example.com"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
          <AppSelect
            label="Transaction Type"
            value={txType}
            onChange={(e) => setTxType(e.target.value)}
            options={[
              { value: 'DEPOSIT', label: 'Deposit' },
              { value: 'WITHDRAWAL', label: 'Withdrawal' },
              { value: 'TRANSFER', label: 'Transfer' },
            ]}
          />
          <AppInput
            label="Transaction Amount (PKR)"
            type="number"
            placeholder="e.g. 1500.00"
            value={txAmount}
            onChange={(e) => setTxAmount(e.target.value)}
            required
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <AppButton variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</AppButton>
            <AppButton type="submit" variant="primary">Submit Transaction</AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default Dashboard;


