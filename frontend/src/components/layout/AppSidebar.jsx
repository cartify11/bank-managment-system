import React from 'react';
import { NavLink } from 'react-router-dom';
import { colors, typography, radius } from '../../shared/design-system';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ArrowRightLeft,
  SendHorizontal,
  Briefcase,
  BarChart3,
  Settings,
  ShieldAlert,
  Grid,
  Building2,
  Landmark,
  PiggyBank,
  CheckSquare,
  FileText,
  HelpCircle,
  BookmarkCheck,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Accounts', path: '/accounts', icon: CreditCard },
  { name: 'Transactions', path: '/transactions', icon: ArrowRightLeft },
  { name: 'Transfers', path: '/transfers', icon: SendHorizontal },
  { name: 'Beneficiaries', path: '/beneficiaries', icon: BookmarkCheck },
  { name: 'Loans & EMI', path: '/loans', icon: Landmark },
  { name: 'Fixed Deposits', path: '/fixed-deposits', icon: PiggyBank },
  { name: 'Cards', path: '/cards', icon: CreditCard },
  { name: 'Statements', path: '/statements', icon: FileText },
  { name: 'Approvals Queue', path: '/approvals', icon: CheckSquare },
  { name: 'Support Tickets', path: '/tickets', icon: HelpCircle },
  { name: 'Employees', path: '/employees', icon: Briefcase },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'Security', path: '/security', icon: ShieldAlert },
];

// Pure self-contained SVG Wood Grain Texture (100% Exact match to user's Image 2 reference)
const woodTextureSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='800'><defs><linearGradient id='bg' x1='0%25' y1='0%25' x2='0%25' y2='100%25'><stop offset='0%25' stop-color='%239a5c31'/><stop offset='40%25' stop-color='%23854a23'/><stop offset='80%25' stop-color='%236e3917'/><stop offset='100%25' stop-color='%23582c0f'/></linearGradient><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.006 0.14' numOctaves='5' result='n'/><feColorMatrix type='matrix' values='0.55 0 0 0 0.40  0.30 0.1 0 0 0.20  0.10 0.05 0 0 0.06  0 0 0 0.38 0'/></filter></defs><rect width='100%25' height='100%25' fill='url(%23bg)'/><rect width='100%25' height='100%25' filter='url(%23f)' opacity='0.85'/></svg>`;

export const AppSidebar = () => {
  return (
    <aside
      style={{
        width: '250px',
        /* 100% Exact Match to User Image 2 Wood Plank Texture */
        backgroundColor: '#854a23',
        backgroundImage: `
          repeating-linear-gradient(90deg, rgba(255, 220, 180, 0.04) 0px, rgba(255, 220, 180, 0.04) 1px, transparent 1px, transparent 20px),
          url("${woodTextureSvg}"),
          linear-gradient(180deg, #9a5c31 0%, #854a23 50%, #582c0f 100%)
        `,
        backgroundSize: 'auto, cover, cover',
        backgroundRepeat: 'repeat, no-repeat, no-repeat',
        color: '#fdf4e7',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxHeight: '100vh',
        borderRight: '1px solid rgba(160, 95, 45, 0.6)',
        boxShadow: 'inset -6px 0 20px rgba(0, 0, 0, 0.3), 4px 0 25px rgba(60, 30, 10, 0.35)',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.18)',
          background: 'rgba(0, 0, 0, 0.15)',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: radius.md,
            background: 'linear-gradient(135deg, #dfa36d 0%, #b87640 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
          }}
        >
          <Building2 size={22} />
        </div>
        <div>
          <div style={{ color: '#ffffff', fontWeight: typography.fontWeight.bold, fontSize: '1.05rem', letterSpacing: '0.03em', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            BANK SYSTEM
          </div>
          <div style={{ color: '#f3d9be', fontSize: '0.75rem', fontWeight: typography.fontWeight.semibold, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Enterprise Edition</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.65rem 0.95rem',
                borderRadius: '14px',
                color: isActive ? '#2d180a' : '#ffffff',
                background: isActive
                  ? 'linear-gradient(135deg, #fef4e6 0%, #ebd3b7 100%)'
                  : 'transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                textDecoration: 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isActive
                  ? '0 0 22px rgba(255, 235, 205, 0.75), 0 6px 18px rgba(0, 0, 0, 0.45), inset 0 1px 0 #ffffff'
                  : 'none',
                border: isActive ? '1.5px solid #ffffff' : '1.5px solid transparent',
                textShadow: isActive ? 'none' : '0 1px 2px rgba(0,0,0,0.4)',
              })}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer User Box */}
      <div
        style={{
          padding: '0.85rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.18)',
          margin: '0.5rem',
          borderRadius: radius.md,
          backgroundColor: 'rgba(0, 0, 0, 0.20)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: radius.full,
            background: 'linear-gradient(135deg, #f3d9be 0%, #b87640 100%)',
            color: '#2d180a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          AU
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: typography.fontWeight.medium, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            Admin User
          </div>
          <div style={{ color: '#f3d9be', fontSize: '0.725rem', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>admin@bank.com</div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
