import React, { useState } from 'react';
import { colors, typography } from '../shared/design-system';
import AppCard from '../components/ui/AppCard';
import AppTable from '../components/ui/AppTable';
import AppBadge from '../components/ui/AppBadge';
import AppButton from '../components/ui/AppButton';
import AppInput from '../components/ui/AppInput';
import AppSelect from '../components/ui/AppSelect';
import AppSearchableSelect from '../components/ui/AppSearchableSelect';
import AppModal from '../components/ui/AppModal';
import { PlusCircle, PiggyBank, Eye, Printer, Calendar, Clock, Award, ShieldCheck, FileText } from 'lucide-react';
import dataStore from '../services/dataStore';

export const FixedDeposits = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedFD, setSelectedFD] = useState(null);

  const [sourceAccount, setSourceAccount] = useState('ACC109283741');
  const [amount, setAmount] = useState('5000');
  const [durationMonths, setDurationMonths] = useState('12');

  const [fixedDeposits, setFixedDeposits] = useState(() => dataStore.getFixedDeposits());
  const allAccounts = dataStore.getAccounts();

  // Find customer name from chosen account
  const currentAccountObj = allAccounts.find(a => a.accountNumber === sourceAccount) || {
    accountNumber: sourceAccount,
    customerName: 'Customer'
  };

  // Calculated maturity yield
  const maturityYield = (() => {
    const p = parseFloat(amount) || 0;
    const months = parseInt(durationMonths) || 12;
    const rate = months >= 24 ? 0.0725 : 0.0650;
    const interest = p * rate * (months / 12);
    return (p + interest).toFixed(2);
  })();

  const profitOnly = (() => {
    const p = parseFloat(amount) || 0;
    const total = parseFloat(maturityYield) || 0;
    return Math.max(0, total - p).toFixed(2);
  })();

  const handleOpenFD = (e) => {
    e.preventDefault();
    const p = parseFloat(amount) || 0;
    if (p <= 0) {
      alert('Please enter a valid deposit amount.');
      return;
    }

    const availableBal = parseNum(currentAccountObj.balance);
    if (availableBal < p) {
      alert(`Insufficient funds! Account ${sourceAccount} only has ${currentAccountObj.balance}, but you requested to lock PKR ${p.toLocaleString('en-PK', { minimumFractionDigits: 2 })}.`);
      return;
    }

    const months = parseInt(durationMonths) || 12;
    const ratePercent = months >= 24 ? '7.25%' : '6.50%';

    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const issueDay = days[now.getDay()];
    const issueDateStr = `${String(now.getDate()).padStart(2, '0')} ${monthsArr[now.getMonth()]} ${now.getFullYear()}`;
    const issueTimeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const issueYearStr = now.getFullYear().toString();

    const maturityDateObj = new Date(now);
    maturityDateObj.setMonth(maturityDateObj.getMonth() + months);
    const maturityDay = days[maturityDateObj.getDay()];
    const maturityDateStr = `${String(maturityDateObj.getDate()).padStart(2, '0')} ${monthsArr[maturityDateObj.getMonth()]} ${maturityDateObj.getFullYear()} (${maturityDay})`;

    const matchedCustomer = allAccounts.find(a => a.accountNumber === sourceAccount)?.customerName || 'Customer';

    const newFD = {
      id: `FD-${Math.floor(1000 + Math.random() * 9000)}`,
      account: sourceAccount,
      customer: matchedCustomer,
      principal: `PKR ${p.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`,
      rate: ratePercent,
      term: `${months} Months`,
      maturityAmount: `PKR ${parseFloat(maturityYield).toLocaleString('en-PK', { minimumFractionDigits: 2 })}`,
      issueDate: issueDateStr,
      issueDay: issueDay,
      issueTime: issueTimeStr,
      issueYear: issueYearStr,
      maturityDate: maturityDateStr,
      status: 'ACTIVE',
    };

    // 1. Deduct principal from the source bank account & record in Transaction Activity
    const txRef = `TX-FD-${newFD.id.replace(/[^0-9]/g, '') || Math.floor(100000 + Math.random() * 900000)}`;
    const newTx = {
      id: txRef,
      ref: txRef,
      source: sourceAccount,
      target: `TERM-DEPOSIT (${newFD.id})`,
      type: 'FIXED_DEPOSIT',
      amount: `PKR ${p.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`,
      fee: 'PKR 0.00',
      status: 'Completed',
      date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      name: matchedCustomer,
      description: `Fixed Deposit Certificate Booking (${newFD.id}) - ${months} Months @ ${ratePercent}`,
    };

    dataStore.executeTransaction(newTx);

    // 2. Save new Fixed Deposit record
    const updated = [newFD, ...fixedDeposits];
    setFixedDeposits(updated);
    dataStore.saveFixedDeposits(updated);

    setModalOpen(false);
  };

  const parseNum = (val) => parseFloat((val || '0').toString().replace(/[^0-9.]/g, '')) || 0;

  const columns = [
    { 
      header: 'FD Reference', 
      render: (row) => (
        <span style={{ fontWeight: typography.fontWeight.semibold, color: colors.primary, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Award size={16} style={{ color: '#b87c4c' }} />
          {row.id}
        </span>
      )
    },
    { 
      header: 'Customer & Account', 
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#2c1e16' }}>{row.customer || 'Account Holder'}</div>
          <div style={{ fontSize: '0.75rem', color: '#7a6658' }}>{row.account}</div>
        </div>
      )
    },
    {
      header: 'Booking Date & Time',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#2c1e16', fontSize: '0.82rem' }}>
            {row.issueDay}, {row.issueDate}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#7a6658', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} /> {row.issueTime} • {row.issueYear}
          </div>
        </div>
      )
    },
    { header: 'Principal Amount', accessor: 'principal' },
    { 
      header: 'Rate / Duration', 
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#87532a' }}>{row.rate}</div>
          <div style={{ fontSize: '0.72rem', color: '#7a6658' }}>{row.term}</div>
        </div>
      )
    },
    { 
      header: 'Maturity Payout', 
      render: (row) => (
        <div>
          <div style={{ fontWeight: typography.fontWeight.bold, color: colors.successText }}>{row.maturityAmount}</div>
          <div style={{ fontSize: '0.72rem', color: '#7a6658' }}>Due: {row.maturityDate}</div>
        </div>
      )
    },
    { header: 'Status', render: (row) => <AppBadge variant="success">{row.status}</AppBadge> },
    {
      header: 'Actions',
      render: (row) => (
        <AppButton
          size="sm"
          variant="secondary"
          icon={Eye}
          onClick={() => {
            setSelectedFD(row);
            setDetailsModalOpen(true);
          }}
        >
          View Details
        </AppButton>
      )
    }
  ];

  // Calculate profit earned for selected FD in modal
  const selectedProfit = selectedFD ? Math.max(0, parseNum(selectedFD.maturityAmount) - parseNum(selectedFD.principal)) : 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            Fixed Deposit Certificates
          </h1>
          <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginTop: '0.2rem' }}>
            High-yield term deposits, guaranteed interest rates, booking audit, and maturity tracking
          </div>
        </div>
        <AppButton variant="primary" icon={PlusCircle} onClick={() => setModalOpen(true)}>Open Fixed Deposit</AppButton>
      </div>

      <AppCard title="Active Term Deposits">
        <AppTable columns={columns} data={fixedDeposits} />
      </AppCard>

      {/* Open FD Modal */}
      <AppModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Open New Fixed Deposit Certificate">
        <form onSubmit={handleOpenFD}>
          <AppSearchableSelect
            label="Source Funding Account"
            placeholder="Search by account number or customer name..."
            value={sourceAccount}
            onChange={(e) => setSourceAccount(e.target.value)}
            options={allAccounts.map(a => ({
              value: a.accountNumber,
              label: `${a.accountNumber} - ${a.customerName} (${a.balance})`,
              sublabel: `Holder: ${a.customerName} • Available: ${a.balance}`
            }))}
            required
          />

          <AppInput
            label="Deposit Amount (PKR)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <AppSelect
            label="Term Duration"
            value={durationMonths}
            onChange={(e) => setDurationMonths(e.target.value)}
            options={[
              { value: '6', label: '6 Months (5.50% p.a.)' },
              { value: '12', label: '12 Months (6.50% p.a.)' },
              { value: '24', label: '24 Months (7.25% p.a.)' },
              { value: '36', label: '36 Months (7.75% p.a.)' },
            ]}
          />

          {/* Calculator Preview Box */}
          <div style={{ padding: '0.85rem', background: '#faf5ee', borderRadius: colors.radius?.md || '8px', marginBottom: '1.25rem', border: '1px solid #ebdccb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#7a6658', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <PiggyBank size={16} /> Guaranteed Profit Return:
              </span>
              <span style={{ fontSize: '1rem', fontWeight: typography.fontWeight.bold, color: '#16a34a' }}>
                +PKR {parseFloat(profitOnly).toLocaleString('en-PK', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #ebdccb', paddingTop: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#7a6658' }}>
                Total Maturity Payout:
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: typography.fontWeight.bold, color: colors.primary }}>
                PKR {parseFloat(maturityYield).toLocaleString('en-PK', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#7a6658', marginTop: '0.35rem', textAlign: 'right' }}>
              Booked under Holder: <strong>{currentAccountObj.customerName}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <AppButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AppButton>
            <AppButton type="submit" variant="primary">Confirm Certificate</AppButton>
          </div>
        </form>
      </AppModal>

      {/* Official Certificate & Full Details Modal */}
      {detailsModalOpen && selectedFD && (
        <AppModal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`Fixed Deposit Certificate (${selectedFD.id})`}
          maxWidth="750px"
        >
          <div>
            {/* Certificate Header Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1.5px solid #e4d7c8' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Award size={22} style={{ color: '#b87c4c' }} />
                  <h3 style={{ margin: 0, color: '#2c1e16', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    SafeBank Enterprise • Term Deposit Certificate
                  </h3>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#7a6658', marginTop: '3px' }}>
                  Certificate Ref: <strong style={{ color: colors.primary }}>{selectedFD.id}</strong> • Status: <strong style={{ color: '#16a34a' }}>ACTIVE & GUARANTEED</strong>
                </div>
              </div>
              <AppButton variant="secondary" size="sm" icon={Printer} onClick={() => window.print()}>
                Print Certificate (PDF)
              </AppButton>
            </div>

            {/* 4 Financial Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.75rem', background: '#faf5ee', borderRadius: '8px', border: '1px solid #ebdccb' }}>
                <div style={{ fontSize: '0.7rem', color: '#7a6658', textTransform: 'uppercase' }}>Principal Amount</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#2c1e16', marginTop: '2px' }}>{selectedFD.principal}</div>
              </div>
              <div style={{ padding: '0.75rem', background: '#faf5ee', borderRadius: '8px', border: '1px solid #ebdccb' }}>
                <div style={{ fontSize: '0.7rem', color: '#7a6658', textTransform: 'uppercase' }}>Profit Rate</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#87532a', marginTop: '2px' }}>{selectedFD.rate} p.a.</div>
              </div>
              <div style={{ padding: '0.75rem', background: '#faf5ee', borderRadius: '8px', border: '1px solid #ebdccb' }}>
                <div style={{ fontSize: '0.7rem', color: '#7a6658', textTransform: 'uppercase' }}>Profit Earned</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#16a34a', marginTop: '2px' }}>+PKR {selectedProfit.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</div>
              </div>
              <div style={{ padding: '0.75rem', background: '#faf5ee', borderRadius: '8px', border: '1px solid #ebdccb' }}>
                <div style={{ fontSize: '0.7rem', color: '#7a6658', textTransform: 'uppercase' }}>Total Maturity</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 'bold', color: colors.primary, marginTop: '2px' }}>{selectedFD.maturityAmount}</div>
              </div>
            </div>

            {/* Comprehensive Detail Schedule Box */}
            <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #ebdccb', padding: '1.1rem', marginBottom: '1.25rem' }}>
              <h4 style={{ margin: '0 0 0.85rem 0', color: '#2c1e16', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileText size={16} style={{ color: '#b87c4c' }} /> Certificate Audit & Schedule Details
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '0.75rem', columnGap: '1.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#7a6658' }}>Certificate Holder:</span>
                  <strong style={{ color: '#2c1e16' }}>{selectedFD.customer || 'Account Holder'}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#7a6658' }}>Funding Bank Account:</span>
                  <strong style={{ color: '#2c1e16' }}>{selectedFD.account}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#7a6658' }}>Issue Date:</span>
                  <strong style={{ color: '#2c1e16' }}>{selectedFD.issueDate}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#7a6658' }}>Day of Issuance:</span>
                  <strong style={{ color: '#87532a' }}>{selectedFD.issueDay}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#7a6658' }}>Year of Booking:</span>
                  <strong style={{ color: '#2c1e16' }}>{selectedFD.issueYear}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#7a6658' }}>Booking Time:</span>
                  <strong style={{ color: '#14b8a6' }}>{selectedFD.issueTime}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#7a6658' }}>Tenure Duration:</span>
                  <strong style={{ color: '#2c1e16' }}>{selectedFD.term}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#7a6658' }}>Maturity Date:</span>
                  <strong style={{ color: '#16a34a' }}>{selectedFD.maturityDate}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#7a6658' }}>Payout Settlement:</span>
                  <span style={{ color: '#2c1e16', fontWeight: '500' }}>Direct Credit to Account</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#7a6658' }}>Premature Liquidation:</span>
                  <span style={{ color: '#2c1e16', fontWeight: '500' }}>Permitted (Subject to rules)</span>
                </div>
              </div>
            </div>

            {/* Digital Security Watermark Notice */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.85rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b' }}>
              <ShieldCheck size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
              <span>
                Digitally authenticated and guaranteed under SafeBank Core Financial Services. All profit yields are calculated on standard fixed compounding basis.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <AppButton variant="secondary" onClick={() => setDetailsModalOpen(false)}>Close</AppButton>
            </div>
          </div>
        </AppModal>
      )}
    </div>
  );
};

export default FixedDeposits;
