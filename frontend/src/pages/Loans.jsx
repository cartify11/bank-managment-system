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
import { Landmark, Calculator, PlusCircle, CheckCircle2, Eye, Printer, FileText, History } from 'lucide-react';
import dataStore from '../services/dataStore';

export const Loans = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [repayModalOpen, setRepayModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const customersList = dataStore.getCustomers();
  const allAccounts = dataStore.getAccounts();
  const customerLoanOptions = customersList.map(c => {
    const accs = allAccounts.filter(a => a.customerName && c.name && a.customerName.toLowerCase().includes(c.name.toLowerCase()));
    const accStr = accs.map(a => a.accountNumber).join(', ');
    return {
      value: c.name,
      label: `${c.name} (${c.email || c.phone || 'Customer'})`,
      sublabel: accStr ? `Accounts: ${accStr}` : (c.nationalId ? `ID: ${c.nationalId}` : '')
    };
  });

  const [customer, setCustomer] = useState(customersList[0]?.name || 'Aaron Katen');
  const [loanType, setLoanType] = useState('Personal Loan');
  const [amount, setAmount] = useState('10000');
  const [termMonths, setTermMonths] = useState('24');
  
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [repayAmountInput, setRepayAmountInput] = useState('');

  const [loans, setLoans] = useState(() => dataStore.getLoans());

  // Calculated EMI estimation
  const calculatedEmi = (() => {
    const p = parseFloat(amount) || 0;
    const rate = loanType === 'Home Loan' ? 0.0525 : loanType === 'Auto Loan' ? 0.0675 : 0.085;
    const r = rate / 12;
    const n = parseInt(termMonths) || 12;
    if (p <= 0 || n <= 0) return '0.00';
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return emi.toFixed(2);
  })();

  const handleApplyLoan = (e) => {
    e.preventDefault();
    const p = parseFloat(amount) || 0;
    const ratePercent = loanType === 'Home Loan' ? '5.25%' : loanType === 'Auto Loan' ? '6.75%' : '8.50%';
    const todayDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

    const newLoan = {
      id: `LN-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: customer || 'Aaron Katen',
      type: loanType,
      amount: `PKR ${p.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`,
      interestRate: ratePercent,
      term: `${termMonths} Months`,
      installment: `PKR ${calculatedEmi}`,
      outstanding: `PKR ${p.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`,
      status: 'ACTIVE',
      issueDate: todayDate,
      repaymentsHistory: [],
    };

    const updated = [newLoan, ...loans];
    setLoans(updated);
    dataStore.saveLoans(updated);

    setModalOpen(false);
  };

  const handleRepayEmi = () => {
    if (!selectedLoan) return;

    const currentOutstanding = parseFloat(selectedLoan.outstanding.replace(/[^0-9.]/g, '')) || 0;
    const emiVal = parseFloat(repayAmountInput || selectedLoan.installment.replace(/[^0-9.]/g, '')) || 0;
    const nextOutstanding = Math.max(0, currentOutstanding - emiVal);

    const nowStr = new Date().toLocaleString('en-US', {
      month: '2-digit', day: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });

    const newPaymentRecord = {
      ref: `PAY-${selectedLoan.id}-${Math.floor(100 + Math.random() * 900)}`,
      dateTime: nowStr,
      amount: `PKR ${emiVal.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`,
      balanceAfter: `PKR ${nextOutstanding.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`,
      method: 'Online Banking / EMI Payment',
      status: 'PAID'
    };

    const updated = loans.map(ln => {
      if (ln.id === selectedLoan.id) {
        const history = ln.repaymentsHistory || [];
        return {
          ...ln,
          outstanding: `PKR ${nextOutstanding.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`,
          status: nextOutstanding === 0 ? 'PAID' : 'ACTIVE',
          repaymentsHistory: [newPaymentRecord, ...history]
        };
      }
      return ln;
    });

    setLoans(updated);
    dataStore.saveLoans(updated);

    setRepayModalOpen(false);
    setSelectedLoan(null);
  };

  const parseMoney = (val) => parseFloat((val || '0').toString().replace(/[^0-9.]/g, '')) || 0;

  const columns = [
    { header: 'Loan ID', render: (row) => <span style={{ fontWeight: typography.fontWeight.semibold, color: colors.primary }}>{row.id}</span> },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Loan Type', accessor: 'type' },
    { header: 'Principal', accessor: 'amount' },
    { header: 'Rate', accessor: 'interestRate' },
    { header: 'Monthly EMI', accessor: 'installment' },
    { header: 'Outstanding', render: (row) => <span style={{ fontWeight: typography.fontWeight.bold }}>{row.outstanding}</span> },
    { header: 'Status', render: (row) => <AppBadge variant={row.status === 'ACTIVE' ? 'success' : 'info'}>{row.status}</AppBadge> },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <AppButton
            size="sm"
            variant="secondary"
            icon={Eye}
            onClick={() => { setSelectedLoan(row); setDetailsModalOpen(true); }}
          >
            Details
          </AppButton>

          {row.status === 'ACTIVE' && parseMoney(row.outstanding) > 0 ? (
            <AppButton
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedLoan(row);
                setRepayAmountInput((row.installment || '').replace(/[^0-9.]/g, ''));
                setRepayModalOpen(true);
              }}
            >
              Pay EMI
            </AppButton>
          ) : (
            <AppBadge variant="success" style={{ padding: '0.35rem 0.65rem', fontWeight: 600 }}>
              Loan Completed
            </AppBadge>
          )}
        </div>
      )
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            Loan Management & Credit Services
          </h1>
          <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginTop: '0.2rem' }}>
            Personal, business, home, and auto loan origination, EMI calculators, and repayments
          </div>
        </div>
        <AppButton variant="primary" icon={PlusCircle} onClick={() => setModalOpen(true)}>Apply For Loan</AppButton>
      </div>

      <AppCard title="Active Loan Portfolio">
        <AppTable columns={columns} data={loans} />
      </AppCard>

      {/* Loan Application Modal */}
      <AppModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Loan Application Wizard">
        <form onSubmit={handleApplyLoan}>
          <AppSearchableSelect
            label="Customer Holder Name"
            placeholder="Search by customer name, account number, or email..."
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            options={customerLoanOptions}
            allowCustom={true}
            required
          />

          <AppSelect
            label="Select Loan Product"
            value={loanType}
            onChange={(e) => setLoanType(e.target.value)}
            options={[
              { value: 'Personal Loan', label: 'Personal Loan (8.50% Interest Rate)' },
              { value: 'Home Loan', label: 'Home Loan (5.25% Interest Rate)' },
              { value: 'Auto Loan', label: 'Auto Loan (6.75% Interest Rate)' },
              { value: 'Business Loan', label: 'Business Loan (9.00% Interest Rate)' },
            ]}
          />

          <AppInput
            label="Requested Loan Amount (PKR)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <AppSelect
            label="Loan Duration (Term)"
            value={termMonths}
            onChange={(e) => setTermMonths(e.target.value)}
            options={[
              { value: '12', label: '12 Months (1 Year)' },
              { value: '24', label: '24 Months (2 Years)' },
              { value: '36', label: '36 Months (3 Years)' },
              { value: '60', label: '60 Months (5 Years)' },
              { value: '180', label: '180 Months (15 Years - Home)' },
              { value: '360', label: '360 Months (30 Years - Home)' },
            ]}
          />

          {/* Calculator Preview Box */}
          <div style={{ padding: '0.85rem', background: '#ffffff', borderRadius: colors.radius?.md || '8px', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#7a6658', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calculator size={16} /> Estimated Monthly Installment (EMI):
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: typography.fontWeight.bold, color: colors.primary }}>
                PKR {calculatedEmi} / mo
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <AppButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AppButton>
            <AppButton type="submit" variant="primary">Submit Loan Application</AppButton>
          </div>
        </form>
      </AppModal>

      {/* Repay Modal */}
      <AppModal isOpen={repayModalOpen} onClose={() => setRepayModalOpen(false)} title="Loan Installment Repayment">
        {selectedLoan && (
          <div>
            <p style={{ fontSize: typography.fontSize.sm, color: '#7a6658' }}>
              Repaying monthly EMI of <strong style={{ color: '#87532a' }}>{selectedLoan.installment}</strong> for Loan <strong style={{ color: '#2c1e16' }}>{selectedLoan.id}</strong> ({selectedLoan.type}).
            </p>
            <AppInput
              label="Repayment Amount (PKR)"
              value={repayAmountInput}
              onChange={(e) => setRepayAmountInput(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <AppButton variant="secondary" onClick={() => setRepayModalOpen(false)}>Cancel</AppButton>
              <AppButton variant="primary" onClick={handleRepayEmi}>
                Confirm Repayment
              </AppButton>
            </div>
          </div>
        )}
      </AppModal>

      {/* Loan Account Statement & Repayment Audit History Modal */}
      {detailsModalOpen && selectedLoan && (
        <AppModal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`Loan Account Statement (${selectedLoan.id} - ${selectedLoan.customer})`}
          maxWidth="780px"
        >
          <div>
            {/* Header & Export button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1.5px solid #e4d7c8' }}>
              <div>
                <h3 style={{ margin: 0, color: '#2c1e16', fontSize: '1.1rem' }}>{selectedLoan.type} Audit Statement</h3>
                <div style={{ fontSize: '0.78rem', color: '#7a6658', marginTop: '2px' }}>
                  Borrower: <strong>{selectedLoan.customer}</strong> • Origination Date: <strong>{selectedLoan.issueDate || '09/10/2026'}</strong>
                </div>
              </div>
              <AppButton variant="secondary" size="sm" icon={Printer} onClick={() => window.print()}>
                Export Statement (PDF)
              </AppButton>
            </div>

            {/* Financial Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.75rem', background: '#faf5ee', borderRadius: '8px', border: '1px solid #ebdccb' }}>
                <div style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase' }}>Original Principal</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2c1e16' }}>{selectedLoan.amount}</div>
              </div>
              <div style={{ padding: '0.75rem', background: '#faf5ee', borderRadius: '8px', border: '1px solid #ebdccb' }}>
                <div style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase' }}>Monthly EMI / Rate</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#b87c4c' }}>{selectedLoan.installment} <span style={{ fontSize: '0.75rem', color: '#7a6658' }}>({selectedLoan.interestRate})</span></div>
              </div>
              <div style={{ padding: '0.75rem', background: '#faf5ee', borderRadius: '8px', border: '1px solid #ebdccb' }}>
                <div style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase' }}>Remaining Outstanding</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: selectedLoan.status === 'PAID' ? '#16a34a' : '#a83e2a' }}>{selectedLoan.outstanding}</div>
              </div>
            </div>

            {/* Repayment History Audit Table */}
            <h4 style={{ margin: '1rem 0 0.5rem 0', color: '#2c1e16', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.95rem' }}>
              <History size={16} style={{ color: '#b87c4c' }} /> Repayment History & Date/Time Log
            </h4>

            <div style={{ maxHeight: '260px', overflowY: 'auto', overflowX: 'hidden' }}>
              <AppTable
                columns={[
                  { header: 'Payment Ref', render: (row) => <span style={{ fontWeight: '600', color: '#b87c4c', fontSize: '0.78rem' }}>{row.ref}</span> },
                  { header: 'Date & Time', render: (row) => <span style={{ fontSize: '0.78rem', color: '#2c1e16' }}>{row.dateTime}</span> },
                  { header: 'Paid Amount', render: (row) => <span style={{ fontWeight: '700', color: '#16a34a', fontSize: '0.78rem' }}>{row.amount}</span> },
                  { header: 'Balance After', render: (row) => <span style={{ fontSize: '0.78rem', fontWeight: '600' }}>{row.balanceAfter}</span> },
                  { header: 'Method', render: (row) => <span style={{ fontSize: '0.75rem', color: '#7a6658' }}>{row.method}</span> },
                  { header: 'Status', render: () => <AppBadge variant="success">PAID</AppBadge> },
                ]}
                data={selectedLoan.repaymentsHistory && selectedLoan.repaymentsHistory.length > 0 ? selectedLoan.repaymentsHistory : [
                  { ref: 'PAY-INIT', dateTime: `${selectedLoan.issueDate || '09/10/2026'} 10:00:00 AM`, amount: 'PKR 0.00', balanceAfter: selectedLoan.amount, method: 'Loan Origination', status: 'ACTIVE' }
                ]}
              />
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

export default Loans;




