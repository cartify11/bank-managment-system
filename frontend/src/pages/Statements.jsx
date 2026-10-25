import React, { useState } from 'react';
import { colors, typography } from '../shared/design-system';
import AppCard from '../components/ui/AppCard';
import AppTable from '../components/ui/AppTable';
import AppButton from '../components/ui/AppButton';
import AppInput from '../components/ui/AppInput';
import AppSelect from '../components/ui/AppSelect';
import AppSearchableSelect from '../components/ui/AppSearchableSelect';
import AppModal from '../components/ui/AppModal';
import { FileText, Download, Printer, CheckCircle2, RotateCcw } from 'lucide-react';
import dataStore from '../services/dataStore';

export const Statements = () => {
  const allAccounts = dataStore.getAccounts();
  const [accountNumber, setAccountNumber] = useState(allAccounts[0]?.accountNumber || 'ACC109283741');
  
  const todayStr = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState(todayStr);
  const [filterActive, setFilterActive] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [statementPdfOpen, setStatementPdfOpen] = useState(false);

  // Match selected account details
  const selectedAccount = allAccounts.find(a => a.accountNumber === accountNumber) || allAccounts[0] || {
    accountNumber: accountNumber || 'ACC109283741',
    customerName: 'Account Holder',
    type: 'Savings',
    balance: 'PKR 0.00',
    currency: 'PKR'
  };

  const parseNum = (str) => parseFloat((str || '0').toString().replace(/[^0-9.]/g, '')) || 0;
  const formatMoney = (val) => `PKR ${Number(val).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const accountOptions = allAccounts.map(a => ({
    value: a.accountNumber,
    label: `${a.accountNumber} - ${a.customerName}`,
    sublabel: `${a.type} | Current Balance: ${a.balance}`
  }));

  const allTransactions = dataStore.getTransactions();

  // Robust date parser for various banking timestamp formats
  const parseTxDate = (dateStr) => {
    if (!dateStr) return null;
    const clean = dateStr.replace(/,/g, '').trim();
    const d = new Date(clean);
    if (!isNaN(d.getTime())) return d;
    const parts = clean.split(/[-/\s]+/);
    if (parts.length >= 3) {
      if (parts[2].length === 4) {
        return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
      }
      if (parts[0].length === 4) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
    }
    return null;
  };

  // Filter transactions specifically relevant to the selected account
  const accountTransactions = allTransactions.filter(t => {
    const isSource = t.source === accountNumber;
    const isTarget = t.target === accountNumber;
    return isSource || isTarget;
  });

  // Apply date range filter if user clicked Generate Statement
  const filteredTransactions = accountTransactions.filter(t => {
    if (!filterActive) return true;
    const txDate = parseTxDate(t.date);
    if (!txDate) return true;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate + 'T23:59:59') : null;
    if (start && txDate < start) return false;
    if (end && txDate > end) return false;
    return true;
  });

  // Calculate dynamic totals for the selected account
  let totalDeposits = 0;
  let totalWithdrawals = 0;

  filteredTransactions.forEach(t => {
    const amt = parseNum(t.amount);
    const isCredit = t.target === accountNumber || (t.type === 'DEPOSIT' && t.source !== accountNumber);
    const isDebit = t.source === accountNumber || (t.type === 'WITHDRAWAL' && t.target !== accountNumber);

    if (isCredit) {
      totalDeposits += amt;
    } else if (isDebit) {
      totalWithdrawals += amt;
    }
  });

  const closingBalanceNum = parseNum(selectedAccount?.balance || 0);
  const openingBalanceNum = Math.max(0, closingBalanceNum - totalDeposits + totalWithdrawals);

  // Chronologically sort to calculate accurate running balance for every row
  const sortedChrono = [...filteredTransactions].sort((a, b) => {
    const da = parseTxDate(a.date) || 0;
    const db = parseTxDate(b.date) || 0;
    return da - db;
  });

  let running = openingBalanceNum;
  const rowsWithBalance = sortedChrono.map(t => {
    const amt = parseNum(t.amount);
    const isCredit = t.target === accountNumber || (t.type === 'DEPOSIT' && t.source !== accountNumber);
    const isDebit = t.source === accountNumber || (t.type === 'WITHDRAWAL' && t.target !== accountNumber);

    if (isCredit) {
      running += amt;
    } else if (isDebit) {
      running = Math.max(0, running - amt);
    }

    let cleanDesc = '';
    if (t.type === 'DEPOSIT') {
      cleanDesc = `DEPOSIT - Cash/Online to ${t.target || accountNumber}`;
    } else if (t.type === 'WITHDRAWAL') {
      cleanDesc = `WITHDRAWAL - From ${t.source || accountNumber}`;
    } else if (t.type === 'TRANSFER') {
      if (isDebit) {
        cleanDesc = `TRANSFER - Outgoing to ${t.target}`;
      } else {
        cleanDesc = `TRANSFER - Incoming from ${t.source} (${t.name || 'Customer'})`;
      }
    } else if (t.type === 'FIXED_DEPOSIT') {
      cleanDesc = `FIXED DEPOSIT - Certificate ${t.target || 'Booking'}`;
    } else {
      cleanDesc = `${t.type} - ${t.source} to ${t.target}`;
    }

    return {
      ref: t.ref || `TX-${t.id || '0000'}`,
      date: t.date,
      description: cleanDesc,
      type: t.type,
      debit: isDebit ? formatMoney(amt) : '-',
      credit: isCredit ? formatMoney(amt) : '-',
      balance: formatMoney(running),
      rawTx: t
    };
  });

  // Display newest transactions first in table
  const statementTransactions = [...rowsWithBalance].reverse();

  const columns = [
    { header: 'Reference', render: (row) => (
      <span style={{ fontWeight: typography.fontWeight.semibold, color: colors.primary }}>
        {row.ref}
      </span>
    )},
    { header: 'Date', accessor: 'date' },
    { header: 'Description', accessor: 'description' },
    { header: 'Debit (-)', render: (row) => (
      <span style={{ color: row.debit !== '-' ? colors.dangerText : '#9ca3af', fontWeight: row.debit !== '-' ? '600' : 'normal' }}>
        {row.debit}
      </span>
    )},
    { header: 'Credit (+)', render: (row) => (
      <span style={{ color: row.credit !== '-' ? colors.successText : '#9ca3af', fontWeight: row.credit !== '-' ? '600' : 'normal' }}>
        {row.credit}
      </span>
    )},
    { header: 'Closing Balance', render: (row) => (
      <span style={{ fontWeight: '600', color: '#1f2937' }}>
        {row.balance}
      </span>
    )},
    { header: 'Receipt', render: (row) => (
      <button
        onClick={() => { setSelectedTx(row); setReceiptModalOpen(true); }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: colors.primary,
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.85rem'
        }}
      >
        <Printer size={15} /> Receipt
      </button>
    )},
  ];

  // Handle Real CSV Export
  const handleExportCSV = () => {
    if (statementTransactions.length === 0) {
      alert(`No transactions found for account ${accountNumber} to export.`);
      return;
    }

    const headers = ['Reference', 'Date', 'Description', 'Debit', 'Credit', 'Closing Balance'];
    const rows = statementTransactions.map(t => [
      `"${t.ref}"`,
      `"${t.date}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.debit}"`,
      `"${t.credit}"`,
      `"${t.balance}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Statement_${accountNumber}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            Account Statements & Digital Receipts
          </h1>
          <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginTop: '0.2rem' }}>
            Generate official monthly bank statements, date-filtered ledgers, and transaction receipts
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <AppButton variant="outline" icon={Download} onClick={handleExportCSV}>Export CSV</AppButton>
          <AppButton variant="primary" icon={FileText} onClick={() => setStatementPdfOpen(true)}>Download PDF Statement</AppButton>
        </div>
      </div>

      <AppCard title="Statement Filter & Generator">
        {/* Selected Customer Highlight Strip */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fcfaf7',
          padding: '0.75rem 1.25rem',
          borderRadius: '8px',
          border: '1px solid #ebdccb',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#87532a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}>
              {selectedAccount.customerName ? selectedAccount.customerName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#2c1e16' }}>
                {selectedAccount.customerName}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#7a6658' }}>
                Account: <strong style={{ color: '#2c1e16' }}>{selectedAccount.accountNumber}</strong> • Type: <strong style={{ color: '#2c1e16' }}>{selectedAccount.type}</strong>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#7a6658', textTransform: 'uppercase' }}>Current Balance</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#16a34a' }}>
              {selectedAccount.balance}
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto auto', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
          <AppSearchableSelect
            label="Select Account"
            placeholder="Search account number, holder name, or type..."
            value={accountNumber}
            onChange={(e) => {
              setAccountNumber(e.target.value);
            }}
            options={accountOptions}
          />
          <AppInput
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <AppInput
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <div style={{ marginBottom: '1rem' }}>
            <AppButton
              variant="primary"
              onClick={() => setFilterActive(true)}
            >
              Generate Statement
            </AppButton>
          </div>
          {filterActive && (
            <div style={{ marginBottom: '1rem' }}>
              <AppButton
                variant="secondary"
                icon={RotateCcw}
                onClick={() => {
                  setFilterActive(false);
                  setStartDate('2023-01-01');
                  setEndDate(todayStr);
                }}
              >
                Reset
              </AppButton>
            </div>
          )}
        </div>

        {/* Account Summary Strip - Dynamically Calculated for the selected account */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(13,148,136,0.20)', borderRadius: '12px', marginBottom: '1.5rem', overflow: 'hidden', border: '1px solid rgba(13,148,136,0.25)' }}>
          <div style={{ padding: '1rem', background: '#ffffff', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Opening Balance</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.15rem', color: '#2c1e16' }}>{formatMoney(openingBalanceNum)}</div>
          </div>
          <div style={{ padding: '1rem', background: '#ffffff', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Total Deposits</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.15rem', color: '#16a34a' }}>+{formatMoney(totalDeposits)}</div>
          </div>
          <div style={{ padding: '1rem', background: '#ffffff', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Total Withdrawals</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.15rem', color: '#dc2626' }}>-{formatMoney(totalWithdrawals)}</div>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(13,148,136,0.12)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Closing Balance</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.15rem', color: '#0d9488' }}>{formatMoney(closingBalanceNum)}</div>
          </div>
        </div>

        {statementTransactions.length > 0 ? (
          <AppTable columns={columns} data={statementTransactions} />
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            background: '#fafaf9',
            borderRadius: '8px',
            border: '1px dashed #d6d3d1',
            color: '#78716c'
          }}>
            <FileText size={40} style={{ color: '#a8a29e', margin: '0 auto 0.75rem auto' }} />
            <div style={{ fontWeight: '600', fontSize: '1rem', color: '#44403c', marginBottom: '0.3rem' }}>
              No Transactions Recorded
            </div>
            <div style={{ fontSize: '0.85rem' }}>
              There are no transactions recorded for account <strong>{accountNumber}</strong> ({selectedAccount.customerName}) in this period.
            </div>
          </div>
        )}
      </AppCard>

      {/* Printable Receipt Modal */}
      <AppModal isOpen={receiptModalOpen} onClose={() => setReceiptModalOpen(false)} title="Official Transaction Receipt">
        {selectedTx && (
          <div style={{ border: '1px solid rgba(13,148,136,0.3)', padding: '1.5rem', borderRadius: '12px', background: '#ffffff' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
              <CheckCircle2 size={36} style={{ color: '#16a34a', marginBottom: '0.5rem' }} />
              <h3 style={{ margin: 0, color: '#2c1e16', letterSpacing: '1px' }}>ENTERPRISE BANK RECEIPT</h3>
              <div style={{ fontSize: '0.75rem', color: '#7a6658' }}>Transaction Reference: {selectedTx.ref}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: typography.fontSize.sm, marginBottom: '1.5rem', color: '#2c1e16' }}>
              <div><strong style={{ color: '#7a6658' }}>Date & Time:</strong> <span style={{ color: '#2c1e16' }}>{selectedTx.date}</span></div>
              <div><strong style={{ color: '#7a6658' }}>Account Holder:</strong> <span style={{ color: '#2c1e16' }}>{selectedAccount.customerName}</span></div>
              <div><strong style={{ color: '#7a6658' }}>Account Number:</strong> <span style={{ color: '#2c1e16' }}>{accountNumber}</span></div>
              <div><strong style={{ color: '#7a6658' }}>Transaction Type:</strong> <span style={{ color: '#2c1e16' }}>{selectedTx.type}</span></div>
              <div><strong style={{ color: '#7a6658' }}>Amount:</strong> <span style={{ fontWeight: 'bold', color: selectedTx.debit !== '-' ? '#dc2626' : '#16a34a' }}>{selectedTx.debit !== '-' ? selectedTx.debit : selectedTx.credit}</span></div>
              <div><strong style={{ color: '#7a6658' }}>Closing Balance:</strong> <span style={{ color: '#2c1e16', fontWeight: 600 }}>{selectedTx.balance}</span></div>
              <div style={{ gridColumn: 'span 2' }}><strong style={{ color: '#7a6658' }}>Description:</strong> <span style={{ color: '#2c1e16' }}>{selectedTx.description}</span></div>
              <div><strong style={{ color: '#7a6658' }}>Status:</strong> <span style={{ color: '#16a34a', fontWeight: 600 }}>COMPLETED</span></div>
              <div><strong style={{ color: '#7a6658' }}>Verification:</strong> <span style={{ color: '#2563eb', fontWeight: 600 }}>VERIFIED DIGITALLY</span></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <AppButton variant="secondary" onClick={() => window.print()} icon={Printer}>Print Receipt</AppButton>
              <AppButton variant="primary" onClick={() => setReceiptModalOpen(false)}>Close</AppButton>
            </div>
          </div>
        )}
      </AppModal>

      {/* Official Account Statement Printable Preview Modal */}
      {statementPdfOpen && (
        <AppModal isOpen={statementPdfOpen} onClose={() => setStatementPdfOpen(false)} title="Official Account Statement Preview">
          <div style={{ padding: '1rem', background: '#ffffff', color: '#1f2937' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #87532a', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ margin: '0 0 0.25rem 0', color: '#2c1e16', fontSize: '1.4rem' }}>ENTERPRISE COMMERCIAL BANK</h2>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Official Account Statement & Financial Ledger</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Statement Period:</div>
                <div style={{ fontWeight: 'bold', color: '#2c1e16', fontSize: '0.9rem' }}>{startDate} to {endDate}</div>
              </div>
            </div>

            {/* Account Details Box */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid #e5e7eb' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ACCOUNT HOLDER</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827' }}>{selectedAccount.customerName}</div>
                <div style={{ fontSize: '0.8rem', color: '#4b5563' }}>Account: {selectedAccount.accountNumber}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ACCOUNT TYPE & STATUS</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#111827' }}>{selectedAccount.type} Account</div>
                <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold' }}>Status: {selectedAccount.status || 'Active'}</div>
              </div>
            </div>

            {/* Financial Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ background: '#f3f4f6', padding: '0.75rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>OPENING BALANCE</div>
                <div style={{ fontWeight: 'bold', color: '#111827' }}>{formatMoney(openingBalanceNum)}</div>
              </div>
              <div style={{ background: '#f0fdf4', padding: '0.75rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.7rem', color: '#166534' }}>TOTAL DEPOSITS</div>
                <div style={{ fontWeight: 'bold', color: '#16a34a' }}>+{formatMoney(totalDeposits)}</div>
              </div>
              <div style={{ background: '#fef2f2', padding: '0.75rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.7rem', color: '#991b1b' }}>TOTAL WITHDRAWALS</div>
                <div style={{ fontWeight: 'bold', color: '#dc2626' }}>-{formatMoney(totalWithdrawals)}</div>
              </div>
              <div style={{ background: '#ecfdf5', padding: '0.75rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.7rem', color: '#065f46' }}>CLOSING BALANCE</div>
                <div style={{ fontWeight: 'bold', color: '#0d9488' }}>{formatMoney(closingBalanceNum)}</div>
              </div>
            </div>

            {/* Printable Statement Rows */}
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem 0.75rem' }}>Ref #</th>
                    <th style={{ padding: '0.6rem 0.75rem' }}>Date</th>
                    <th style={{ padding: '0.6rem 0.75rem' }}>Description</th>
                    <th style={{ padding: '0.6rem 0.75rem' }}>Debit (-)</th>
                    <th style={{ padding: '0.6rem 0.75rem' }}>Credit (+)</th>
                    <th style={{ padding: '0.6rem 0.75rem' }}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {statementTransactions.map((tx, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'monospace', fontWeight: 'bold' }}>{tx.ref}</td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>{tx.date}</td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>{tx.description}</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: tx.debit !== '-' ? '#dc2626' : '#9ca3af' }}>{tx.debit}</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: tx.credit !== '-' ? '#16a34a' : '#9ca3af', fontWeight: tx.credit !== '-' ? 'bold' : 'normal' }}>{tx.credit}</td>
                      <td style={{ padding: '0.6rem 0.75rem', fontWeight: 'bold' }}>{tx.balance}</td>
                    </tr>
                  ))}
                  {statementTransactions.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af' }}>
                        No transactions recorded for this account.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <AppButton variant="secondary" onClick={() => setStatementPdfOpen(false)}>Close Preview</AppButton>
              <AppButton variant="primary" icon={Printer} onClick={() => window.print()}>Print / Save as PDF</AppButton>
            </div>
          </div>
        </AppModal>
      )}
    </div>
  );
};

export default Statements;


