"use client";

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';

export default function DriverEarnings() {
  const { deliveries } = useApp();
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [bankPayouts, setBankPayouts] = useState([
    { id: 'pay-d221', date: '2026-07-15', amount: 14400, status: 'completed', bank: 'Zenith Bank - *4488' },
    { id: 'pay-d119', date: '2026-07-08', amount: 12000, status: 'completed', bank: 'Zenith Bank - *4488' }
  ]);

  const driverDeliveries = deliveries.filter(d => d.driverId === 'user-tunde');
  const completedDeliveries = driverDeliveries.filter(d => d.status === 'completed');

  const grossEarnings = completedDeliveries.length * 1200 + 26400; // adding baseline mock
  const netEarnings = grossEarnings; // no platform fee for drivers!

  const handleRequestPayout = () => {
    if (netEarnings <= 5000) return;
    setRequestSuccess(true);
    setTimeout(() => {
      const newPayout = {
        id: `pay-d${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        amount: netEarnings - 26400,
        status: 'completed',
        bank: 'Zenith Bank - *4488'
      };
      setBankPayouts([newPayout, ...bankPayouts]);
      setRequestSuccess(false);
    }, 2000);
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Driver Earnings & Wallet</h2>

      {/* Stats Summary */}
      <div style={statsGridStyle}>
        <div style={statCardStyle} className="premium-card">
          <span style={statLabelStyle}>COMPLETED JOBS</span>
          <strong style={statValStyle}>{completedDeliveries.length + 22}</strong>
        </div>
        <div style={statCardStyle} className="premium-card">
          <span style={statLabelStyle}>REWARD RATE</span>
          <strong style={{ ...statValStyle, color: 'var(--accent)' }}>₦1,200 / drop</strong>
        </div>
        <div style={statCardStyle} className="premium-card">
          <span style={statLabelStyle}>TOTAL REVENUE</span>
          <strong style={statValStyle}>₦{netEarnings.toLocaleString()}</strong>
        </div>
      </div>

      {/* Payout Action Panel */}
      <div style={payoutPanelStyle} className="premium-card">
        <div>
          <h3 style={payoutTitleStyle}>Instant Bank Transfer</h3>
          <p style={payoutDescStyle}>Withdraw your accumulated delivery payouts directly into your linked Zenith Bank account.</p>
        </div>
        <button 
          onClick={handleRequestPayout} 
          style={{
            ...payoutBtnStyle,
            opacity: netEarnings <= 5000 ? 0.5 : 1,
            cursor: netEarnings <= 5000 ? 'not-allowed' : 'pointer'
          }}
          disabled={netEarnings <= 5000 || requestSuccess}
        >
          {requestSuccess ? 'Initiating Bank Transfer...' : `Withdraw ₦${netEarnings.toLocaleString()}`}
        </button>
      </div>

      {/* Historical logs */}
      <h3 style={sectionHeaderStyle}>Recent Withdrawals</h3>
      <div style={logsListStyle}>
        {bankPayouts.map(pay => (
          <div key={pay.id} style={logItemStyle} className="premium-card">
            <div style={logInfoStyle}>
              <strong>Transfer #{pay.id.split('-')[1]}</strong>
              <span style={logDateStyle}>{pay.date} • {pay.bank}</span>
            </div>
            <div style={logFinancialStyle}>
              <strong style={logAmtStyle}>- ₦{pay.amount.toLocaleString()}</strong>
              <span style={logStatusStyle}>Completed</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const containerStyle = {
  padding: '85px 16px 85px 16px',
  maxWidth: '800px',
  margin: '0 auto',
  animation: 'fadeInUp 0.4s ease-out'
};

const titleStyle = {
  fontSize: '20px',
  fontWeight: '800',
  color: 'var(--foreground)',
  marginBottom: '20px',
  letterSpacing: '-0.02em'
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: '12px',
  marginBottom: '24px'
};

const statCardStyle = {
  backgroundColor: 'white',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const statLabelStyle = {
  fontSize: '9px',
  fontWeight: '700',
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const statValStyle = {
  fontSize: '18px',
  fontWeight: '800',
  color: 'var(--primary)'
};

const payoutPanelStyle = {
  backgroundColor: 'var(--primary-light)',
  border: '1px solid rgba(0, 100, 48, 0.1)',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginBottom: '30px'
};

const payoutTitleStyle = {
  fontSize: '15px',
  fontWeight: '800',
  color: 'var(--primary)',
  marginBottom: '4px'
};

const payoutDescStyle = {
  fontSize: '12px',
  color: 'var(--muted)',
  lineHeight: '1.4'
};

const payoutBtnStyle = {
  width: '100%',
  backgroundColor: 'var(--primary)',
  color: 'white',
  padding: '12px',
  borderRadius: '24px',
  fontWeight: '800',
  fontSize: '13px',
  border: 'none',
  boxShadow: 'var(--shadow-sm)',
  textAlign: 'center'
};

const sectionHeaderStyle = {
  fontSize: '13px',
  fontWeight: '800',
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '14px'
};

const logsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const logItemStyle = {
  backgroundColor: 'white',
  padding: '14px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const logInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px'
};

const logDateStyle = {
  fontSize: '11px',
  color: 'var(--muted)'
};

const logFinancialStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '2px'
};

const logAmtStyle = {
  fontSize: '13px',
  fontWeight: '700',
  color: 'var(--foreground)'
};

const logStatusStyle = {
  fontSize: '10px',
  color: 'var(--status-delivered)',
  fontWeight: '700'
};
