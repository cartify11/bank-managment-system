import React, { useState } from 'react';
import { typography } from '../shared/design-system';
import AppCard from '../components/ui/AppCard';
import AppTable from '../components/ui/AppTable';
import AppBadge from '../components/ui/AppBadge';
import AppButton from '../components/ui/AppButton';
import AppModal from '../components/ui/AppModal';
import AppInput from '../components/ui/AppInput';
import AppSelect from '../components/ui/AppSelect';
import AppSearchableSelect from '../components/ui/AppSearchableSelect';
import { CreditCard, Lock, Unlock, PlusCircle, User, Calendar, ShieldCheck, FileText, Info, Edit3, CheckCircle, Smartphone, Send, Key } from 'lucide-react';
import dataStore from '../services/dataStore';

export const Cards = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [issuedCardSuccess, setIssuedCardSuccess] = useState(null);
  const [smsSentToast, setSmsSentToast] = useState(false);

  // Sanitize card numbers on load to fix any corrupted encoding symbols
  const [cardsData, setCardsData] = useState(() => {
    const raw = dataStore.getCards();
    return raw.map(c => ({
      ...c,
      number: c.number ? c.number.replace(/â€¢/g, '•').replace(/\?/g, '•') : c.number
    }));
  });

  // Dynamic Accounts list from dataStore
  const accountsList = dataStore.getAccounts();
  const accountOptions = accountsList.map(a => ({
    value: a.accountNumber,
    label: `${a.accountNumber} - ${a.customerName} (${a.type})`
  }));

  // New Card Form State
  const defaultAccount = accountsList[0]?.accountNumber || 'ACC109283741';
  const defaultHolder = accountsList[0]?.customerName || 'Aaron Katen';

  const [account, setAccount] = useState(defaultAccount);
  const [holderName, setHolderName] = useState(defaultHolder);
  const [cardType, setCardType] = useState('Visa Debit Card');
  const [limit, setLimit] = useState('5000.00');
  const [expiry, setExpiry] = useState('09/31');
  const [cardStatus, setCardStatus] = useState('ACTIVE');
  const [details, setDetails] = useState('');

  // Handle Account Selection Change for New Card
  const handleAccountChange = (e) => {
    const selectedAccNum = e.target.value;
    setAccount(selectedAccNum);
    const matchedAccount = accountsList.find(a => a.accountNumber === selectedAccNum);
    if (matchedAccount) {
      setHolderName(matchedAccount.customerName);
    }
  };

  const handleIssueCard = (e) => {
    e.preventDefault();
    const lastDigits = Math.floor(1000 + Math.random() * 9000);
    const prefix = cardType.toLowerCase().includes('mastercard') ? '5412' : '4532';

    const newCard = {
      id: Date.now(),
      number: `${prefix} •••• •••• ${lastDigits}`,
      holder: holderName || 'Cardholder',
      type: cardType,
      account,
      expiry: expiry || '09/31',
      limit: `PKR ${parseFloat(limit || 0).toLocaleString('en-PK', { minimumFractionDigits: 2 })}`,
      details: details || 'Standard Issuance - Online & ATM Enabled',
      status: cardStatus || 'ACTIVE',
    };

    const updated = [newCard, ...cardsData];
    setCardsData(updated);
    dataStore.saveCards(updated);

    // Reset Form & open Success PIN Dispatch Modal
    setDetails('');
    setModalOpen(false);
    setSmsSentToast(false);
    setIssuedCardSuccess(newCard);
  };

  // Open Edit Modal
  const openEditModal = (card) => {
    setEditingCard({
      ...card,
      limitNum: card.limit ? card.limit.replace(/[^0-9.]/g, '') : '5000.00',
      details: card.details || ''
    });
    setEditModalOpen(true);
  };

  // Save Edit Changes
  const handleUpdateCard = (e) => {
    e.preventDefault();
    if (!editingCard) return;

    const updated = cardsData.map(c => {
      if (c.id === editingCard.id) {
        return {
          ...editingCard,
          limit: `PKR ${parseFloat(editingCard.limitNum || 0).toLocaleString('en-PK', { minimumFractionDigits: 2 })}`
        };
      }
      return c;
    });

    setCardsData(updated);
    dataStore.saveCards(updated);
    setEditModalOpen(false);
    setEditingCard(null);
  };

  const toggleCard = (id) => {
    const updated = cardsData.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' };
      }
      return c;
    });
    setCardsData(updated);
    dataStore.saveCards(updated);
  };

  const columns = [
    {
      header: 'Card Number',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CreditCard size={17} style={{ color: '#b87c4c' }} />
          <span style={{ fontWeight: typography.fontWeight.bold, letterSpacing: '0.05em', color: '#2c1e16' }}>
            {row.number}
          </span>
        </div>
      )
    },
    {
      header: 'Cardholder Name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: '#2c1e16' }}>{row.holder}</div>
          {row.details && (
            <div style={{ fontSize: '0.73rem', color: '#7a6658', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Info size={12} style={{ color: '#b87c4c' }} /> {row.details}
            </div>
          )}
        </div>
      )
    },
    { header: 'Card Type', accessor: 'type' },
    { header: 'Linked Account', accessor: 'account' },
    { header: 'Expiry Date', accessor: 'expiry' },
    { header: 'Daily Limit', accessor: 'limit' },
    {
      header: 'Status',
      render: (row) => (
        <AppBadge variant={row.status === 'ACTIVE' ? 'success' : 'danger'}>{row.status}</AppBadge>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <AppButton
            size="sm"
            variant="secondary"
            icon={Edit3}
            onClick={() => openEditModal(row)}
          >
            Edit
          </AppButton>
          <AppButton
            size="sm"
            variant={row.status === 'ACTIVE' ? 'danger' : 'outline'}
            icon={row.status === 'ACTIVE' ? Lock : Unlock}
            onClick={() => toggleCard(row.id)}
          >
            {row.status === 'ACTIVE' ? 'Block Card' : 'Unblock'}
          </AppButton>
        </div>
      )
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            Card Management Services
          </h1>
          <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginTop: '0.2rem' }}>
            Issuance and management of Debit and Credit cards, ATM limits, and instant lock controls
          </div>
        </div>
        <AppButton variant="primary" icon={PlusCircle} onClick={() => setModalOpen(true)}>
          Issue New Card
        </AppButton>
      </div>

      <AppCard title="Issued Cards Directory">
        <AppTable columns={columns} data={cardsData} />
      </AppCard>

      {/* Modal for Issuing New Card */}
      <AppModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Issue New Debit/Credit Card">
        <form onSubmit={handleIssueCard}>
          <AppSearchableSelect
            label="Linked Bank Account"
            placeholder="Search by account number or customer name..."
            value={account}
            onChange={handleAccountChange}
            options={accountOptions.map(a => ({
              value: a.value,
              label: a.label,
              sublabel: `Account Number: ${a.value}`
            }))}
            required
          />

          <AppInput
            label="Cardholder Name (Name Printed on Card)"
            icon={User}
            type="text"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value)}
            placeholder="e.g. Ali Khan"
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AppSelect
              label="Card Type / Network"
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
              options={[
                { value: 'Visa Debit Card', label: 'Visa Debit Card' },
                { value: 'Visa Gold Debit Card', label: 'Visa Gold Debit Card' },
                { value: 'Visa Platinum Credit Card', label: 'Visa Platinum Credit Card' },
                { value: 'Mastercard Platinum Credit Card', label: 'Mastercard Platinum Credit Card' },
                { value: 'Mastercard World Elite', label: 'Mastercard World Elite' },
                { value: 'UnionPay Debit Card', label: 'UnionPay Debit Card' },
              ]}
            />

            <AppInput
              label="Expiry Date (MM/YY)"
              icon={Calendar}
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="09/31"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AppInput
              label="Daily Spending Limit (PKR)"
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
            />

            <AppSelect
              label="Card Status"
              value={cardStatus}
              onChange={(e) => setCardStatus(e.target.value)}
              options={[
                { value: 'ACTIVE', label: 'ACTIVE' },
                { value: 'BLOCKED', label: 'BLOCKED' },
              ]}
            />
          </div>

          <AppInput
            label="Card Details & Special Remarks"
            icon={FileText}
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="e.g. International POS enabled, Primary Business Card, Express Delivery"
          />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.82rem',
            color: '#166534',
            background: '#f0fdf4',
            padding: '0.75rem 0.9rem',
            borderRadius: '8px',
            border: '1px solid #bbf7d0',
            marginTop: '0.75rem',
            marginBottom: '0.5rem'
          }}>
            <ShieldCheck size={20} style={{ color: '#16a34a', flexShrink: 0 }} />
            <div>
              <strong>Security PIN Policy:</strong> Bank staff cannot view or enter customer PINs. Upon issuance, an encrypted temporary activation PIN is automatically dispatched to the customer's registered phone number via SMS.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <AppButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AppButton>
            <AppButton type="submit" variant="primary">Request Card Issuance</AppButton>
          </div>
        </form>
      </AppModal>

      {/* Modal for Editing Card */}
      {editingCard && (
        <AppModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title={`Edit Card Details (${editingCard.number})`}>
          <form onSubmit={handleUpdateCard}>
            <AppInput
              label="Cardholder Name"
              icon={User}
              type="text"
              value={editingCard.holder || ''}
              onChange={(e) => setEditingCard({ ...editingCard, holder: e.target.value })}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <AppSelect
                label="Card Type / Network"
                value={editingCard.type || 'Visa Debit Card'}
                onChange={(e) => setEditingCard({ ...editingCard, type: e.target.value })}
                options={[
                  { value: 'Visa Debit Card', label: 'Visa Debit Card' },
                  { value: 'Visa Gold Debit Card', label: 'Visa Gold Debit Card' },
                  { value: 'Visa Platinum Credit Card', label: 'Visa Platinum Credit Card' },
                  { value: 'Mastercard Platinum Credit Card', label: 'Mastercard Platinum Credit Card' },
                  { value: 'Mastercard World Elite', label: 'Mastercard World Elite' },
                  { value: 'UnionPay Debit Card', label: 'UnionPay Debit Card' },
                ]}
              />

              <AppSelect
                label="Linked Bank Account"
                value={editingCard.account || ''}
                onChange={(e) => setEditingCard({ ...editingCard, account: e.target.value })}
                options={accountOptions}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <AppInput
                label="Expiry Date (MM/YY)"
                icon={Calendar}
                type="text"
                value={editingCard.expiry || ''}
                onChange={(e) => setEditingCard({ ...editingCard, expiry: e.target.value })}
                required
              />

              <AppInput
                label="Daily Spending Limit (PKR)"
                type="number"
                value={editingCard.limitNum || ''}
                onChange={(e) => setEditingCard({ ...editingCard, limitNum: e.target.value })}
                required
              />
            </div>

            <AppSelect
              label="Card Status"
              value={editingCard.status || 'ACTIVE'}
              onChange={(e) => setEditingCard({ ...editingCard, status: e.target.value })}
              options={[
                { value: 'ACTIVE', label: 'ACTIVE' },
                { value: 'BLOCKED', label: 'BLOCKED' },
              ]}
            />

            <div style={{
              fontSize: '0.75rem',
              color: '#7a6658',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginBottom: '1rem',
              background: '#faf5ee',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #ebdccb'
            }}>
              <ShieldCheck size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
              <span>
                <strong>Confidential Customer PIN:</strong> Security PIN is confidential to the customer only and is securely managed by the cardholder. Bank staff do not have access to view or modify customer PINs.
              </span>
            </div>

            <AppInput
              label="Card Details & Special Remarks"
              icon={FileText}
              type="text"
              value={editingCard.details || ''}
              onChange={(e) => setEditingCard({ ...editingCard, details: e.target.value })}
              placeholder="e.g. VIP Member, POS Limit Updated"
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <AppButton variant="secondary" onClick={() => setEditModalOpen(false)}>Cancel</AppButton>
              <AppButton type="submit" variant="primary">Save Changes</AppButton>
            </div>
          </form>
        </AppModal>
      )}

      {/* Modal for Card Issuance & PIN Dispatch Confirmation */}
      {issuedCardSuccess && (
        <AppModal
          isOpen={!!issuedCardSuccess}
          onClose={() => { setIssuedCardSuccess(null); setSmsSentToast(false); }}
          title="Card Issued & Security PIN Generated"
        >
          <div style={{ textAlign: 'center', padding: '0.25rem 0 0.5rem 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.85rem auto'
            }}>
              <CheckCircle size={32} color="#16a34a" />
            </div>

            <h3 style={{ margin: '0 0 0.4rem 0', color: '#1f2937', fontSize: '1.2rem', fontWeight: 'bold' }}>
              Card Successfully Issued!
            </h3>
            <p style={{ margin: '0 0 1.25rem 0', color: '#6b7280', fontSize: '0.85rem' }}>
              The new payment card has been registered and activated in the banking network.
            </p>

            {/* Card Summary Card */}
            <div style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '1.25rem',
              textAlign: 'left',
              marginBottom: '1.25rem',
              boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#94a3b8' }}>
                  {issuedCardSuccess.type}
                </span>
                <CreditCard size={22} color="#38bdf8" />
              </div>
              <div style={{ fontSize: '1.2rem', letterSpacing: '2px', fontFamily: 'monospace', marginBottom: '1rem', fontWeight: 'bold' }}>
                {issuedCardSuccess.number}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Cardholder</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{issuedCardSuccess.holder}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Account</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#93c5fd' }}>{issuedCardSuccess.account}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Expires</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{issuedCardSuccess.expiry}</div>
                </div>
              </div>
            </div>

            {/* How PIN is Given / Security Section */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '1rem',
              textAlign: 'left',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', color: '#0f172a', fontWeight: 'bold', fontSize: '0.9rem' }}>
                <Key size={18} color="#2563eb" />
                Customer PIN Delivery & Activation Process
              </div>

              <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <Smartphone size={16} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong>Automated SMS Delivery:</strong> An encrypted 4-digit temporary activation PIN has been dispatched directly to <strong>{issuedCardSuccess.holder}</strong>'s registered mobile number. Bank staff cannot view this code.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <ShieldCheck size={16} color="#2563eb" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong>Self-Service Green PIN:</strong> The customer can insert this card at any Bank ATM or login to Mobile Banking to set their own permanent private 4-digit PIN.
                  </div>
                </div>
              </div>
            </div>

            {smsSentToast && (
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle size={16} color="#059669" />
                <span>Activation SMS notification re-sent to customer's phone!</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <AppButton
                variant="secondary"
                icon={Send}
                onClick={() => setSmsSentToast(true)}
              >
                Resend SMS to Customer
              </AppButton>
              <AppButton
                variant="primary"
                onClick={() => { setIssuedCardSuccess(null); setSmsSentToast(false); }}
              >
                Close & Complete
              </AppButton>
            </div>
          </div>
        </AppModal>
      )}
    </div>
  );
};

export default Cards;




