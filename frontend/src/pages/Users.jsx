import React, { useState } from 'react';
import { colors, typography } from '../shared/design-system';
import AppCard from '../components/ui/AppCard';
import AppTable from '../components/ui/AppTable';
import AppBadge from '../components/ui/AppBadge';
import AppButton from '../components/ui/AppButton';
import AppInput from '../components/ui/AppInput';
import AppSelect from '../components/ui/AppSelect';
import AppModal from '../components/ui/AppModal';
import { Shield, UserPlus, KeyRound } from 'lucide-react';
import dataStore from '../services/dataStore';

export const Users = () => {
  const [users, setUsers] = useState(() => dataStore.getUsers());

  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ROLE_EMPLOYEE');
  const [password, setPassword] = useState('');

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!username || !email) return;

    const newUser = {
      id: users.length + 1,
      username,
      email,
      role,
      status: 'Enabled',
    };

    const updated = [newUser, ...users];
    setUsers(updated);
    dataStore.saveUsers(updated);

    setUsername('');
    setEmail('');
    setRole('ROLE_EMPLOYEE');
    setPassword('');
    setModalOpen(false);
  };

  const handleResetPassword = (user) => {
    alert(`Password reset link sent to ${user.email} (${user.username})!`);
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Username', render: (row) => <span style={{ fontWeight: typography.fontWeight.semibold }}>{row.username}</span> },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', render: (row) => (
      <AppBadge variant={row.role === 'ROLE_ADMIN' ? 'danger' : row.role === 'ROLE_EMPLOYEE' ? 'info' : 'success'}>
        {row.role}
      </AppBadge>
    )},
    { header: 'Status', render: (row) => <AppBadge variant="success">{row.status}</AppBadge> },
    { header: 'Actions', render: (row) => (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => handleResetPassword(row)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.primary }}>
          <KeyRound size={16} /> Reset
        </button>
      </div>
    )},
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            Admin / User Management
          </h1>
          <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginTop: '0.2rem' }}>
            System user accounts and Role-Based Access Control (RBAC) permissions
          </div>
        </div>
        <AppButton variant="primary" icon={UserPlus} onClick={() => setModalOpen(true)}>Create New User</AppButton>
      </div>

      <AppCard>
        <AppTable columns={columns} data={users} />
      </AppCard>

      {/* Create User Modal */}
      <AppModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create System User Account">
        <form onSubmit={handleCreateUser}>
          <AppInput label="Username" placeholder="e.g. emp_marcus" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <AppInput label="Email Address" type="email" placeholder="e.g. marcus@bank.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <AppSelect
            label="User Role (RBAC)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: 'ROLE_ADMIN', label: 'Administrator (Full Access)' },
              { value: 'ROLE_EMPLOYEE', label: 'Bank Employee / Teller' },
              { value: 'ROLE_CUSTOMER', label: 'Bank Customer' },
            ]}
          />
          <AppInput label="Initial Password" type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <AppButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AppButton>
            <AppButton type="submit" variant="primary">Create User Account</AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default Users;


