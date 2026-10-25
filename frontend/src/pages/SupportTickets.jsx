import React, { useState } from 'react';
import { colors, typography } from '../shared/design-system';
import AppCard from '../components/ui/AppCard';
import AppTable from '../components/ui/AppTable';
import AppBadge from '../components/ui/AppBadge';
import AppButton from '../components/ui/AppButton';
import AppModal from '../components/ui/AppModal';
import AppInput from '../components/ui/AppInput';
import AppSelect from '../components/ui/AppSelect';
import AppSearchableSelect from '../components/ui/AppSearchableSelect';
import { HelpCircle, PlusCircle, MessageSquare, CheckCircle, Clock, AlertTriangle, User, Calendar, Tag, ShieldAlert } from 'lucide-react';
import dataStore from '../services/dataStore';

export const SupportTickets = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Dynamic Customers & Accounts list from dataStore
  const customersList = dataStore.getCustomers();
  const allAccounts = dataStore.getAccounts();
  const customerOptions = customersList.map(c => {
    const accs = allAccounts.filter(a => a.customerName && c.name && a.customerName.toLowerCase().includes(c.name.toLowerCase()));
    const accStr = accs.map(a => a.accountNumber).join(', ');
    return {
      value: c.name,
      label: `${c.name} (${c.email || c.phone || 'Customer'})`,
      sublabel: accStr ? `Linked Account: ${accStr}` : (c.nationalId ? `ID: ${c.nationalId}` : ''),
    };
  });

  const [customerName, setCustomerName] = useState(customersList[0]?.name || 'Ali Khan');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Transaction Inquiry');
  const [priority, setPriority] = useState('HIGH');
  const [description, setDescription] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const [ticketsData, setTicketsData] = useState(() => dataStore.getTickets());

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!subject) return;

    const newTicket = {
      number: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: customerName || 'Customer',
      category,
      priority,
      subject,
      description: description || 'No additional details provided.',
      status: 'OPEN',
      date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
    };

    const updated = [newTicket, ...ticketsData];
    setTicketsData(updated);
    dataStore.saveTickets(updated);

    // Reset Form
    setSubject('');
    setDescription('');
    setModalOpen(false);
  };

  const handleUpdateStatus = (ticketNumber, newStatus) => {
    const updated = ticketsData.map(t => {
      if (t.number === ticketNumber) {
        return {
          ...t,
          status: newStatus,
          resolution: resolutionNotes || t.resolution || (newStatus === 'RESOLVED' ? 'Issue verified and resolved by support staff.' : '')
        };
      }
      return t;
    });

    setTicketsData(updated);
    dataStore.saveTickets(updated);

    if (selectedTicket && selectedTicket.number === ticketNumber) {
      setSelectedTicket({
        ...selectedTicket,
        status: newStatus,
        resolution: resolutionNotes || selectedTicket.resolution || ''
      });
    }
  };

  // Quick stats
  const totalTickets = ticketsData.length;
  const openTickets = ticketsData.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const resolvedTickets = ticketsData.filter(t => t.status === 'RESOLVED').length;

  const columns = [
    { header: 'Ticket #', render: (row) => (
      <span style={{ fontWeight: typography.fontWeight.semibold, color: colors.primary }}>
        {row.number}
      </span>
    )},
    { header: 'Customer', accessor: 'customer' },
    { header: 'Category', accessor: 'category' },
    { header: 'Priority', render: (row) => (
      <AppBadge variant={row.priority === 'HIGH' ? 'danger' : row.priority === 'MEDIUM' ? 'warning' : 'neutral'}>
        {row.priority}
      </AppBadge>
    )},
    { header: 'Subject', accessor: 'subject' },
    { header: 'Status', render: (row) => (
      <AppBadge variant={row.status === 'OPEN' ? 'warning' : row.status === 'IN_PROGRESS' ? 'info' : 'success'}>
        {row.status}
      </AppBadge>
    )},
    { header: 'Actions', render: (row) => (
      <AppButton
        size="sm"
        variant="ghost"
        icon={MessageSquare}
        onClick={() => {
          setSelectedTicket(row);
          setResolutionNotes(row.resolution || '');
          setViewModalOpen(true);
        }}
      >
        View
      </AppButton>
    )},
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            Customer Service & Support Tickets
          </h1>
          <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginTop: '0.2rem' }}>
            Customer grievance redressal, dispute management, technical issues, and inquiry tracking
          </div>
        </div>
        <AppButton variant="primary" icon={PlusCircle} onClick={() => setModalOpen(true)}>Create Ticket</AppButton>
      </div>

      {/* KPI Stats Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#ffffff', border: '1px solid #ebdccb', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#f5efe6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HelpCircle size={22} color="#87532a" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#7a6658', textTransform: 'uppercase' }}>Total Tickets</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#2c1e16' }}>{totalTickets}</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #fed7aa', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} color="#ea580c" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#7a6658', textTransform: 'uppercase' }}>Open / In Progress</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ea580c' }}>{openTickets}</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={22} color="#16a34a" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#7a6658', textTransform: 'uppercase' }}>Resolved Tickets</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#16a34a' }}>{resolvedTickets}</div>
          </div>
        </div>
      </div>

      <AppCard title="Support Requests Queue">
        <AppTable columns={columns} data={ticketsData} />
      </AppCard>

      {/* Modal for Creating New Ticket */}
      <AppModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Customer Support Ticket">
        <form onSubmit={handleCreateTicket}>
          <AppSearchableSelect
            label="Customer"
            placeholder="Search by customer name, account number, or email..."
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            options={customerOptions}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AppSelect
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'Transaction Inquiry', label: 'Transaction Inquiry' },
                { value: 'Account Inquiry', label: 'Account Inquiry' },
                { value: 'Card Issue', label: 'Card Issue' },
                { value: 'Technical Support', label: 'Technical Support' },
                { value: 'Loan Inquiry', label: 'Loan Inquiry' },
              ]}
            />

            <AppSelect
              label="Priority Level"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={[
                { value: 'HIGH', label: 'HIGH (Urgent / Fraud / Payment)' },
                { value: 'MEDIUM', label: 'MEDIUM (Limit / Settings)' },
                { value: 'LOW', label: 'LOW (General Inquiry)' },
              ]}
            />
          </div>

          <AppInput
            label="Subject / Brief Summary"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Unrecognized charge, ATM cash not dispensed, App login issue"
            required
          />

          <AppInput
            label="Detailed Problem Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the customer's grievance, affected account or transaction reference..."
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <AppButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AppButton>
            <AppButton type="submit" variant="primary">Submit Ticket</AppButton>
          </div>
        </form>
      </AppModal>

      {/* Modal for Viewing & Updating Ticket Details */}
      {selectedTicket && (
        <AppModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Support Ticket Details (${selectedTicket.number})`}
        >
          <div style={{ padding: '0.5rem 0' }}>
            {/* Header Strip */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#fcfaf7',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #ebdccb',
              marginBottom: '1.25rem'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#7a6658', textTransform: 'uppercase' }}>Customer</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#2c1e16' }}>{selectedTicket.customer}</div>
                <div style={{ fontSize: '0.8rem', color: '#7a6658', marginTop: '0.15rem' }}>Date Filed: {selectedTicket.date || 'Recent'}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <AppBadge variant={selectedTicket.priority === 'HIGH' ? 'danger' : selectedTicket.priority === 'MEDIUM' ? 'warning' : 'neutral'}>
                  {selectedTicket.priority} PRIORITY
                </AppBadge>
                <AppBadge variant={selectedTicket.status === 'OPEN' ? 'warning' : selectedTicket.status === 'IN_PROGRESS' ? 'info' : 'success'}>
                  {selectedTicket.status}
                </AppBadge>
              </div>
            </div>

            {/* Subject and Description */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#7a6658', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Subject</div>
              <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#1f2937', marginBottom: '0.75rem' }}>
                {selectedTicket.subject}
              </div>

              <div style={{ fontSize: '0.75rem', color: '#7a6658', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Issue Description</div>
              <div style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                fontSize: '0.9rem',
                color: '#374151',
                lineHeight: '1.5'
              }}>
                {selectedTicket.description || selectedTicket.subject}
              </div>
            </div>

            {/* Resolution Notes Section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#7a6658', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Staff Resolution Remarks</div>
              <AppInput
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Enter actions taken or instructions provided to customer..."
              />
            </div>

            {/* Status Change Buttons */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '600' }}>
                Update Ticket Status
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleUpdateStatus(selectedTicket.number, 'IN_PROGRESS')}
                  style={{
                    padding: '0.45rem 0.9rem',
                    background: selectedTicket.status === 'IN_PROGRESS' ? '#0284c7' : '#e0f2fe',
                    color: selectedTicket.status === 'IN_PROGRESS' ? '#ffffff' : '#0369a1',
                    border: '1px solid #bae6fd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.82rem'
                  }}
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedTicket.number, 'RESOLVED')}
                  style={{
                    padding: '0.45rem 0.9rem',
                    background: selectedTicket.status === 'RESOLVED' ? '#16a34a' : '#dcfce7',
                    color: selectedTicket.status === 'RESOLVED' ? '#ffffff' : '#15803d',
                    border: '1px solid #bbf7d0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.82rem'
                  }}
                >
                  ✓ Mark as Resolved
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedTicket.number, 'OPEN')}
                  style={{
                    padding: '0.45rem 0.9rem',
                    background: selectedTicket.status === 'OPEN' ? '#ea580c' : '#ffedd5',
                    color: selectedTicket.status === 'OPEN' ? '#ffffff' : '#c2410c',
                    border: '1px solid #fed7aa',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.82rem'
                  }}
                >
                  Re-Open Ticket
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <AppButton variant="primary" onClick={() => setViewModalOpen(false)}>
                Done / Close
              </AppButton>
            </div>
          </div>
        </AppModal>
      )}
    </div>
  );
};

export default SupportTickets;


