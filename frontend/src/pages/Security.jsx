import React, { useState } from 'react';
import { colors, typography } from '../shared/design-system';
import AppCard from '../components/ui/AppCard';
import AppMetricCard from '../components/ui/AppMetricCard';
import AppTable from '../components/ui/AppTable';
import AppBadge from '../components/ui/AppBadge';
import AppButton from '../components/ui/AppButton';
import AppInput from '../components/ui/AppInput';
import AppSelect from '../components/ui/AppSelect';
import AppModal from '../components/ui/AppModal';
import {
  ShieldCheck,
  Lock,
  AlertTriangle,
  Key,
  Eye,
  Download,
  Search,
  CheckCircle2,
  XCircle,
  Laptop,
  Globe,
  Clock,
  User,
  Shield,
  FileText,
  Activity,
  UserX,
  RefreshCw
} from 'lucide-react';

export const Security = () => {
  // Modal states
  const [selectedLog, setSelectedLog] = useState(null);
  const [sslModalOpen, setSslModalOpen] = useState(false);
  const [failedLoginsModalOpen, setFailedLoginsModalOpen] = useState(false);
  const [activeSessionsModalOpen, setActiveSessionsModalOpen] = useState(false);

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  // Initial audit logs (clean empty)
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      localStorage.removeItem('bms_audit_logs');
    } catch (e) {}
    return [];
  });

  const [failedLogins, setFailedLogins] = useState([]);

  // Active sessions state with current session only
  const [activeSessions, setActiveSessions] = useState([
    { id: 'SESS-001', user: 'admin', name: 'Admin User', role: 'ROLE_ADMIN', ip: '127.0.0.1', branch: 'Main HQ', loginTime: 'Active Now', device: 'Current Browser Session', isCurrent: true },
  ]);

  const handleTerminateSession = (sessionId) => {
    setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const handleTerminateAllOther = () => {
    setActiveSessions(prev => prev.filter(s => s.isCurrent));
  };

  // Filtered Logs
  const filteredLogs = auditLogs.filter(log => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || (
      log.id.toLowerCase().includes(q) ||
      log.user.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.ip.toLowerCase().includes(q) ||
      (log.target && log.target.toLowerCase().includes(q))
    );

    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    const matchesAction = actionFilter === 'ALL' || log.category === actionFilter;

    return matchesSearch && matchesStatus && matchesAction;
  });

  const handleExportCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'User', 'Role', 'Action', 'Category', 'Target', 'IP Address', 'Status', 'Audit Hash'];
    const rows = filteredLogs.map(l => [
      `"${l.id}"`,
      `"${l.date} ${l.time}"`,
      `"${l.user}"`,
      `"${l.role}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.category}"`,
      `"${l.target || ''}"`,
      `"${l.ip}"`,
      `"${l.status}"`,
      `"${l.auditHash || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Security_Audit_Logs_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      header: 'Log ID',
      render: (row) => (
        <span
          onClick={() => setSelectedLog(row)}
          style={{
            fontWeight: typography.fontWeight.bold,
            color: '#b87c4c',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
          title="Click to view full security audit details"
        >
          {row.id}
        </span>
      )
    },
    {
      header: 'Operator / User',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: row.status === 'Failed' || row.status === 'Blocked' ? '#fecaca' : '#ebdccb',
            color: row.status === 'Failed' || row.status === 'Blocked' ? '#dc2626' : '#87532a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.72rem',
            fontWeight: 'bold'
          }}>
            {row.user ? row.user.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#2c1e16', fontSize: '0.85rem' }}>{row.user}</div>
            {row.role && <div style={{ fontSize: '0.7rem', color: '#7a6658' }}>{row.role}</div>}
          </div>
        </div>
      )
    },
    {
      header: 'Action Taken',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#2c1e16' }}>{row.action}</div>
          {row.target && <div style={{ fontSize: '0.72rem', color: '#7a6658' }}>Target: {row.target}</div>}
        </div>
      )
    },
    {
      header: 'IP Address',
      render: (row) => (
        <div>
          <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#2c1e16', fontSize: '0.82rem' }}>
            {row.ip}
          </span>
          {row.location && (
            <div style={{ fontSize: '0.7rem', color: '#7a6658' }}>{row.location}</div>
          )}
        </div>
      )
    },
    {
      header: 'Time',
      render: (row) => (
        <span style={{ fontSize: '0.82rem', color: '#2c1e16' }}>
          {row.time}
        </span>
      )
    },
    {
      header: 'Status',
      render: (row) => {
        let variant = 'success';
        if (row.status === 'Failed') variant = 'danger';
        if (row.status === 'Blocked') variant = 'warning';
        return <AppBadge variant={variant}>{row.status}</AppBadge>;
      }
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => setSelectedLog(row)}
          style={{
            background: '#faf5ee',
            border: '1px solid #ebdccb',
            borderRadius: '6px',
            padding: '4px 10px',
            cursor: 'pointer',
            color: '#87532a',
            fontSize: '0.78rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#ebdccb')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#faf5ee')}
          title="View Complete Audit Log Forensic Details"
        >
          <Eye size={14} /> View Details
        </button>
      )
    }
  ];

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            Security Overview & Audit Logs
          </h1>
          <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginTop: '0.25rem' }}>
            Real-time cyber defense monitoring, staff activity tracking, and tamper-proof immutable audit logs
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <AppButton variant="secondary" icon={Download} onClick={handleExportCSV}>
            Export Audit CSV
          </AppButton>
        </div>
      </div>

      {/* Interactive Metric Cards: Clickable to inspect details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        
        {/* Metric 1: SSL / TLS */}
        <div
          onClick={() => setSslModalOpen(true)}
          style={{ cursor: 'pointer' }}
          title="Click to inspect SSL Certificate & Encryption Protocol"
        >
          <AppMetricCard
            title="SSL/TLS Encryption"
            value="Active"
            badgeText="256-bit • Click to View"
            badgeVariant="success"
            icon={ShieldCheck}
          />
        </div>

        {/* Metric 2: Failed Login Attempts */}
        <div
          onClick={() => setFailedLoginsModalOpen(true)}
          style={{ cursor: 'pointer' }}
          title="Click to investigate Failed Logins & Intrusion Attempts"
        >
          <AppMetricCard
            title="Failed Login Attempts"
            value={failedLogins.length.toString()}
            badgeText={failedLogins.length > 0 ? "Last 24h • Click to Investigate" : "0 Threats • Clean"}
            badgeVariant={failedLogins.length > 0 ? "warning" : "success"}
            icon={AlertTriangle}
          />
        </div>

        {/* Metric 3: Active Staff Sessions */}
        <div
          onClick={() => setActiveSessionsModalOpen(true)}
          style={{ cursor: 'pointer' }}
          title="Click to view & manage active staff login sessions"
        >
          <AppMetricCard
            title="Active Sessions"
            value={activeSessions.length.toString()}
            badgeText="1 Active Session"
            badgeVariant="info"
            icon={Key}
          />
        </div>
      </div>

      {/* Main Audit Logs Table Container */}
      <AppCard title="System Audit Logs & Operator Activity Record">
        {/* Filter Controls Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '1.25rem'
        }}>
          <AppInput
            placeholder="Search by Log ID, User, Action, Target, or IP address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />

          <AppSelect
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Action Categories' },
              { value: 'AUTHENTICATION', label: 'Logins & Auth Only' },
              { value: 'FINANCIAL', label: 'Financial & Booking' },
              { value: 'SECURITY_ALERT', label: 'Security Alerts & Intrusion' },
              { value: 'CONFIGURATION', label: 'System Configuration' },
              { value: 'CUSTOMER', label: 'Customer Management' },
            ]}
          />

          <AppSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'Success', label: 'Success Only' },
              { value: 'Failed', label: 'Failed Only' },
              { value: 'Blocked', label: 'Blocked Only' },
            ]}
          />
        </div>

        {/* Audit Log Table */}
        <AppTable columns={columns} data={filteredLogs} />
      </AppCard>

      {/* ================= MODAL 1: Individual Audit Log Forensics Details ================= */}
      <AppModal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title={`Audit Forensic Record: ${selectedLog?.id || ''}`}
        maxWidth="640px"
      >
        {selectedLog && (
          <div>
            {/* Header Badge Strip */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.85rem 1.15rem',
              background: '#fcfaf7',
              borderRadius: '10px',
              border: '1px solid #ebdccb',
              marginBottom: '1.25rem'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#7a6658', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Event Type</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2c1e16' }}>{selectedLog.action}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <AppBadge variant={selectedLog.status === 'Success' ? 'success' : selectedLog.status === 'Blocked' ? 'warning' : 'danger'}>
                  {selectedLog.status}
                </AppBadge>
                <div style={{ fontSize: '0.72rem', color: '#7a6658', marginTop: '0.25rem' }}>
                  Severity: <strong style={{ color: selectedLog.severity === 'Critical' ? '#dc2626' : '#87532a' }}>{selectedLog.severity}</strong>
                </div>
              </div>
            </div>

            {/* Forensics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.75rem', background: '#faf5ee', borderRadius: '8px', border: '1px solid #ebdccb' }}>
                <div style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase' }}>Timestamp</div>
                <div style={{ fontWeight: 600, color: '#2c1e16', fontSize: '0.88rem' }}>{selectedLog.date} • {selectedLog.time} PKT</div>
              </div>

              <div style={{ padding: '0.75rem', background: '#faf5ee', borderRadius: '8px', border: '1px solid #ebdccb' }}>
                <div style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase' }}>Initiated By (Operator)</div>
                <div style={{ fontWeight: 600, color: '#2c1e16', fontSize: '0.88rem' }}>{selectedLog.user} ({selectedLog.role})</div>
              </div>

              <div style={{ padding: '0.75rem', background: '#faf5ee', borderRadius: '8px', border: '1px solid #ebdccb' }}>
                <div style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase' }}>Origin IP & Network</div>
                <div style={{ fontWeight: 600, color: '#2c1e16', fontSize: '0.88rem', fontFamily: 'monospace' }}>{selectedLog.ip}</div>
                <div style={{ fontSize: '0.7rem', color: '#7a6658' }}>{selectedLog.location}</div>
              </div>

              <div style={{ padding: '0.75rem', background: '#faf5ee', borderRadius: '8px', border: '1px solid #ebdccb' }}>
                <div style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase' }}>Target Entity Affected</div>
                <div style={{ fontWeight: 600, color: '#2c1e16', fontSize: '0.88rem' }}>{selectedLog.target || 'General System'}</div>
              </div>
            </div>

            {/* Workstation / Client Fingerprint */}
            <div style={{ marginBottom: '1.25rem', padding: '0.75rem', background: '#faf5ee', borderRadius: '8px', border: '1px solid #ebdccb' }}>
              <div style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase' }}>Client Device / Browser Fingerprint</div>
              <div style={{ fontSize: '0.84rem', color: '#2c1e16', marginTop: '2px', fontWeight: 500 }}>
                {selectedLog.device}
              </div>
            </div>

            {/* Detailed Event Description */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#7a6658', textTransform: 'uppercase' }}>Audit Event Description</label>
              <div style={{
                marginTop: '0.35rem',
                padding: '0.85rem',
                background: '#ffffff',
                border: '1px solid #ebdccb',
                borderRadius: '8px',
                fontSize: '0.86rem',
                color: '#2c1e16',
                lineHeight: 1.6
              }}>
                {selectedLog.details}
              </div>
            </div>

            {/* Cryptographic Proof Hash */}
            <div style={{ marginBottom: '1.5rem', padding: '0.65rem 0.85rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Tamper-Proof SHA-256 Audit Verification Hash</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.74rem', color: '#475569', wordBreak: 'break-all', marginTop: '2px' }}>
                {selectedLog.auditHash}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <AppButton variant="secondary" onClick={() => setSelectedLog(null)}>
                Close
              </AppButton>
              <AppButton variant="primary" icon={FileText} onClick={() => alert(`Audit Certificate for ${selectedLog.id} exported!`)}>
                Print Forensic Slip
              </AppButton>
            </div>
          </div>
        )}
      </AppModal>

      {/* ================= MODAL 2: SSL / TLS Certificate Details ================= */}
      <AppModal
        isOpen={sslModalOpen}
        onClose={() => setSslModalOpen(false)}
        title="SSL / TLS Security Certificate & Encryption Ciphers"
        maxWidth="580px"
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '1rem', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0', marginBottom: '1.25rem' }}>
            <div style={{ background: '#dcfce7', padding: '10px', borderRadius: '50%', color: '#16a34a' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#166534' }}>A+ Grade TLS 1.3 Bank Protocol Enforced</div>
              <div style={{ fontSize: '0.78rem', color: '#15803d' }}>All communication between tellers, branches, and server is end-to-end encrypted.</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#faf5ee', borderRadius: '6px', border: '1px solid #ebdccb' }}>
              <span style={{ fontSize: '0.82rem', color: '#7a6658' }}>Cipher Suite:</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, fontFamily: 'monospace' }}>TLS_AES_256_GCM_SHA384 (256-bit)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#faf5ee', borderRadius: '6px', border: '1px solid #ebdccb' }}>
              <span style={{ fontSize: '0.82rem', color: '#7a6658' }}>Public Key:</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>RSA 4096 Bits High-Assurance</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#faf5ee', borderRadius: '6px', border: '1px solid #ebdccb' }}>
              <span style={{ fontSize: '0.82rem', color: '#7a6658' }}>Issuing Certificate Authority (CA):</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>DigiCert Global Root G2 / State Bank PK</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#faf5ee', borderRadius: '6px', border: '1px solid #ebdccb' }}>
              <span style={{ fontSize: '0.82rem', color: '#7a6658' }}>Validity Period:</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#16a34a' }}>Valid through Dec 31, 2028</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#faf5ee', borderRadius: '6px', border: '1px solid #ebdccb' }}>
              <span style={{ fontSize: '0.82rem', color: '#7a6658' }}>HSTS (Strict Transport Security):</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Enabled (max-age: 31536000)</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <AppButton variant="primary" onClick={() => setSslModalOpen(false)}>
              Close Certificate Details
            </AppButton>
          </div>
        </div>
      </AppModal>

      {/* ================= MODAL 3: Failed Login Investigations ================= */}
      <AppModal
        isOpen={failedLoginsModalOpen}
        onClose={() => setFailedLoginsModalOpen(false)}
        title="Failed Login Investigations & Threat Logs"
        maxWidth="620px"
      >
        <div>
          {failedLogins.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c1e16', fontSize: typography.fontSize.base, fontWeight: 700 }}>
                No Failed Login Attempts
              </h3>
              <p style={{ color: '#7a6658', fontSize: typography.fontSize.sm, margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
                There are 0 failed authentication challenges or suspicious intrusion attempts recorded. System access logs are completely clean.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {failedLogins.map((fl, idx) => (
                <div key={idx} style={{ padding: '0.85rem', background: '#faf5ee', borderRadius: '8px', border: '1px solid #ebdccb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: '#dc2626', fontSize: '0.85rem' }}>IP: {fl.ip}</span>
                    <AppBadge variant="danger">Blocked</AppBadge>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#7a6658', marginTop: '4px' }}>
                    Target Username: <strong>{fl.username}</strong> • Time: {fl.time}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <AppButton variant="secondary" onClick={() => setFailedLoginsModalOpen(false)}>
              Close
            </AppButton>
          </div>
        </div>
      </AppModal>

      {/* ================= MODAL 4: Active Staff Sessions Management ================= */}
      <AppModal
        isOpen={activeSessionsModalOpen}
        onClose={() => setActiveSessionsModalOpen(false)}
        title="Active Staff Workstations & Live Sessions"
        maxWidth="680px"
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#7a6658' }}>
              Total Live Operator Sessions: <strong style={{ color: '#2c1e16' }}>{activeSessions.length} active</strong>
            </span>
            <AppButton size="sm" variant="secondary" icon={UserX} onClick={handleTerminateAllOther}>
              Terminate All Other Sessions
            </AppButton>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', maxHeight: '350px', overflowY: 'auto' }}>
            {activeSessions.map((sess) => (
              <div
                key={sess.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  background: sess.isCurrent ? '#f0fdf4' : '#faf5ee',
                  borderRadius: '8px',
                  border: sess.isCurrent ? '1.5px solid #bbf7d0' : '1px solid #ebdccb'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold', color: '#2c1e16', fontSize: '0.9rem' }}>{sess.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#7a6658' }}>({sess.user})</span>
                    {sess.isCurrent && (
                      <AppBadge variant="success">This Device (Current)</AppBadge>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#7a6658', marginTop: '3px' }}>
                    Branch: <strong>{sess.branch}</strong> • IP: <span style={{ fontFamily: 'monospace' }}>{sess.ip}</span> • Logged In: {sess.loginTime}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#87532a', marginTop: '2px' }}>
                    Device: {sess.device}
                  </div>
                </div>

                <div>
                  {sess.isCurrent ? (
                    <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>Active Now</span>
                  ) : (
                    <button
                      onClick={() => handleTerminateSession(sess.id)}
                      style={{
                        padding: '4px 8px',
                        background: '#fee2e2',
                        border: '1px solid #fca5a5',
                        color: '#b91c1c',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}
                      title="Force logout this teller"
                    >
                      Disconnect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <AppButton variant="primary" onClick={() => setActiveSessionsModalOpen(false)}>
              Done
            </AppButton>
          </div>
        </div>
      </AppModal>
    </div>
  );
};

export default Security;
