"use client";

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';

export default function FarmerEarnings() {
  const { orders } = useApp();
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [bankPayouts, setBankPayouts] = useState([
    { id: 'pay-7721', date: '2026-07-10', amount: 84000, status: 'completed', bank: 'Access Bank - *9901' },
    { id: 'pay-6552', date: '2026-07-03', amount: 95000, status: 'completed', bank: 'Access Bank - *9901' }
  ]);

  const farmerOrders = orders.filter(o => o.vendorId === 'user-abdullahi');
  const deliveredOrders = farmerOrders.filter(o => o.status === 'delivered');

  const grossSales = deliveredOrders.reduce((sum, o) => sum + o.totalPrice, 0) + 179000; // adding mock baseline seed
  const platformCom = Math.round(grossSales * 0.05); // 5% platform fee
  const netEarnings = grossSales - platformCom;

  const handleRequestPayout = () => {
    if (netEarnings <= 10000) return;
    setRequestSuccess(true);
    setTimeout(() => {
      const newPayout = {
        id: `pay-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        amount: netEarnings - 179000, // payout what's new
        status: 'completed',
        bank: 'Access Bank - *9901'
      };
      setBankPayouts([newPayout, ...bankPayouts]);
      setRequestSuccess(false);
    }, 2000);
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Earnings & Financials</h2>

      {/* Financial Grid */}
      <div style={statsGridStyle}>
        <div style={statCardStyle} className="premium-card">
          <span style={statLabelStyle}>GROSS SALES</span>
          <strong style={statValStyle}>₦{grossSales.toLocaleString()}</strong>
        </div>
        <div style={statCardStyle} className="premium-card">
          <span style={statLabelStyle}>PLATFORM FEE (5%)</span>
          <strong style={{ ...statValStyle, color: 'var(--status-cancelled)' }}>- ₦{platformCom.toLocaleString()}</strong>
        </div>
        <div style={statCardStyle} className="premium-card">
          <span style={statLabelStyle}>NET REVENUE</span>
          <strong style={{ ...statValStyle, color: 'var(--status-delivered)' }}>₦{netEarnings.toLocaleString()}</strong>
        </div>
      </div>

      {/* Payout Action Panel */}
      <div style={payoutPanelStyle} className="premium-card">
        <div>
          <h3 style={payoutTitleStyle}>Escrow Balance Payout</h3>
          <p style={payoutDescStyle}>Your current net revenue is fully available for transfer to your verified Access Bank account.</p>
        </div>
        <button 
          onClick={handleRequestPayout} 
          style={{
            ...payoutBtnStyle,
            opacity: netEarnings <= 10000 ? 0.5 : 1,
            cursor: netEarnings <= 10000 ? 'not-allowed' : 'pointer'
          }}
          disabled={netEarnings <= 10000 || requestSuccess}
        >
          {requestSuccess ? 'Processing Bank Payout...' : `Withdraw ₦${netEarnings.toLocaleString()}`}
        </button>
      </div>

      {/* Payout Logs */}
      <h3 style={sectionHeaderStyle}>Withdrawal Log</h3>
      <div style={logsListStyle}>
        {bankPayouts.map(pay => (
          <div key={pay.id} style={logItemStyle} className="premium-card">
            <div style={logInfoStyle}>
              <strong>Withdrawal #{pay.id.split('-')[1]}</strong>
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
