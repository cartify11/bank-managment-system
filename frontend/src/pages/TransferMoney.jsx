import React, { useState } from 'react';
import { colors, typography, radius } from '../shared/design-system';
import AppCard from '../components/ui/AppCard';
import AppInput from '../components/ui/AppInput';
import AppSearchableSelect from '../components/ui/AppSearchableSelect';
import AppButton from '../components/ui/AppButton';
import AppBadge from '../components/ui/AppBadge';
import { 
  SendHorizontal, 
  CheckCircle2, 
  Wallet, 
  ArrowRightLeft, 
  ShieldCheck, 
  Clock, 
  UserCheck, 
  Zap,
  TrendingUp
} from 'lucide-react';
import dataStore from '../services/dataStore';

export const TransferMoney = () => {
  const accountsList = dataStore.getAccounts();
  const defaultSource = accountsList[0]?.accountNumber || '';

  const [sourceAccount, setSourceAccount] = useState(defaultSource);
  const [targetAccount, setTargetAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');
  const [recentTransfers, setRecentTransfers] = useState(() => 
    dataStore.getTransactions().filter(t => t.type === 'TRANSFER').slice(0, 5)
  );

  const selectedSourceObj = accountsList.find(a => a.accountNumber === sourceAccount) || accountsList[0];

  const accountOptions = accountsList.map(a => ({
    value: a.accountNumber,
    label: `${a.accountNumber} - ${a.customerName} (Bal: ${a.balance})`
  }));

  const quickAmounts = [1000, 5000, 10000, 25000, 50000];

  const handleQuickPaySelect = (accNumber) => {
    setTargetAccount(accNumber);
  };

  const handleAddQuickAmount = (val) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !targetAccount) return;
    const generatedRef = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
    setRefId(generatedRef);

    const newTx = {
      ref: generatedRef,
      source: sourceAccount,
      target: targetAccount,
      type: 'TRANSFER',
      amount: `PKR ${parseFloat(amount).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      fee: 'PKR 0.00',
      status: 'Completed',
      date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
    };

    dataStore.executeTransaction(newTx);
    setRecentTransfers(dataStore.getTransactions().filter(t => t.type === 'TRANSFER').slice(0, 5));
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            Transfer Money
          </h1>
          <div style={{ fontSize: typography.fontSize.sm, color: '#7a6658', marginTop: '0.3rem' }}>
            Instant, secure inter-account fund transfers with zero commission fees
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#ecfdf5', color: '#065f46', padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: typography.fontSize.xs, fontWeight: 600 }}>
            <ShieldCheck size={16} /> 256-Bit SSL Encrypted
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#eff6ff', color: '#1e40af', padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: typography.fontSize.xs, fontWeight: 600 }}>
            <Zap size={16} /> Instant Settlement
          </div>
        </div>
      </div>

      {/* Main Grid: Form on Left (60%), Intelligence & Beneficiaries on Right (40%) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
        
        {/* Left Column: Transfer Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AppCard title="Fund Transfer Form">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <CheckCircle2 size={36} />
                </div>
                <h2 style={{ margin: '0 0 0.5rem 0', color: '#2c1e16', fontSize: typography.fontSize.xl, fontWeight: 700 }}>
                  Transfer Executed Successfully!
                </h2>
                <p style={{ color: '#7a6658', fontSize: typography.fontSize.sm, marginBottom: '1.5rem', lineHeight: '1.5' }}>
                  Funds have been debited from <strong>{sourceAccount}</strong> and transferred to <strong>{targetAccount}</strong>.
                </p>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', display: 'inline-block', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: typography.fontSize.xs, color: '#64748b' }}>Transaction Reference ID:</span>
                  <div style={{ fontSize: typography.fontSize.base, fontWeight: 700, color: '#0f766e', marginTop: '0.2rem' }}>
                    {refId}
                  </div>
                </div>
                <div>
                  <AppButton onClick={() => { setSubmitted(false); setAmount(''); setTargetAccount(''); setDescription(''); }}>
                    Make Another Transfer
                  </AppButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <AppSearchableSelect
                  label="Source Account (Sender)"
                  placeholder="Select source account..."
                  value={sourceAccount}
                  onChange={(e) => setSourceAccount(e.target.value)}
                  options={accountOptions.map(a => ({
                    value: a.value,
                    label: a.label,
                    sublabel: `Available Balance: ${accountsList.find(x => x.accountNumber === a.value)?.balance || 'N/A'}`
                  }))}
                  required
                />

                <AppSearchableSelect
                  label="Recipient Account Number"
                  placeholder="Search saved payee, enter account number or customer name..."
                  value={targetAccount}
                  onChange={(e) => setTargetAccount(e.target.value)}
                  options={accountOptions.filter(a => a.value !== sourceAccount).map(a => ({
                    value: a.value,
                    label: a.label,
                    sublabel: `Account: ${a.value}`
                  }))}
                  allowCustom={true}
                  required
                />

                <div style={{ marginBottom: '1rem' }}>
                  <AppInput
                    label="Transfer Amount (PKR)"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />

                  {/* Quick Amount Suggestion Chips */}
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
                  label="Payment Description / Note"
                  placeholder="e.g. Monthly rent, supplier invoice, family support"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                {/* Transfer summary bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: '#faf6f0', borderRadius: '10px', border: '1px solid #ebd9c8', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={18} color="#b87c4c" />
                    <div>
                      <div style={{ fontSize: typography.fontSize.xs, fontWeight: 600, color: '#3e2e24' }}>Transfer Fee</div>
                      <div style={{ fontSize: '11px', color: '#8c7665' }}>Free for all domestic transfers</div>
                    </div>
                  </div>
                  <AppBadge variant="info">PKR 0.00 (Zero Fee)</AppBadge>
                </div>

                <AppButton type="submit" variant="primary" fullWidth icon={SendHorizontal}>
                  Execute Transfer Now
                </AppButton>
              </form>
            )}
          </AppCard>
        </div>

        {/* Right Column: Account Balance Card, Quick Payees & Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Active Account Details & Daily Quota */}
          <AppCard title="Active Account & Quota">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #b87c4c 0%, #8c4e20 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wallet size={24} />
              </div>
              <div>
                <div style={{ fontSize: typography.fontSize.xs, color: '#8c7665', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {selectedSourceObj?.customerName || 'Account Holder'}
                </div>
                <div style={{ fontSize: typography.fontSize.lg, fontWeight: 700, color: '#2c1e16' }}>
                  {selectedSourceObj?.balance || 'PKR 0.00'}
                </div>
                <div style={{ fontSize: typography.fontSize.xs, color: '#a08975' }}>
                  A/C: {selectedSourceObj?.accountNumber} ({selectedSourceObj?.type} Account)
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #eee4d8', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: typography.fontSize.xs, marginBottom: '0.4rem', color: '#5c483a' }}>
                <span>Daily Transfer Limit:</span>
                <span style={{ fontWeight: 600 }}>PKR 500,000.00</span>
              </div>
              <div style={{ width: '100%', height: '7px', background: '#ebd9c8', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                <div style={{ width: '12%', height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#8c7665' }}>
                <span>Used: PKR 5,000</span>
                <span style={{ color: '#059669', fontWeight: 600 }}>Remaining: PKR 495,000</span>
              </div>
            </div>
          </AppCard>

          {/* Quick Pay / Saved Beneficiaries */}
          <AppCard title="Quick Pay Beneficiaries">
            <div style={{ fontSize: typography.fontSize.xs, color: '#8c7665', marginBottom: '0.85rem' }}>
              Click any contact to autofill recipient account:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {accountsList.filter(a => a.accountNumber !== sourceAccount).slice(0, 4).map((acc) => (
                <div
                  key={acc.accountNumber}
                  onClick={() => handleQuickPaySelect(acc.accountNumber)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: radius.md || '8px',
                    border: targetAccount === acc.accountNumber ? '1.5px solid #b87c4c' : '1px solid #eee4d8',
                    backgroundColor: targetAccount === acc.accountNumber ? '#fcf8f3' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#faf5ef'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = targetAccount === acc.accountNumber ? '#fcf8f3' : '#ffffff'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ebd9c8', color: '#6e3917', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: typography.fontSize.xs }}>
                      {acc.customerName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: typography.fontSize.xs, fontWeight: 600, color: '#2c1e16' }}>{acc.customerName}</div>
                      <div style={{ fontSize: '11px', color: '#8c7665' }}>{acc.accountNumber}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#b87c4c', fontWeight: 600 }}>Select</span>
                </div>
              ))}
            </div>
          </AppCard>

          {/* Recent Transfers History Widget */}
          <AppCard title="Recent Transfers">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentTransfers.length === 0 ? (
                <div style={{ fontSize: typography.fontSize.xs, color: '#8c7665', textAlign: 'center', padding: '1rem' }}>No recent transfers</div>
              ) : (
                recentTransfers.map((tx) => (
                  <div key={tx.ref} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.65rem', borderBottom: '1px solid #f2e9df' }}>
                    <div>
                      <div style={{ fontSize: typography.fontSize.xs, fontWeight: 600, color: '#2c1e16' }}>
                        To: {tx.target}
                      </div>
                      <div style={{ fontSize: '11px', color: '#8c7665', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                        <Clock size={11} /> {tx.date} • {tx.ref}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: typography.fontSize.xs, fontWeight: 700, color: '#b87c4c' }}>
                        -{tx.amount}
                      </div>
                      <AppBadge variant={tx.status === 'Completed' ? 'success' : 'warning'}>
                        {tx.status}
                      </AppBadge>
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

export default TransferMoney;
