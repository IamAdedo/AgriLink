"use client";

import React from 'react';
import { useApp } from '@/lib/AppContext';

export default function RoleSwitcher() {
  const { activeRole, switchRole } = useApp();

  return (
    <div style={containerStyle}>
      <span style={labelStyle}>SIMULATION SHELL:</span>
      <div style={buttonGroupStyle}>
        <button
          onClick={() => switchRole('customer')}
          style={{
            ...btnStyle,
            ...(activeRole === 'customer' ? activeBtnStyle : {})
          }}
        >
          🟢 Customer (Amina)
        </button>
        <button
          onClick={() => switchRole('farmer')}
          style={{
            ...btnStyle,
            ...(activeRole === 'farmer' ? activeBtnStyle : {})
          }}
        >
          🚜 Farmer (Abdullahi)
        </button>
        <button
          onClick={() => switchRole('driver')}
          style={{
            ...btnStyle,
            ...(activeRole === 'driver' ? activeBtnStyle : {})
          }}
        >
          🚚 Logistics (Tunde)
        </button>
      </div>
    </div>
  );
}

const containerStyle = {
  position: 'fixed',
  top: '16px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10000,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px 16px',
  borderRadius: '24px',
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(0, 100, 48, 0.15)',
  boxShadow: '0 8px 32px rgba(0, 60, 20, 0.12)',
  fontFamily: 'var(--font-outfit)',
  fontSize: '12px',
  fontWeight: '600'
};

const labelStyle = {
  color: 'var(--muted)',
  letterSpacing: '0.05em',
  fontSize: '11px'
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '6px'
};

const btnStyle = {
  cursor: 'pointer',
  padding: '6px 14px',
  borderRadius: '16px',
  border: 'none',
  fontSize: '12px',
  fontWeight: '500',
  backgroundColor: 'transparent',
  color: 'var(--foreground)',
  transition: 'all 0.2s ease-in-out'
};

const activeBtnStyle = {
  backgroundColor: 'var(--primary)',
  color: 'white',
  fontWeight: '600',
  boxShadow: '0 4px 10px rgba(0, 100, 48, 0.2)'
};
