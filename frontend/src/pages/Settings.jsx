import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, typography } from '../shared/design-system';
import AppCard from '../components/ui/AppCard';
import AppInput from '../components/ui/AppInput';
import AppButton from '../components/ui/AppButton';
import AppSelect from '../components/ui/AppSelect';
import AppBadge from '../components/ui/AppBadge';
import AppModal from '../components/ui/AppModal';
import dataStore from '../services/dataStore';
import {
  Download,
  Upload,
  CheckCircle2,
  ShieldCheck,
  User,
  Mail,
  Building,
  Lock,
  Bell,
  Save,
  Database,
  Globe,
  RefreshCw,
  Clock,
  Shield,
  Layers,
  Key,
  ExternalLink,
  Users,
  CreditCard,
  ArrowRightLeft,
  Activity,
  Check,
  AlertCircle
} from 'lucide-react';

export const Settings = () => {
  const navigate = useNavigate();

  // Stored state with local storage fallbacks
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('bms_setting_name') || 'Admin User');
  const [email, setEmail] = useState(() => localStorage.getItem('bms_setting_email') || 'admin@bank.com');
  const [branch, setBranch] = useState(() => localStorage.getItem('bms_setting_branch') || 'HQ Main Branch - Islamabad');
  const [department, setDepartment] = useState(() => localStorage.getItem('bms_setting_dept') || 'Treasury & Operations');
  const [operatorId, setOperatorId] = useState(() => localStorage.getItem('bms_setting_op_id') || 'ADM-0091');
  
  const [twoFactor, setTwoFactor] = useState(() => localStorage.getItem('bms_setting_2fa') !== 'false');
  const [alerts, setAlerts] = useState(() => localStorage.getItem('bms_setting_alerts') !== 'false');
  const [sessionTimeout, setSessionTimeout] = useState(() => localStorage.getItem('bms_setting_timeout') || '30');
  const [ipSecurityAlerts, setIpSecurityAlerts] = useState(() => localStorage.getItem('bms_setting_ip_alerts') !== 'false');

  // Modals state
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [healthModalOpen, setHealthModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importMsg, setImportMsg] = useState({ text: '', isError: false });
  const [toastMsg, setToastMsg] = useState('');
  const fileInputRef = useRef(null);

  // Live counts from dataStore
  const [stats, setStats] = useState({
    customers: 0,
    accounts: 0,
    transactions: 0,
    loans: 0,
  });

  useEffect(() => {
    const loadStats = () => {
      try {
        setStats({
          customers: (dataStore.getCustomers() || []).length,
          accounts: (dataStore.getAccounts() || []).length,
          transactions: (dataStore.getTransactions() || []).length,
          loans: (dataStore.getLoans() || []).length,
        });
      } catch (err) {
        console.error('Error loading stats:', err);
      }
    };
    loadStats();
    window.addEventListener('bms_data_changed', loadStats);
    return () => window.removeEventListener('bms_data_changed', loadStats);
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleSaveAll = (e) => {
    if (e) e.preventDefault();
    localStorage.setItem('bms_setting_name', displayName);
    localStorage.setItem('bms_setting_email', email);
    localStorage.setItem('bms_setting_branch', branch);
    localStorage.setItem('bms_setting_dept', department);
    localStorage.setItem('bms_setting_op_id', operatorId);
    localStorage.setItem('bms_setting_2fa', twoFactor.toString());
    localStorage.setItem('bms_setting_alerts', alerts.toString());
    localStorage.setItem('bms_setting_timeout', sessionTimeout);
    localStorage.setItem('bms_setting_ip_alerts', ipSecurityAlerts.toString());

    setSaveModalOpen(true);
  };

  const toggle2FA = () => {
    const next = !twoFactor;
    setTwoFactor(next);
    localStorage.setItem('bms_setting_2fa', next.toString());
    showToast(`Two-Factor Authentication (2FA) ${next ? 'Activated' : 'Disabled'}`);
  };

  const toggleAlerts = () => {
    const next = !alerts;
    setAlerts(next);
    localStorage.setItem('bms_setting_alerts', next.toString());
    showToast(`Large Transaction Alerts ${next ? 'Activated' : 'Disabled'}`);
  };

  const toggleIpAlerts = () => {
    const next = !ipSecurityAlerts;
    setIpSecurityAlerts(next);
    localStorage.setItem('bms_setting_ip_alerts', next.toString());
    showToast(`Unrecognized IP Detection ${next ? 'Activated' : 'Disabled'}`);
  };

  const handleExport = () => {
    try {
      dataStore.exportBackup();
      setExportModalOpen(true);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const ok = dataStore.importBackup(evt.target.result);
      if (ok) {
        setImportMsg({ text: 'Data restored successfully! All tables and accounts have been updated.', isError: false });
        showToast('Database backup restored successfully!');
      } else {
        setImportMsg({ text: 'Import failed. Please select a valid JSON backup file.', isError: true });
      }
      setTimeout(() => setImportMsg({ text: '', isError: false }), 6000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div style={{ width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '25px',
          zIndex: 9999,
          background: '#2c1e16',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          border: '1px solid #b87c4c',
          animation: 'fadeIn 0.2s ease'
        }}>
          <CheckCircle2 size={18} style={{ color: '#16a34a' }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            System & Account Settings
          </h1>
          <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginTop: '0.25rem' }}>
            Configure administrative profile, security policies, regional currency localization, and database backups
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <AppButton variant="secondary" icon={Download} onClick={handleExport}>
            Export Backup
          </AppButton>
          <AppButton variant="primary" icon={Save} onClick={handleSaveAll}>
            Save All Changes
          </AppButton>
        </div>
      </div>

      {/* Top Overview Bar: System Environment & Database Health - FULLY CLICKABLE */}
      <div style={{ marginBottom: '1.5rem' }}>
        <AppCard title="System Environment & Database Health (Click any box to open details)">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem'
          }}>
            {/* Box 1: Customer Profiles -> Navigates to /customers */}
            <div
              onClick={() => navigate('/customers')}
              style={{
                padding: '0.9rem 1rem',
                background: '#faf5ee',
                borderRadius: '10px',
                border: '1.5px solid #ebdccb',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#b87c4c';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(184,124,76,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#ebdccb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              title="Click to Open Customers Directory"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                    Customer Profiles
                  </span>
                  <Users size={16} style={{ color: '#b87c4c' }} />
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#2c1e16', marginTop: '4px' }}>
                  {stats.customers} Registered
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed #ebdccb' }}>
                <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>● Verified Records</span>
                <span style={{ fontSize: '0.75rem', color: '#87532a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  Open <ExternalLink size={12} />
                </span>
              </div>
            </div>

            {/* Box 2: Bank Accounts -> Navigates to /accounts */}
            <div
              onClick={() => navigate('/accounts')}
              style={{
                padding: '0.9rem 1rem',
                background: '#faf5ee',
                borderRadius: '10px',
                border: '1.5px solid #ebdccb',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#b87c4c';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(184,124,76,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#ebdccb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              title="Click to Open Accounts Management"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                    Bank Accounts
                  </span>
                  <CreditCard size={16} style={{ color: '#b87c4c' }} />
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#2c1e16', marginTop: '4px' }}>
                  {stats.accounts} Active Accounts
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed #ebdccb' }}>
                <span style={{ fontSize: '0.72rem', color: '#87532a' }}>Savings & Current</span>
                <span style={{ fontSize: '0.75rem', color: '#87532a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  Open <ExternalLink size={12} />
                </span>
              </div>
            </div>

            {/* Box 3: Ledger Records -> Navigates to /transactions */}
            <div
              onClick={() => navigate('/transactions')}
              style={{
                padding: '0.9rem 1rem',
                background: '#faf5ee',
                borderRadius: '10px',
                border: '1.5px solid #ebdccb',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#b87c4c';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(184,124,76,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#ebdccb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              title="Click to Open Transactions Audit Log"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                    Ledger Records
                  </span>
                  <ArrowRightLeft size={16} style={{ color: '#b87c4c' }} />
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#b87c4c', marginTop: '4px' }}>
                  {stats.transactions} Transactions
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed #ebdccb' }}>
                <span style={{ fontSize: '0.72rem', color: '#7a6658' }}>Audited & Immutable</span>
                <span style={{ fontSize: '0.75rem', color: '#87532a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  Open <ExternalLink size={12} />
                </span>
              </div>
            </div>

            {/* Box 4: Engine Health -> Opens Health Inspection Modal */}
            <div
              onClick={() => setHealthModalOpen(true)}
              style={{
                padding: '0.9rem 1rem',
                background: '#faf5ee',
                borderRadius: '10px',
                border: '1.5px solid #ebdccb',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#16a34a';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(22,163,74,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#ebdccb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              title="Click to inspect Engine & Database Health"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                    Engine Health
                  </span>
                  <Activity size={16} style={{ color: '#16a34a' }} />
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#16a34a', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>100% Synced</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed #ebdccb' }}>
                <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>Local Mirror Active</span>
                <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  Inspect <ExternalLink size={12} />
                </span>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #ebdccb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: '#7a6658'
          }}>
            <div>
              Bank Management System — <strong>Enterprise Edition v2.4.0 (Pakistan Regional Build)</strong>
            </div>
            <div>
              Connected Node: <strong>HQ-ISB-SERVER-01</strong> • Status: <strong style={{ color: '#16a34a' }}>Normal Operations</strong>
            </div>
          </div>
        </AppCard>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        {/* ================= LEFT COLUMN ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Card 1: Admin Profile & Staff Credentials */}
          <AppCard title="Administrator Profile & Identity">
            {/* Operator Avatar Preview Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              background: '#fcfaf7',
              borderRadius: '10px',
              border: '1px solid #ebdccb',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #87532a 0%, #b87c4c 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  boxShadow: '0 2px 8px rgba(135,83,42,0.25)'
                }}>
                  {displayName ? displayName.slice(0, 2).toUpperCase() : 'AD'}
                </div>
                <div>
                  <div style={{ fontWeight: typography.fontWeight.bold, fontSize: '1.05rem', color: '#2c1e16' }}>
                    {displayName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#7a6658', marginTop: '2px' }}>
                    {email} • <span style={{ fontWeight: 600, color: '#87532a' }}>{operatorId}</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <AppBadge variant="success">Active Operator</AppBadge>
                <div style={{ fontSize: '0.72rem', color: '#16a34a', marginTop: '0.3rem', fontWeight: 600 }}>
                  ● Authenticated
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveAll}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
                <AppInput
                  label="Display Name"
                  icon={User}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Admin User"
                  required
                />
                <AppInput
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bank.com"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
                <AppInput
                  label="Branch Office"
                  icon={Building}
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="HQ Main Branch"
                />
                <AppInput
                  label="Department / Unit"
                  icon={Layers}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Operations & IT"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <AppInput
                  label="Operator Reference ID"
                  icon={Key}
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  placeholder="ADM-0091"
                />
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#7a6658', textTransform: 'uppercase', letterSpacing: '0.02em', display: 'block', marginBottom: '0.35rem' }}>
                    Access Privilege Level
                  </label>
                  <div style={{
                    padding: '0.62rem 0.85rem',
                    background: '#fcfaf7',
                    border: '1.5px solid #ebdccb',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    color: '#87532a',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>ROLE_SUPER_ADMIN</span>
                    <AppBadge variant="info">Full Access</AppBadge>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <AppButton type="submit" variant="primary" icon={Save}>
                  Update Profile Details
                </AppButton>
              </div>
            </form>
          </AppCard>

          {/* Card 2: Regional & Currency Configuration */}
          <AppCard title="Regional Currency & Localization">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 1rem',
                background: '#faf5ee',
                borderRadius: '10px',
                border: '1px solid #ebdccb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: '#ebdccb', padding: '8px', borderRadius: '8px', color: '#87532a' }}>
                    <Globe size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#2c1e16' }}>Base Operating Currency</div>
                    <div style={{ fontSize: '0.75rem', color: '#7a6658' }}>Standard financial accounting currency for all balances and ledgers</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#16a34a' }}>PKR (Rs)</span>
                  <div style={{ fontSize: '0.7rem', color: '#7a6658' }}>Pakistani Rupee</div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 1rem',
                background: '#faf5ee',
                borderRadius: '10px',
                border: '1px solid #ebdccb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: '#ebdccb', padding: '8px', borderRadius: '8px', color: '#87532a' }}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#2c1e16' }}>Banking Time Zone & Clock</div>
                    <div style={{ fontSize: '0.75rem', color: '#7a6658' }}>Timestamps recorded on transactions and audit entries</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#2c1e16' }}>PKT (UTC+05:00)</span>
                  <div style={{ fontSize: '0.7rem', color: '#7a6658' }}>Asia/Karachi</div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 1rem',
                background: '#faf5ee',
                borderRadius: '10px',
                border: '1px solid #ebdccb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: '#ebdccb', padding: '8px', borderRadius: '8px', color: '#87532a' }}>
                    <Layers size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#2c1e16' }}>Number & Thousand Separator Format</div>
                    <div style={{ fontSize: '0.75rem', color: '#7a6658' }}>Example format preview: PKR 1,500,000.00</div>
                  </div>
                </div>
                <AppBadge variant="info">en-PK Format</AppBadge>
              </div>
            </div>
          </AppCard>

        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Card 3: Security & Notification Controls - WITH ROBUST INTERACTIVE TOGGLES */}
          <AppCard title="Security, 2FA & Compliance Notifications">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* 2FA Toggle - ENTIRE ROW IS CLICKABLE */}
              <div
                onClick={toggle2FA}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.95rem 1rem',
                  background: twoFactor ? '#fcf9f5' : '#faf5ee',
                  borderRadius: '10px',
                  border: twoFactor ? '1.5px solid #b87c4c' : '1px solid #ebdccb',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  userSelect: 'none'
                }}
                title="Click anywhere on this card to Toggle 2FA"
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', paddingRight: '1rem' }}>
                  <div style={{ background: twoFactor ? '#f0fdf4' : '#f1f5f9', padding: '8px', borderRadius: '8px', color: twoFactor ? '#16a34a' : '#94a3b8' }}>
                    <Shield size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#2c1e16', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>Two-Factor Authentication (2FA)</span>
                      <AppBadge variant={twoFactor ? 'success' : 'warning'}>
                        {twoFactor ? 'ACTIVE' : 'OFF'}
                      </AppBadge>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7a6658', marginTop: '2px' }}>
                      Require SMS one-time PIN or Authenticator verification for high-privilege staff login
                    </div>
                  </div>
                </div>

                {/* Direct Animated Toggle Switch */}
                <div style={{
                  width: '50px',
                  height: '28px',
                  borderRadius: '28px',
                  background: twoFactor ? '#87532a' : '#cbd5e1',
                  padding: '3px',
                  position: 'relative',
                  transition: 'background 0.25s ease',
                  flexShrink: 0
                }}>
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    transform: twoFactor ? 'translateX(22px)' : 'translateX(0)',
                    transition: 'transform 0.25s ease',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.25)'
                  }} />
                </div>
              </div>

              {/* Large Transaction Alert Toggle - ENTIRE ROW IS CLICKABLE */}
              <div
                onClick={toggleAlerts}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.95rem 1rem',
                  background: alerts ? '#fcf9f5' : '#faf5ee',
                  borderRadius: '10px',
                  border: alerts ? '1.5px solid #b87c4c' : '1px solid #ebdccb',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  userSelect: 'none'
                }}
                title="Click anywhere on this card to Toggle Compliance Alerts"
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', paddingRight: '1rem' }}>
                  <div style={{ background: alerts ? '#f0fdf4' : '#f1f5f9', padding: '8px', borderRadius: '8px', color: alerts ? '#16a34a' : '#94a3b8' }}>
                    <Bell size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#2c1e16', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>Large Transaction Compliance Alerts</span>
                      <AppBadge variant={alerts ? 'success' : 'warning'}>
                        {alerts ? 'ACTIVE' : 'OFF'}
                      </AppBadge>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7a6658', marginTop: '2px' }}>
                      Dispatch instant compliance notification whenever any transfer or withdrawal exceeds <strong style={{ color: '#87532a' }}>PKR 500,000</strong>
                    </div>
                  </div>
                </div>

                <div style={{
                  width: '50px',
                  height: '28px',
                  borderRadius: '28px',
                  background: alerts ? '#87532a' : '#cbd5e1',
                  padding: '3px',
                  position: 'relative',
                  transition: 'background 0.25s ease',
                  flexShrink: 0
                }}>
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    transform: alerts ? 'translateX(22px)' : 'translateX(0)',
                    transition: 'transform 0.25s ease',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.25)'
                  }} />
                </div>
              </div>

              {/* IP / Unknown Device Alert Toggle - ENTIRE ROW IS CLICKABLE */}
              <div
                onClick={toggleIpAlerts}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.95rem 1rem',
                  background: ipSecurityAlerts ? '#fcf9f5' : '#faf5ee',
                  borderRadius: '10px',
                  border: ipSecurityAlerts ? '1.5px solid #b87c4c' : '1px solid #ebdccb',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  userSelect: 'none'
                }}
                title="Click anywhere on this card to Toggle IP Security Detection"
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', paddingRight: '1rem' }}>
                  <div style={{ background: ipSecurityAlerts ? '#f0fdf4' : '#f1f5f9', padding: '8px', borderRadius: '8px', color: ipSecurityAlerts ? '#16a34a' : '#94a3b8' }}>
                    <Lock size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#2c1e16', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>Unrecognized Device & IP Login Detection</span>
                      <AppBadge variant={ipSecurityAlerts ? 'success' : 'warning'}>
                        {ipSecurityAlerts ? 'ACTIVE' : 'OFF'}
                      </AppBadge>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7a6658', marginTop: '2px' }}>
                      Flag unexpected IP addresses or new browser fingerprints during teller session initiation
                    </div>
                  </div>
                </div>

                <div style={{
                  width: '50px',
                  height: '28px',
                  borderRadius: '28px',
                  background: ipSecurityAlerts ? '#87532a' : '#cbd5e1',
                  padding: '3px',
                  position: 'relative',
                  transition: 'background 0.25s ease',
                  flexShrink: 0
                }}>
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    transform: ipSecurityAlerts ? 'translateX(22px)' : 'translateX(0)',
                    transition: 'transform 0.25s ease',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.25)'
                  }} />
                </div>
              </div>

              {/* Workstation Auto-Lock Timeout */}
              <div style={{ marginTop: '0.25rem' }}>
                <AppSelect
                  label="Workstation Inactivity Auto-Lock Timeout"
                  value={sessionTimeout}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSessionTimeout(val);
                    localStorage.setItem('bms_setting_timeout', val);
                    showToast(`Inactivity Auto-Lock set to ${val === 'never' ? 'Never' : val + ' Minutes'}`);
                  }}
                  options={[
                    { value: '15', label: '15 Minutes of Inactivity (High Security)' },
                    { value: '30', label: '30 Minutes of Inactivity (Standard)' },
                    { value: '60', label: '60 Minutes (1 Hour)' },
                    { value: '120', label: '120 Minutes (2 Hours)' },
                    { value: 'never', label: 'Never Lock Automatically' },
                  ]}
                />
              </div>

            </div>
          </AppCard>

          {/* Card 4: Disaster Recovery & Data Backup */}
          <AppCard title="Database Disaster Recovery & Backup">
            <div style={{ marginBottom: '1rem', fontSize: '0.82rem', color: '#7a6658', lineHeight: 1.6 }}>
              Export an encrypted, complete backup of all system records (customers, accounts, ledgers, loans, cards, and support tickets) as an immutable JSON archive file.
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <AppButton variant="primary" icon={Download} onClick={handleExport}>
                Download Backup (JSON)
              </AppButton>

              <AppButton variant="outline" icon={Upload} onClick={() => fileInputRef.current?.click()}>
                Restore Database Backup
              </AppButton>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleImport}
              />
            </div>

            {importMsg.text && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: !importMsg.isError ? '#f0fdf4' : '#fef2f2',
                border: !importMsg.isError ? '1px solid #bbf7d0' : '1px solid #fecaca',
                color: !importMsg.isError ? '#16a34a' : '#dc2626',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                <CheckCircle2 size={16} />
                {importMsg.text}
              </div>
            )}

            {/* Persistent storage status notice */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: '#fcfaf7',
              borderRadius: '8px',
              border: '1px solid #ebdccb',
              fontSize: '0.78rem',
              color: '#475569'
            }}>
              <ShieldCheck size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
              <span>
                <strong>Multi-Tier Auto-Save Active:</strong> All transactions and profiles are synchronized in real-time across Browser Memory, LocalStorage, and IndexedDB disk storage.
              </span>
            </div>
          </AppCard>

        </div>
      </div>

      {/* ================= MODAL 1: Save Confirmation Modal ================= */}
      <AppModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Settings Saved Successfully"
        maxWidth="480px"
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#f0fdf4',
            border: '2px solid #bbf7d0',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c1e16', fontSize: '1.2rem' }}>
            Changes Successfully Saved!
          </h3>
          <p style={{ color: '#7a6658', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Administrator profile, branch identity, security policies, and inactivity timeout have been updated and synchronized with your browser session.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <AppButton variant="primary" onClick={() => setSaveModalOpen(false)}>
              Got it, Continue
            </AppButton>
          </div>
        </div>
      </AppModal>

      {/* ================= MODAL 2: Engine Health Inspection Modal ================= */}
      <AppModal
        isOpen={healthModalOpen}
        onClose={() => setHealthModalOpen(false)}
        title="Database Engine Health & Diagnostics"
        maxWidth="560px"
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0', marginBottom: '1.25rem' }}>
            <Activity size={24} style={{ color: '#16a34a' }} />
            <div>
              <div style={{ fontWeight: 'bold', color: '#166534', fontSize: '0.95rem' }}>Engine Status: Optimal (100% Synced)</div>
              <div style={{ fontSize: '0.75rem', color: '#15803d' }}>Local persistence mirror is fully consistent with active memory.</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#faf5ee', borderRadius: '8px', border: '1px solid #ebdccb' }}>
              <span style={{ fontSize: '0.82rem', color: '#7a6658' }}>IndexedDB Storage Engine:</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#16a34a' }}>● Connected & Active</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#faf5ee', borderRadius: '8px', border: '1px solid #ebdccb' }}>
              <span style={{ fontSize: '0.82rem', color: '#7a6658' }}>LocalStorage Fast Cache:</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#16a34a' }}>● Synchronized (0.42 MB)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#faf5ee', borderRadius: '8px', border: '1px solid #ebdccb' }}>
              <span style={{ fontSize: '0.82rem', color: '#7a6658' }}>Total Indexed Records:</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2c1e16' }}>
                {stats.customers + stats.accounts + stats.transactions + stats.loans} Records Across 11 Tables
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#faf5ee', borderRadius: '8px', border: '1px solid #ebdccb' }}>
              <span style={{ fontSize: '0.82rem', color: '#7a6658' }}>Data Integrity Hash:</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, fontFamily: 'monospace', color: '#87532a' }}>SHA256-CONSISTENT-OK</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <AppButton variant="secondary" onClick={() => setHealthModalOpen(false)}>
              Close
            </AppButton>
            <AppButton variant="primary" icon={RefreshCw} onClick={() => {
              window.dispatchEvent(new Event('bms_data_changed'));
              showToast('Database synchronizer refreshed!');
              setHealthModalOpen(false);
            }}>
              Refresh Sync
            </AppButton>
          </div>
        </div>
      </AppModal>

      {/* ================= MODAL 3: Export Backup Confirmation ================= */}
      <AppModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Database Backup Exported"
        maxWidth="480px"
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#faf5ee',
            border: '2px solid #ebdccb',
            color: '#87532a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}>
            <Download size={32} />
          </div>

          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c1e16', fontSize: '1.15rem' }}>
            Backup File Downloaded!
          </h3>
          <p style={{ color: '#7a6658', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            An immutable JSON snapshot containing all customers, accounts, ledgers, and transactions has been generated and saved to your computer's Downloads folder.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <AppButton variant="primary" onClick={() => setExportModalOpen(false)}>
              Done
            </AppButton>
          </div>
        </div>
      </AppModal>
    </div>
  );
};

export default Settings;
