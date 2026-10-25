import React, { useState } from 'react';
import { colors, typography, radius } from '../shared/design-system';
import AppCard from '../components/ui/AppCard';
import AppInput from '../components/ui/AppInput';
import AppSearchableSelect from '../components/ui/AppSearchableSelect';
import AppButton from '../components/ui/AppButton';
import AppTabs from '../components/ui/AppTabs';
import AppBadge from '../components/ui/AppBadge';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  CheckCircle2, 
  Wallet, 
  Building2, 
  Clock, 
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import dataStore from '../services/dataStore';

export const DepositWithdrawal = () => {
  const accountsList = dataStore.getAccounts();
  const defaultAcc = accountsList[0]?.accountNumber || '';

  const [operation, setOperation] = useState('DEPOSIT');
  const [accountNumber, setAccountNumber] = useState(defaultAcc);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [txRef, setTxRef] = useState('');

  const [recentCashOps, setRecentCashOps] = useState(() =>
    dataStore.getTransactions().filter(t => t.type === 'DEPOSIT' || t.type === 'WITHDRAWAL').slice(0, 5)
  );

  const selectedAccount = accountsList.find(a => a.accountNumber === accountNumber) || accountsList[0];

  const accountOptions = accountsList.map(a => ({
    value: a.accountNumber,
    label: `${a.accountNumber} - ${a.customerName} (Bal: ${a.balance})`
  }));

  const quickAmounts = [1000, 5000, 10000, 50000, 100000];

  const handleAddQuickAmount = (val) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;
    const ref = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
    setTxRef(ref);

    const newTx = {
      ref,
      source: operation === 'DEPOSIT' ? 'Cash Counter' : accountNumber,
      target: operation === 'WITHDRAWAL' ? 'Cash Counter' : accountNumber,
      type: operation,
      amount: `PKR ${parseFloat(amount).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      fee: operation === 'WITHDRAWAL' ? 'PKR 2.00' : 'PKR 0.00',
      status: 'Completed',
      date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
    };

    dataStore.executeTransaction(newTx);
    setRecentCashOps(dataStore.getTransactions().filter(t => t.type === 'DEPOSIT' || t.type === 'WITHDRAWAL').slice(0, 5));
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            Deposit & Withdrawal Portal
          </h1>
          <div style={{ fontSize: typography.fontSize.sm, color: '#7a6658', marginTop: '0.3rem' }}>
            Process cash deposits and teller withdrawals with instant ledger verification
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#ecfdf5', color: '#065f46', padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: typography.fontSize.xs, fontWeight: 600 }}>
            <ShieldCheck size={16} /> Verified Teller Terminal
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
        
        {/* Left Column: Deposit/Withdrawal Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AppCard>
            <AppTabs
              tabs={[
                { id: 'DEPOSIT', label: 'Deposit Cash / Cheque' },
                { id: 'WITHDRAWAL', label: 'Cash Withdrawal' },
              ]}
              activeTab={operation}
              onTabChange={(op) => { setOperation(op); setSubmitted(false); }}
            />

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <CheckCircle2 size={36} />
                </div>
                <h2 style={{ margin: '0 0 0.5rem 0', color: '#2c1e16', fontSize: typography.fontSize.xl, fontWeight: 700 }}>
                  {operation === 'DEPOSIT' ? 'Deposit Successful!' : 'Withdrawal Processed!'}
                </h2>
                <p style={{ color: '#7a6658', fontSize: typography.fontSize.sm, marginBottom: '1.5rem' }}>
                  Transaction has been recorded for account <strong>{accountNumber}</strong>.
                </p>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', display: 'inline-block', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: typography.fontSize.xs, color: '#64748b' }}>Transaction Reference:</span>
                  <div style={{ fontSize: typography.fontSize.base, fontWeight: 700, color: '#0f766e', marginTop: '0.2rem' }}>
                    {txRef}
                  </div>
                </div>
                <div>
                  <AppButton onClick={() => { setSubmitted(false); setAmount(''); setDescription(''); }}>
                    Perform Another {operation === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
                  </AppButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ marginTop: '1.25rem' }}>
                <AppSearchableSelect
                  label="Target Account"
                  placeholder="Select account..."
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  options={accountOptions.map(a => ({
                    value: a.value,
                    label: a.label,
                    sublabel: `Current Balance: ${accountsList.find(x => x.accountNumber === a.value)?.balance || 'N/A'}`
                  }))}
                  required
                />

                <div style={{ marginBottom: '1rem' }}>
                  <AppInput
                    label={`${operation === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'} Amount (PKR)`}
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />

                  {/* Quick Add Chips */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '-0.25rem' }}>
                    <span style={{ fontSize: typography.fontSize.xs, color: '#8c7665', alignSelf: 'center', marginRight: '0.25rem' }}>Quick add:</span>
                    {quickAmounts.map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleAddQuickAmount(val)}
                        style={{
                          background: '#fff',
                          border: '1px solid #dfd3c5',
                          borderRadius: '16px',
                          padding: '0.25rem 0.65rem',
                          fontSize: typography.fontSize.xs,
                          color: '#704214',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = '#b87c4c'; e.currentTarget.style.background = '#fef9f3'; }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = '#dfd3c5'; e.currentTarget.style.background = '#fff'; }}
                      >
                        +PKR {val.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <AppInput
                  label="Transaction Memo / Reference Note"
                  placeholder={operation === 'DEPOSIT' ? 'e.g. Counter cash deposit by customer' : 'e.g. Cash withdrawal counter receipt'}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: '#faf6f0', borderRadius: '10px', border: '1px solid #ebd9c8', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: typography.fontSize.xs, color: '#7a6658' }}>Service Fee:</span>
                  <span style={{ fontSize: typography.fontSize.xs, fontWeight: 700, color: '#3e2e24' }}>
                    {operation === 'WITHDRAWAL' ? 'PKR 2.00' : 'PKR 0.00 (Free)'}
                  </span>
                </div>

                <AppButton
                  type="submit"
                  variant="primary"
                  fullWidth
                  icon={operation === 'DEPOSIT' ? ArrowDownRight : ArrowUpRight}
                >
                  Confirm & Process {operation === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
                </AppButton>
              </form>
            )}
          </AppCard>
        </div>

        {/* Right Column: Account Snapshot & Teller History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Account Balance Snapshot */}
          <AppCard title="Account Overview">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #b87c4c 0%, #8c4e20 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wallet size={24} />
              </div>
              <div>
                <div style={{ fontSize: typography.fontSize.xs, color: '#8c7665', textTransform: 'uppercase' }}>
                  {selectedAccount?.customerName || 'Customer'}
                </div>
                <div style={{ fontSize: typography.fontSize.lg, fontWeight: 700, color: '#2c1e16' }}>
                  {selectedAccount?.balance || 'PKR 0.00'}
                </div>
                <div style={{ fontSize: typography.fontSize.xs, color: '#a08975' }}>
                  {selectedAccount?.type} Account • {selectedAccount?.accountNumber}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #eee4d8', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#8c7665' }}>Account Status</div>
                <AppBadge variant={selectedAccount?.status === 'Active' ? 'success' : 'warning'}>
                  {selectedAccount?.status || 'Active'}
                </AppBadge>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#8c7665' }}>Currency</div>
                <span style={{ fontSize: typography.fontSize.xs, fontWeight: 700, color: '#2c1e16' }}>PKR (Rs)</span>
              </div>
            </div>
          </AppCard>

          {/* Recent Cash Operations */}
          <AppCard title="Recent Cash Operations">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentCashOps.length === 0 ? (
                <div style={{ fontSize: typography.fontSize.xs, color: '#8c7665', textAlign: 'center', padding: '1rem' }}>No cash transactions</div>
              ) : (
                recentCashOps.map((tx) => (
                  <div key={tx.ref} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.65rem', borderBottom: '1px solid #f2e9df' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: tx.type === 'DEPOSIT' ? '#dcfce7' : '#fee2e2',
                        color: tx.type === 'DEPOSIT' ? '#16a34a' : '#dc2626',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {tx.type === 'DEPOSIT' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div>
                        <div style={{ fontSize: typography.fontSize.xs, fontWeight: 600, color: '#2c1e16' }}>
                          {tx.type} • {tx.target !== '-' ? tx.target : tx.source}
                        </div>
                        <div style={{ fontSize: '11px', color: '#8c7665' }}>
                          {tx.date} • {tx.ref}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: typography.fontSize.xs, fontWeight: 700,
                        color: tx.type === 'DEPOSIT' ? '#16a34a' : '#dc2626'
                      }}>
                        {tx.type === 'DEPOSIT' ? `+${tx.amount}` : `-${tx.amount}`}
                      </div>
                      <span style={{ fontSize: '10px', color: '#8c7665' }}>{tx.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AppCard>

        </div>

      </div>
    </div>
  );
};

export default DepositWithdrawal;
