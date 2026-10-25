import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { typography, radius } from '../../shared/design-system';
import { Search, Bell, Shield, LogOut, X, User, CreditCard, ArrowRightLeft, CheckCheck, AlertTriangle, CheckCircle2, Clock, FileText } from 'lucide-react';
import dataStore from '../../services/dataStore';

export const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Notification State
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Pending Account Approval',
      desc: 'New Business Account #1009 requires manager sign-off.',
      time: '10m ago',
      type: 'approval',
      unread: true,
      link: '/approvals'
    },
    {
      id: 2,
      title: 'Security Alert',
      desc: 'Unusual login attempt from IP 192.168.1.45 flagged.',
      time: '35m ago',
      type: 'alert',
      unread: true,
      link: '/security'
    },
    {
      id: 3,
      title: 'High-Value Transfer',
      desc: 'PKR 50,000 transfer completed for Customer Ali Khan.',
      time: '2h ago',
      type: 'info',
      unread: true,
      link: '/transactions'
    },
    {
      id: 4,
      title: 'Support Ticket #402',
      desc: 'Passport re-verification request submitted.',
      time: '5h ago',
      type: 'ticket',
      unread: false,
      link: '/tickets'
    }
  ]);

  // Close search & notification dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  // Fetch search matches
  const term = searchTerm.trim().toLowerCase();

  const matchedCustomers = term ? dataStore.getCustomers().filter(c =>
    c.name.toLowerCase().includes(term) ||
    c.email.toLowerCase().includes(term) ||
    c.nationalId.toLowerCase().includes(term)
  ) : [];

  const matchedAccounts = term ? dataStore.getAccounts().filter(a =>
    a.accountNumber.toLowerCase().includes(term) ||
    a.customerName.toLowerCase().includes(term) ||
    a.type.toLowerCase().includes(term)
  ) : [];

  const matchedTransactions = term ? dataStore.getTransactions().filter(t =>
    t.ref?.toLowerCase().includes(term) ||
    t.name?.toLowerCase().includes(term) ||
    t.source?.toLowerCase().includes(term) ||
    t.target?.toLowerCase().includes(term)
  ) : [];

  const totalResults = matchedCustomers.length + matchedAccounts.length + matchedTransactions.length;

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'rgba(246, 241, 234, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(220, 205, 190, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Global Interactive Search Container */}
      <div ref={dropdownRef} style={{ position: 'relative', width: '400px' }}>
        <Search
          size={17}
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#b87c4c',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search customers, accounts, transactions..."
          style={{
            width: '100%',
            padding: '0.55rem 2.4rem 0.55rem 2.6rem',
            borderRadius: radius.full,
            border: isOpen && term ? '1.5px solid #b87c4c' : '1px solid #e4d7c8',
            backgroundColor: '#ffffff',
            fontSize: '0.875rem',
            color: '#2c1e16',
            outline: 'none',
            transition: 'all 0.2s ease-in-out',
            boxSizing: 'border-box',
            fontFamily: typography.fontFamily,
            boxShadow: isOpen && term ? '0 0 0 3px rgba(184, 124, 76, 0.18)' : 'inset 0 1px 3px rgba(0,0,0,0.03)',
          }}
        />

        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setIsOpen(false);
            }}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#7a6658',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2px',
            }}
          >
            <X size={16} />
          </button>
        )}

        {/* Live Search Results Dropdown Menu */}
        {isOpen && term && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #cfa075',
              boxShadow: '0 16px 40px rgba(78, 41, 18, 0.25)',
              maxHeight: '420px',
              overflowY: 'auto',
              padding: '0.75rem',
              zIndex: 100,
            }}
          >
            {totalResults === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#7a6658', fontSize: '0.85rem' }}>
                No results found for "<strong>{searchTerm}</strong>"
              </div>
            ) : (
              <div>
                {/* Customers Category */}
                {matchedCustomers.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.70rem', fontWeight: 700, color: '#b87c4c', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <User size={13} /> Customers ({matchedCustomers.length})
                    </div>
                    {matchedCustomers.map((cust) => (
                      <div
                        key={cust.id}
                        onClick={() => {
                          navigate(`/customers/${cust.id}`);
                          setIsOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.5rem 0.6rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                          marginBottom: '2px',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#faf5ee'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <img
                          src={cust.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'}
                          alt={cust.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #b87c4c' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2c1e16' }}>{cust.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#7a6658' }}>{cust.email} • {cust.nationalId}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Accounts Category */}
                {matchedAccounts.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.70rem', fontWeight: 700, color: '#b87c4c', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CreditCard size={13} /> Accounts ({matchedAccounts.length})
                    </div>
                    {matchedAccounts.map((acc) => (
                      <div
                        key={acc.accountNumber}
                        onClick={() => {
                          navigate(`/accounts/${acc.accountNumber}`);
                          setIsOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0.6rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                          marginBottom: '2px',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#faf5ee'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2c1e16' }}>{acc.accountNumber}</div>
                          <div style={{ fontSize: '0.72rem', color: '#7a6658' }}>Holder: {acc.customerName} ({acc.type})</div>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#87532a' }}>{acc.balance}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Transactions Category */}
                {matchedTransactions.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.70rem', fontWeight: 700, color: '#b87c4c', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <ArrowRightLeft size={13} /> Transactions ({matchedTransactions.length})
                    </div>
                    {matchedTransactions.slice(0, 5).map((tx, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          navigate('/transactions');
                          setIsOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0.6rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                          marginBottom: '2px',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#faf5ee'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2c1e16' }}>{tx.ref || tx.id} - {tx.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#7a6658' }}>{tx.type} • {tx.date}</div>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: tx.type === 'DEPOSIT' ? '#87532a' : '#2c1e16' }}>{tx.amount}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Header Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Branch Badge */}
        <div
          style={{
            padding: '0.35rem 0.9rem',
            borderRadius: radius.full,
            background: '#ebdccb',
            color: '#7c4d30',
            fontSize: '0.75rem',
            fontWeight: typography.fontWeight.semibold,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            border: '1px solid #d8c2ad',
          }}
        >
          <Shield size={13} /> Branch: HQ Main
        </div>

        {/* Notification Bell */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              position: 'relative',
              cursor: 'pointer',
              padding: '0.45rem',
              borderRadius: radius.full,
              backgroundColor: notifOpen ? '#e3cfbb' : '#ebdccb',
              border: notifOpen ? '1.5px solid #b87c4c' : '1px solid #d8c2ad',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: notifOpen ? '0 0 0 3px rgba(184, 124, 76, 0.2)' : 'none',
            }}
          >
            <Bell size={19} style={{ color: '#7c4d30' }} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  backgroundColor: '#a83e2a',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  minWidth: '16px',
                  height: '16px',
                  padding: '0 4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #ffffff',
                  boxShadow: '0 2px 4px rgba(168, 62, 42, 0.4)',
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>

          {/* Notifications Dropdown Panel */}
          {notifOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '360px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #cfa075',
                boxShadow: '0 16px 40px rgba(78, 41, 18, 0.25)',
                overflow: 'hidden',
                zIndex: 100,
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: '#f8f4ee',
                  borderBottom: '1px solid #e8dacb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#2c1e16' }}>Notifications</span>
                  {unreadCount > 0 && (
                    <span style={{ backgroundColor: '#b87c4c', color: '#fff', fontSize: '0.7rem', fontWeight: '700', padding: '0.1rem 0.45rem', borderRadius: '10px' }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#b87c4c',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>

              {/* Notification Items */}
              <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#7a6658', fontSize: '0.85rem' }}>
                    No notifications right now.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        markAsRead(item.id);
                        if (item.link) navigate(item.link);
                        setNotifOpen(false);
                      }}
                      style={{
                        padding: '0.85rem 1rem',
                        borderBottom: '1px solid #f2e9df',
                        backgroundColor: item.unread ? '#fffaf4' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease',
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'flex-start',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7efe6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = item.unread ? '#fffaf4' : '#ffffff'}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          backgroundColor:
                            item.type === 'alert' ? '#fde8e8' :
                            item.type === 'approval' ? '#eef4ff' :
                            item.type === 'ticket' ? '#fef3c7' : '#f0fdf4',
                          color:
                            item.type === 'alert' ? '#dc2626' :
                            item.type === 'approval' ? '#2563eb' :
                            item.type === 'ticket' ? '#d97706' : '#16a34a',
                        }}
                      >
                        {item.type === 'alert' ? <AlertTriangle size={17} /> :
                         item.type === 'approval' ? <FileText size={17} /> :
                         item.type === 'ticket' ? <Clock size={17} /> :
                         <CheckCircle2 size={17} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.83rem', fontWeight: item.unread ? '700' : '600', color: '#2c1e16' }}>
                            {item.title}
                          </span>
                          <span style={{ fontSize: '0.70rem', color: '#a08c7d' }}>{item.time}</span>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#7a6658', lineHeight: '1.3' }}>
                          {item.desc}
                        </div>
                      </div>
                      {item.unread && (
                        <div
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            backgroundColor: '#b87c4c',
                            marginTop: '6px',
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: '0.6rem',
                  textAlign: 'center',
                  backgroundColor: '#f8f4ee',
                  borderTop: '1px solid #e8dacb',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#b87c4c',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setNotifOpen(false);
                  }}
                >
                  Close Notifications
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            borderLeft: '1px solid #e4d7c8',
            paddingLeft: '1rem',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: radius.full,
              background: 'linear-gradient(135deg, #b87c4c 0%, #8d5635 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              boxShadow: '0 2px 8px rgba(141, 86, 53, 0.3)',
              border: '2px solid #ffffff',
              flexShrink: 0,
            }}
          >
            {user?.username ? user.username.substring(0, 2).toUpperCase() : 'AD'}
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: typography.fontWeight.semibold, color: '#3e2e24' }}>
              {user?.username || 'admin'}
            </div>
            <div style={{ fontSize: '0.70rem', color: '#8d5635', fontWeight: typography.fontWeight.medium, letterSpacing: '0.05em' }}>
              {user?.role || 'ROLE_ADMIN'}
            </div>
          </div>

          <button
            onClick={logout}
            title="Logout"
            style={{
              background: 'rgba(168, 62, 42, 0.08)',
              border: '1px solid rgba(168, 62, 42, 0.2)',
              cursor: 'pointer',
              color: '#a83e2a',
              padding: '0.35rem',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              marginLeft: '0.25rem',
            }}
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
