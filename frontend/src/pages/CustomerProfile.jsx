import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { colors, typography } from '../shared/design-system';
import AppCard from '../components/ui/AppCard';
import AppBadge from '../components/ui/AppBadge';
import AppTabs from '../components/ui/AppTabs';
import AppTable from '../components/ui/AppTable';
import AppButton from '../components/ui/AppButton';
import AppInput from '../components/ui/AppInput';
import AppModal from '../components/ui/AppModal';
import { Mail, Phone, MapPin, Calendar, CreditCard, Edit, Camera, Upload, History } from 'lucide-react';
import dataStore from '../services/dataStore';

const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='%23ebd9c8' stroke='%238c4e20' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='8' r='5'/><path d='M20 21a8 8 0 0 0-16 0'/></svg>";

export const CustomerProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('accounts');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch customer dynamically from dataStore
  const allCustomers = dataStore.getCustomers();
  const customerObj = allCustomers.find(c => c.id.toString() === (id || '1').toString()) || allCustomers[0] || {
    id: id || 1,
    name: 'Customer',
    email: '',
    phone: '',
    nationalId: '',
    status: 'Active',
    accountsCount: 0,
    photoUrl: '',
  };

  const [name, setName] = useState(customerObj.name);
  const [email, setEmail] = useState(customerObj.email);
  const [phone, setPhone] = useState(customerObj.phone);
  const [nationalId, setNationalId] = useState(customerObj.nationalId);
  const [photoUrl, setPhotoUrl] = useState(customerObj.photoUrl || '');

  // Dynamic accounts for this specific customer
  const allAccounts = dataStore.getAccounts();
  const customerAccounts = allAccounts.filter(a => 
    a.customerName && customerObj.name && (
      a.customerName.toLowerCase() === customerObj.name.toLowerCase() ||
      a.customerName.toLowerCase().includes(customerObj.name.toLowerCase()) ||
      customerObj.name.toLowerCase().includes(a.customerName.toLowerCase())
    )
  );

  const customerAccNumbers = customerAccounts.map(a => a.accountNumber);

  // Dynamic transaction history strictly for this customer only
  const allTransactions = dataStore.getTransactions();
  const transactionHistory = allTransactions.filter(t => {
    const matchesAcc = (t.source && customerAccNumbers.includes(t.source)) || 
                       (t.target && customerAccNumbers.includes(t.target));
    const matchesName = t.name && customerObj.name && 
                        t.name.toLowerCase().includes(customerObj.name.toLowerCase());
    const matchesEmail = t.email && customerObj.email && 
                         t.email.toLowerCase() === customerObj.email.toLowerCase();
    return matchesAcc || matchesName || matchesEmail;
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const updatedCustomers = allCustomers.map(c => c.id.toString() === customerObj.id.toString() ? {
      ...c,
      name,
      email,
      phone,
      nationalId,
      photoUrl,
    } : c);

    dataStore.saveCustomers(updatedCustomers);
    setEditModalOpen(false);
  };

  const initials = customerObj.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            Customer Profile
          </h1>
          <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginTop: '0.2rem' }}>
            Detailed customer information, linked accounts, and transaction logs
          </div>
        </div>
        <AppButton variant="secondary" size="sm" icon={Edit} onClick={() => {
          setName(customerObj.name);
          setEmail(customerObj.email);
          setPhone(customerObj.phone);
          setNationalId(customerObj.nationalId);
          setPhotoUrl(customerObj.photoUrl);
          setEditModalOpen(true);
        }}>
          Edit Customer Profile
        </AppButton>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem' }}>
        {/* Left: Customer Info Card with Passport Photo */}
        <AppCard>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative' }}>
            {/* Passport / CNIC Style Photo Frame */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.85rem' }}>
              <img
                src={customerObj.photoUrl || photoUrl}
                alt={customerObj.name}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #b87c4c',
                  boxShadow: '0 6px 20px rgba(184, 124, 76, 0.35)',
                  backgroundColor: '#f7ebd9',
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80';
                }}
              />
              <button
                onClick={() => setEditModalOpen(true)}
                title="Change Photo"
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#b87c4c',
                  color: '#2c1e16',
                  border: '2px solid #ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                }}
              >
                <Camera size={14} />
              </button>
            </div>

            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: typography.fontSize.lg, color: '#2c1e16' }}>{customerObj.name}</h3>
            <AppBadge variant={customerObj.status === 'Active' ? 'success' : 'warning'}>{customerObj.status} Customer</AppBadge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: typography.fontSize.sm, color: '#2c1e16' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Mail size={16} style={{ color: '#b87c4c' }} /> <span style={{ color: '#4a382c' }}>{customerObj.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Phone size={16} style={{ color: '#b87c4c' }} /> <span style={{ color: '#4a382c' }}>{customerObj.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <MapPin size={16} style={{ color: '#b87c4c' }} /> <span style={{ color: '#4a382c' }}>123 Main St, New York, NY</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Calendar size={16} style={{ color: '#b87c4c' }} /> <span style={{ color: '#4a382c' }}>National ID: {customerObj.nationalId}</span>
            </div>
          </div>
        </AppCard>

        {/* Right: Accounts & Activity Tabs */}
        <AppCard>
          <AppTabs
            tabs={[
              { id: 'accounts', label: `Accounts (${customerAccounts.length})` },
              { id: 'history', label: `Transaction History (${transactionHistory.length})` },
              { id: 'personal', label: 'Personal Information' },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {activeTab === 'accounts' && (
            customerAccounts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {customerAccounts.map((acc, idx) => (
                  <div key={idx} style={{ padding: '1rem', background: '#faf5ee', border: '1px solid #eee4d8', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <CreditCard size={24} style={{ color: '#b87c4c' }} />
                      <div>
                        <div style={{ fontWeight: typography.fontWeight.semibold, color: '#2c1e16', fontSize: '0.95rem' }}>{acc.accountNumber}</div>
                        <div style={{ fontSize: '0.75rem', color: '#7a6658' }}>{acc.type}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: typography.fontWeight.bold, fontSize: '1.1rem', color: '#2c1e16' }}>{acc.balance}</div>
                      <AppBadge variant="success">{acc.status}</AppBadge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#faf5ee', borderRadius: '12px', border: '1px dashed #ebdccb', color: '#7a6658' }}>
                <CreditCard size={36} style={{ color: '#d1bfae', marginBottom: '0.75rem' }} />
                <div style={{ fontWeight: 600, color: '#2c1e16', marginBottom: '0.25rem' }}>No Accounts Opened Yet</div>
                <div style={{ fontSize: '0.82rem' }}>This customer has not opened any bank accounts yet. Open an account from the Accounts page.</div>
              </div>
            )
          )}

          {activeTab === 'history' && (
            transactionHistory.length > 0 ? (
              <AppTable
                columns={[
                  { header: 'Ref ID', accessor: 'ref' },
                  { header: 'Date', accessor: 'date' },
                  { header: 'Type', accessor: 'type' },
                  { header: 'Amount', accessor: 'amount' },
                  { header: 'Status', render: (row) => <AppBadge variant="success">{row.status}</AppBadge> },
                ]}
                data={transactionHistory}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#faf5ee', borderRadius: '12px', border: '1px dashed #ebdccb', color: '#7a6658' }}>
                <History size={36} style={{ color: '#d1bfae', marginBottom: '0.75rem' }} />
                <div style={{ fontWeight: 600, color: '#2c1e16', marginBottom: '0.25rem' }}>No Transactions Yet</div>
                <div style={{ fontSize: '0.82rem' }}>This customer has not performed any transfers, deposits, or withdrawals yet.</div>
              </div>
            )
          )}

          {activeTab === 'personal' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: typography.fontSize.sm, color: '#2c1e16', background: '#fdfbf7', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e4d7c8' }}>
              <div><strong style={{ color: '#7a6658', display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>Full Name:</strong> <span style={{ color: '#2c1e16', fontSize: '0.95rem', fontWeight: 600 }}>{customerObj.name}</span></div>
              <div><strong style={{ color: '#7a6658', display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>National ID / SSN:</strong> <span style={{ color: '#2c1e16', fontSize: '0.95rem', fontWeight: 600 }}>{customerObj.nationalId}</span></div>
              <div><strong style={{ color: '#7a6658', display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>Email Address:</strong> <span style={{ color: '#2c1e16', fontSize: '0.95rem', fontWeight: 600 }}>{customerObj.email}</span></div>
              <div><strong style={{ color: '#7a6658', display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>Phone Number:</strong> <span style={{ color: '#2c1e16', fontSize: '0.95rem', fontWeight: 600 }}>{customerObj.phone}</span></div>
              <div><strong style={{ color: '#7a6658', display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>Account Status:</strong> <AppBadge variant={customerObj.status === 'Active' ? 'success' : 'warning'}>{customerObj.status}</AppBadge></div>
            </div>
          )}
        </AppCard>
      </div>

      {/* Edit Customer Profile Modal with Photo Upload */}
      <AppModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Customer Profile">
        <form onSubmit={handleUpdateProfile}>
          {/* Photo Preview & Upload Box */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem', padding: '1rem', background: '#faf5ee', borderRadius: '12px', border: '1px dashed #d8ba9e' }}>
            <div style={{ marginBottom: '0.5rem', position: 'relative', display: 'inline-block' }}>
              <img
                src={photoUrl || DEFAULT_AVATAR}
                alt="Profile Preview"
                style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #b87c4c', background: '#ffffff' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <AppButton type="button" variant="outline" size="sm" icon={Upload} onClick={() => fileInputRef.current?.click()}>
                Upload Photo (Passport/CNIC)
              </AppButton>
              {photoUrl && (
                <AppButton type="button" variant="secondary" size="sm" onClick={() => setPhotoUrl('')}>
                  Remove
                </AppButton>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
            </div>
            <div style={{ fontSize: '11px', color: '#8c7665', marginTop: '0.4rem' }}>
              Select JPG, PNG picture directly from your computer or phone
            </div>
          </div>

          <AppInput label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <AppInput label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <AppInput label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <AppInput label="National ID / SSN (CNIC)" value={nationalId} onChange={(e) => setNationalId(e.target.value)} />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <AppButton variant="secondary" onClick={() => setEditModalOpen(false)}>Cancel</AppButton>
            <AppButton type="submit" variant="primary">Save Changes</AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default CustomerProfile;

