import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { colors, typography } from '../shared/design-system';
import AppCard from '../components/ui/AppCard';
import AppBadge from '../components/ui/AppBadge';
import AppButton from '../components/ui/AppButton';
import AppTable from '../components/ui/AppTable';
import { CreditCard, ArrowUpRight, ArrowDownRight, SendHorizontal, Lock, Unlock } from 'lucide-react';
import dataStore from '../services/dataStore';

export const AccountDetails = () => {
  const { accountNumber } = useParams();
  const navigate = useNavigate();

  // Load account info from dataStore
  const allAccounts = dataStore.getAccounts();
  const accountObj = allAccounts.find(a => a.accountNumber === accountNumber) || {
    accountNumber: accountNumber || 'ACC109283741',
    customerName: 'Aaron Katen',
    type: 'Savings Account',
    balance: 'PKR 13,200.00',
    status: 'Active',
  };

  const parseNum = (str) => parseFloat((str || '0').toString().replace(/[^0-9.]/g, '')) || 0;
  const formatMoney = (val) => `PKR ${Number(val).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const [status, setStatus] = useState(accountObj.status);

  // Filter transactions for this account
  const allTransactions = dataStore.getTransactions();
  const accountTransactions = allTransactions.filter(t => t.source === accountObj.accountNumber || t.target === accountObj.accountNumber);

  // Sync and update balance if incoming transfer exists
  React.useEffect(() => {
    if (accountObj) {
      const incomingSum = allTransactions
        .filter(t => t.target === accountObj.accountNumber && (t.status === 'Completed' || t.status === 'COMPLETED'))
        .reduce((sum, t) => sum + parseNum(t.amount), 0);

      if (incomingSum > 0) {
        const storedVal = parseNum(accountObj.balance);
        // If stored balance is less than incoming transfer, auto-credit it to account
        const updatedAccounts = allAccounts.map(a => {
          if (a.accountNumber === accountObj.accountNumber) {
            const curVal = parseNum(a.balance);
            if (curVal < incomingSum) {
              return { ...a, balance: formatMoney(curVal + incomingSum) };
            }
          }
          return a;
        });
        dataStore.saveAccounts(updatedAccounts);
      }
    }
  }, [accountNumber]);

  // Calculate live display balance
  const storedBalNum = parseNum(accountObj.balance);
  const incomingSum = allTransactions
    .filter(t => t.target === accountObj.accountNumber && (t.status === 'Completed' || t.status === 'COMPLETED'))
    .reduce((sum, t) => sum + parseNum(t.amount), 0);

  const displayBalance = storedBalNum < incomingSum ? formatMoney(storedBalNum + incomingSum) : accountObj.balance;

  const toggleFreeze = () => {
    const newStatus = status === 'Active' ? 'Frozen' : 'Active';
    const updated = allAccounts.map(a => a.accountNumber === accountObj.accountNumber ? { ...a, status: newStatus } : a);
    dataStore.saveAccounts(updated);
    setStatus(newStatus);
  };

  const displayTransactions = accountTransactions;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            Account Details
          </h1>
          <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginTop: '0.2rem' }}>
            Account #{accountObj.accountNumber} summary and controls
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <AppButton variant="outline" icon={SendHorizontal} onClick={() => navigate('/transfers')}>
            Transfer Funds
          </AppButton>
          <AppButton variant={status === 'Active' ? 'danger' : 'primary'} icon={status === 'Active' ? Lock : Unlock} onClick={toggleFreeze}>
            {status === 'Active' ? 'Freeze Account' : 'Unfreeze Account'}
          </AppButton>
        </div>
      </div>

      {/* Top 2 Account Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <AppCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: colors.primaryLight, color: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={28} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#7a6658' }}>Account Number ({accountObj.type})</div>
              <div style={{ fontSize: '1.25rem', fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
                {accountObj.accountNumber}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#7a6658' }}>Holder: {accountObj.customerName}</div>
            </div>
          </div>
        </AppCard>

        <AppCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#7a6658' }}>Current Available Balance</div>
              <div style={{ fontSize: typography.fontSize.kpi, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
                {displayBalance}
              </div>
            </div>
            <AppBadge variant={status === 'Active' ? 'success' : 'warning'}>{status}</AppBadge>
          </div>
        </AppCard>
      </div>

      {/* Recent Transactions Table for Account */}
      <AppCard title="Account Activity Log">
        {displayTransactions.length > 0 ? (
          <AppTable
            columns={[
              { header: 'Reference', render: (row) => <span style={{ fontWeight: typography.fontWeight.semibold, color: colors.primary }}>{row.ref}</span> },
              { header: 'Type', render: (row) => (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {row.type === 'DEPOSIT' ? (
                    <ArrowDownRight size={16} style={{ color: colors.successText }} />
                  ) : (
                    <ArrowUpRight size={16} style={{ color: colors.dangerText }} />
                  )}
                  {row.type === 'FIXED_DEPOSIT' ? 'FIXED DEPOSIT' : row.type}
                </span>
              )},
              { header: 'Date', accessor: 'date' },
              { header: 'Amount', accessor: 'amount' },
              { header: 'Status', render: (row) => <AppBadge variant="success">{row.status}</AppBadge> },
            ]}
            data={displayTransactions}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#7a6658', background: '#faf5ee', borderRadius: '10px' }}>
            <div style={{ fontWeight: 600, color: '#2c1e16', marginBottom: '0.25rem' }}>No Account Activity Yet</div>
            <div style={{ fontSize: '0.82rem' }}>No deposits, withdrawals, transfers, or term deposits have been executed on this account yet.</div>
          </div>
        )}
      </AppCard>
    </div>
  );
};

export default AccountDetails;


