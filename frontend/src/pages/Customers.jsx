import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, typography } from '../shared/design-system';
import AppCard from '../components/ui/AppCard';
import AppTable from '../components/ui/AppTable';
import AppBadge from '../components/ui/AppBadge';
import AppButton from '../components/ui/AppButton';
import AppInput from '../components/ui/AppInput';
import AppSelect from '../components/ui/AppSelect';
import AppModal from '../components/ui/AppModal';
import { Search, UserPlus, Eye, Edit, Upload, Trash2, Camera, User } from 'lucide-react';
import dataStore from '../services/dataStore';

export const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  // Load persistent customers list from dataStore
  const [customers, setCustomers] = useState(() => dataStore.getCustomers());

  React.useEffect(() => {
    const handleSync = () => setCustomers(dataStore.getCustomers());
    window.addEventListener('bms_data_changed', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('bms_data_changed', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  // Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

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

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    const newCustomer = {
      id: customers.length + 1,
      name,
      email,
      phone: phone || '-',
      accountsCount: 1,
      status: 'Active',
      nationalId: nationalId || `CNIC-${Math.floor(10000 + Math.random() * 90000)}`,
      photoUrl: photoUrl || '',
    };

    const updated = [newCustomer, ...customers];
    setCustomers(updated);
    dataStore.saveCustomers(updated);

    setName('');
    setEmail('');
    setPhone('');
    setNationalId('');
    setPhotoUrl('');
    setAddModalOpen(false);
  };

  const handleOpenEdit = (customer) => {
    setSelectedCustomer(customer);
    setName(customer.name);
    setEmail(customer.email);
    setPhone(customer.phone);
    setNationalId(customer.nationalId);
    setPhotoUrl(customer.photoUrl || '');
    setEditModalOpen(true);
  };

  const handleUpdateCustomer = (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const updated = customers.map(c => c.id === selectedCustomer.id ? {
      ...c,
      name,
      email,
      phone,
      nationalId,
      photoUrl,
    } : c);

    setCustomers(updated);
    dataStore.saveCustomers(updated);

    setName('');
    setEmail('');
    setPhone('');
    setNationalId('');
    setPhotoUrl('');
    setSelectedCustomer(null);
    setEditModalOpen(false);
  };

  // Filtered Data
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.nationalId || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { header: 'Customer ID', accessor: 'id' },
    { header: 'Customer Name', render: (row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {row.photoUrl ? (
          <img
            src={row.photoUrl}
            alt={row.name}
            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #b87c4c' }}
          />
        ) : (
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#ebd9c8',
              color: '#6e3917',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: '1px solid #d4beaa',
            }}
          >
            {row.name ? row.name.charAt(0).toUpperCase() : <User size={18} />}
          </div>
        )}
        <div>
          <div style={{ fontWeight: typography.fontWeight.semibold, color: '#2c1e16' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#7a6658' }}>{row.nationalId}</div>
        </div>
      </div>
    )},
    { header: 'Email Address', accessor: 'email' },
    { header: 'Phone Number', accessor: 'phone' },
    { header: 'Accounts', render: (row) => <span>{row.accountsCount || 1} Accounts</span> },
    { header: 'Status', render: (row) => (
      <AppBadge variant={row.status === 'Active' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger'}>
        {row.status}
      </AppBadge>
    )},
    { header: 'Actions', render: (row) => (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => navigate(`/customers/${row.id}`)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b87c4c', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem', fontWeight: 600 }}
        >
          <Eye size={15} /> View
        </button>
        <button
          onClick={() => handleOpenEdit(row)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a6658', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem' }}
        >
          <Edit size={15} /> Edit
        </button>
      </div>
    )},
  ];

  return (
    <div>
      {/* Page Title & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            Customer Management
          </h1>
          <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginTop: '0.2rem' }}>
            Manage registered bank customers, account owner profiles, and passport photos
          </div>
        </div>
        <AppButton variant="primary" icon={UserPlus} onClick={() => {
          setName('');
          setEmail('');
          setPhone('');
          setNationalId('');
          setPhotoUrl('');
          setAddModalOpen(true);
        }}>
          Register New Customer
        </AppButton>
      </div>

      {/* Main Customers Table Card */}
      <AppCard>
        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px', maxWidth: '380px' }}>
            <AppInput
              placeholder="Search by customer name, email or CNIC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>

          <div style={{ width: '180px' }}>
            <AppSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Customer Statuses' },
                { value: 'Active', label: 'Active Only' },
                { value: 'Pending', label: 'Pending Approval' },
                { value: 'Inactive', label: 'Inactive / Suspended' },
              ]}
            />
          </div>
        </div>

        <AppTable columns={columns} data={filteredCustomers} />
      </AppCard>

      {/* Register New Customer Modal */}
      <AppModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Register New Customer">
        <form onSubmit={handleAddCustomer}>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem', padding: '1.25rem 1rem', background: '#faf5ee', borderRadius: '12px', border: '1px dashed #d8ba9e' }}>
            {photoUrl ? (
              <div style={{ marginBottom: '0.75rem' }}>
                <img
                  src={photoUrl}
                  alt="Customer Preview"
                  style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #b87c4c', display: 'inline-block', boxShadow: '0 4px 12px rgba(184, 124, 76, 0.25)' }}
                />
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '14px',
                  border: '2px dashed #c4ad98',
                  backgroundColor: '#ffffff',
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginBottom: '0.75rem',
                  color: '#8c5e39',
                  transition: 'all 0.2s ease',
                }}
                title="Click to select photo"
              >
                <Camera size={26} color="#b87c4c" />
                <span style={{ fontSize: '10px', fontWeight: 600, marginTop: '3px', color: '#8c5e39' }}>No Photo</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
              <AppButton type="button" variant="outline" size="sm" icon={Upload} onClick={() => fileInputRef.current?.click()}>
                {photoUrl ? 'Change Photo' : 'Upload Passport/CNIC Photo'}
              </AppButton>
              {photoUrl && (
                <AppButton type="button" variant="secondary" size="sm" icon={Trash2} onClick={() => setPhotoUrl('')}>
                  Remove
                </AppButton>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
            </div>
            <div style={{ fontSize: '11px', color: '#8c7665', marginTop: '0.4rem' }}>
              Optional: Select photo from your computer or phone
            </div>
          </div>

          <AppInput label="Full Name" placeholder="e.g. Muhammad Ali" value={name} onChange={(e) => setName(e.target.value)} required />
          <AppInput label="Email Address" placeholder="e.g. ali@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <AppInput label="Phone Number" placeholder="e.g. 0300-1234567" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <AppInput label="National ID / CNIC" placeholder="e.g. 35201-1234567-1" value={nationalId} onChange={(e) => setNationalId(e.target.value)} />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <AppButton type="button" variant="secondary" onClick={() => setAddModalOpen(false)}>Cancel</AppButton>
            <AppButton type="submit" variant="primary">Create Customer Profile</AppButton>
          </div>
        </form>
      </AppModal>

      {/* Edit Customer Modal */}
      <AppModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Customer Details">
        <form onSubmit={handleUpdateCustomer}>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem', padding: '1.25rem 1rem', background: '#faf5ee', borderRadius: '12px', border: '1px dashed #d8ba9e' }}>
            {photoUrl ? (
              <div style={{ marginBottom: '0.75rem' }}>
                <img
                  src={photoUrl}
                  alt="Customer Preview"
                  style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #b87c4c', display: 'inline-block', boxShadow: '0 4px 12px rgba(184, 124, 76, 0.25)' }}
                />
              </div>
            ) : (
              <div
                onClick={() => editFileInputRef.current?.click()}
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '14px',
                  border: '2px dashed #c4ad98',
                  backgroundColor: '#ffffff',
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginBottom: '0.75rem',
                  color: '#8c5e39',
                  transition: 'all 0.2s ease',
                }}
                title="Click to select photo"
              >
                <Camera size={26} color="#b87c4c" />
                <span style={{ fontSize: '10px', fontWeight: 600, marginTop: '3px', color: '#8c5e39' }}>No Photo</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
              <AppButton type="button" variant="outline" size="sm" icon={Upload} onClick={() => editFileInputRef.current?.click()}>
                {photoUrl ? 'Change Photo' : 'Upload Passport/CNIC Photo'}
              </AppButton>
              {photoUrl && (
                <AppButton type="button" variant="secondary" size="sm" icon={Trash2} onClick={() => setPhotoUrl('')}>
                  Remove
                </AppButton>
              )}
              <input ref={editFileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
            </div>
            <div style={{ fontSize: '11px', color: '#8c7665', marginTop: '0.4rem' }}>
              Select photo from your computer or phone
            </div>
          </div>

          <AppInput label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <AppInput label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <AppInput label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <AppInput label="National ID / CNIC" value={nationalId} onChange={(e) => setNationalId(e.target.value)} />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <AppButton type="button" variant="secondary" onClick={() => setEditModalOpen(false)}>Cancel</AppButton>
            <AppButton type="submit" variant="primary">Save Changes</AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default Customers;
