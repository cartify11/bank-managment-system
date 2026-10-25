import React, { useState } from 'react';
import { colors, typography } from '../shared/design-system';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import AppBadge from '../components/ui/AppBadge';
import AppInput from '../components/ui/AppInput';
import AppSelect from '../components/ui/AppSelect';
import AppTable from '../components/ui/AppTable';
import AppTabs from '../components/ui/AppTabs';
import AppModal from '../components/ui/AppModal';
import { Plus, Trash, Check, Info } from 'lucide-react';

export const ComponentLibrary = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('buttons');

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
          Master Component Library (Screen 15)
        </h1>
        <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginTop: '0.2rem' }}>
          Visual inspection catalog of all design system tokens and reusable UI elements
        </div>
      </div>

      <AppTabs
        tabs={[
          { id: 'buttons', label: 'Buttons & Badges' },
          { id: 'inputs', label: 'Form Controls' },
          { id: 'cards', label: 'Cards & Elevation' },
          { id: 'tokens', label: 'Color Tokens' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'buttons' && (
        <AppCard title="Buttons & Badges Catalog">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
            <AppButton variant="primary" icon={Plus}>Primary Button</AppButton>
            <AppButton variant="secondary">Secondary Button</AppButton>
            <AppButton variant="outline">Outline Button</AppButton>
            <AppButton variant="danger" icon={Trash}>Danger Button</AppButton>
            <AppButton variant="ghost">Ghost Button</AppButton>
            <AppButton variant="primary" onClick={() => setModalOpen(true)}>Open Modal</AppButton>
          </div>

          <h4 style={{ color: '#2c1e16', marginBottom: '0.75rem' }}>Status Pill Badges</h4>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <AppBadge variant="success">Success / Active</AppBadge>
            <AppBadge variant="warning">Warning / Pending</AppBadge>
            <AppBadge variant="danger">Danger / Error</AppBadge>
            <AppBadge variant="info">Information / Processing</AppBadge>
          </div>
        </AppCard>
      )}

      {activeTab === 'inputs' && (
        <AppCard title="Form Inputs & Controls">
          <div style={{ maxWidth: '480px' }}>
            <AppInput label="Standard Text Input" placeholder="Enter text..." />
            <AppInput label="Input with Error" placeholder="Enter email..." error="Invalid email address format" />
            <AppSelect
              label="Select Dropdown"
              options={[
                { value: '1', label: 'Option One' },
                { value: '2', label: 'Option Two' },
              ]}
            />
          </div>
        </AppCard>
      )}

      {activeTab === 'cards' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <AppCard title="Standard Surface Card">
            <p style={{ color: '#7a6658', fontSize: typography.fontSize.sm }}>
              This is a standard elevation card with 1px border and subtle shadow.
            </p>
          </AppCard>

          <AppCard title="Card with Action Button" action={<AppButton size="sm">Action</AppButton>}>
            <p style={{ color: '#7a6658', fontSize: typography.fontSize.sm }}>
              Cards can contain top right action controls.
            </p>
          </AppCard>
        </div>
      )}

      {activeTab === 'tokens' && (
        <AppCard title="Design System Color Swatches">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: '60px', backgroundColor: colors.sidebarBg, borderRadius: '6px', marginBottom: '0.35rem' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Sidebar Bg ({colors.sidebarBg})</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: '60px', backgroundColor: colors.primary, borderRadius: '6px', marginBottom: '0.35rem' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Primary Teal ({colors.primary})</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: '60px', background: '#ffffff', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '0.35rem' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Main Slate ({colors.mainBg})</span>
            </div>
          </div>
        </AppCard>
      )}

      <AppModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Sample Component Modal">
        <p style={{ fontSize: typography.fontSize.sm, color: '#7a6658' }}>
          This modal dialog component adheres 100% to the Master Reference board visual design.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <AppButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AppButton>
          <AppButton variant="primary" onClick={() => setModalOpen(false)}>Confirm</AppButton>
        </div>
      </AppModal>
    </div>
  );
};

export default ComponentLibrary;



