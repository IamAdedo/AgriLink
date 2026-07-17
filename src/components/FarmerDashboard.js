"use client";

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';

export default function FarmerDashboard() {
  const { orders, products, updateOrderStatus, updateProductStock } = useApp();
  const [refillStockId, setRefillStockId] = useState('');
  const [refillVal, setRefillVal] = useState(50);

  // Filter orders related to this farmer (Abdullahi)
  const farmerOrders = orders.filter(o => o.vendorId === 'user-abdullahi');
  const activeOrders = farmerOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  
  // Low stock products (stock <= 10)
  const lowStockProducts = products.filter(p => p.vendorId === 'user-abdullahi' && p.stock <= 10);

  const totalEarnings = 235000; // Mock base from blueprint

  const handleUpdateStatus = (orderId, currentStatus) => {
    if (currentStatus === 'pending') {
      updateOrderStatus(orderId, 'preparing');
    } else if (currentStatus === 'preparing') {
      updateOrderStatus(orderId, 'ready');
    }
  };

  const handleRefillStock = (productId) => {
    updateProductStock(productId, refillVal);
    setRefillStockId('');
  };

  return (
    <div style={containerStyle}>
      {/* Welcome Greeting */}
      <div style={welcomeStyle}>
        <span style={helloTextStyle}>Good morning, Abdullahi ☀️</span>
        <h2 style={subTextStyle}>Here is your farm performance today.</h2>
      </div>

      {/* Earnings Overview Card */}
      <div style={earningsCardStyle} className="premium-card">
        <div style={earningsHeaderStyle}>
          <div>
            <span style={earningsLabelStyle}>TOTAL EARNINGS</span>
            <h1 style={earningsValueStyle}>₦{totalEarnings.toLocaleString()}</h1>
            <span style={earningsSubStyle}>📈 +12% from last week</span>
          </div>
          <span style={earningsYearStyle}>July 2026</span>
        </div>

        {/* Clean SVG Line Chart */}
        <div style={chartContainerStyle}>
          <svg viewBox="0 0 400 120" style={svgStyle}>
            <defs>
              <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Grid Lines */}
            <line x1="0" y1="20" x2="400" y2="20" stroke="var(--border)" strokeWidth="0.5" />
            <line x1="0" y1="60" x2="400" y2="60" stroke="var(--border)" strokeWidth="0.5" />
            <line x1="0" y1="100" x2="400" y2="100" stroke="var(--border)" strokeWidth="0.5" />
            
            {/* Fill Area */}
            <path 
              d="M0 100 Q 80 80, 160 90 T 320 30 T 400 20 L 400 120 L 0 120 Z" 
              fill="url(#chart-grad)"
            />
            {/* Smooth Line */}
            <path 
              d="M0 100 Q 80 80, 160 90 T 320 30 T 400 20" 
              fill="none" 
              stroke="var(--accent)" 
              strokeWidth="3.5" 
              strokeLinecap="round"
            />
            {/* Highlight Dot */}
            <circle cx="400" cy="20" r="5" fill="var(--accent)" stroke="white" strokeWidth="2" />
          </svg>
          <div style={chartLabelsStyle}>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </div>

      {/* Grid: Active Orders & Stock Warnings */}
      <div style={layoutStyle}>
        
        {/* Active Orders Queue */}
        <div style={ordersSectionStyle}>
          <h3 style={sectionTitleStyle}>Incoming Active Orders ({activeOrders.length})</h3>
          {activeOrders.length === 0 ? (
            <div style={emptyCardStyle} className="premium-card">
              <p style={emptyTextStyle}>No active orders currently pending dispatch.</p>
            </div>
          ) : (
            <div style={ordersListStyle}>
              {activeOrders.map(o => (
                <div key={o.id} style={orderItemCardStyle} className="premium-card">
                  <div style={orderHeaderStyle}>
                    <strong>Order #{o.id.split('-')[1]}</strong>
                    <span style={{ ...statusBadgeStyle, backgroundColor: `var(--status-${o.status})` }}>{o.status.toUpperCase()}</span>
                  </div>
                  <span style={consumerLabelStyle}>Customer: <strong>{o.consumerName}</strong></span>
                  <span style={addressLabelStyle}>Delivery Slot: <strong>{o.deliverySlot.replace('_', ' ').toUpperCase()}</strong></span>
                  
                  <div style={itemsListWrapperStyle}>
                    {o.items.map((it, idx) => (
                      <div key={idx} style={orderSubItemStyle}>
                        <span>{it.productName}</span>
                        <strong>x{it.quantity}</strong>
                      </div>
                    ))}
                  </div>

                  <div style={orderFooterStyle}>
                    <strong style={orderPriceStyle}>₦{o.totalPrice.toLocaleString()}</strong>
                    {o.status === 'pending' && (
                      <button 
                        onClick={() => handleUpdateStatus(o.id, 'pending')}
                        style={actionBtnStyle}
                      >
                        Accept Order
                      </button>
                    )}
                    {o.status === 'preparing' && (
                      <button 
                        onClick={() => handleUpdateStatus(o.id, 'preparing')}
                        style={{ ...actionBtnStyle, backgroundColor: 'var(--status-ready)' }}
                      >
                        Ready for Pickup
                      </button>
                    )}
                    {o.status === 'ready' && (
                      <span style={waitingLabelStyle}>Awaiting Driver Claim</span>
                    )}
                    {o.status === 'in_transit' && (
                      <span style={transitLabelStyle}>On Transit with Driver</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stock Alerts & Quick Refills */}
        <div style={alertsSectionStyle}>
          <h3 style={sectionTitleStyle}>Inventory Shortages</h3>
          {lowStockProducts.length === 0 ? (
            <div style={noAlertsCardStyle} className="premium-card">
              <span style={greenCheckStyle}>✓</span>
              <div>
                <strong style={alertTitleStyle}>All stocks healthy!</strong>
                <p style={alertSubStyle}>All products currently have stable quantities.</p>
              </div>
            </div>
          ) : (
            <div style={alertsListStyle}>
              {lowStockProducts.map(p => (
                <div key={p.id} style={alertCardStyle} className="premium-card">
                  <div style={alertContentStyle}>
                    <div>
                      <strong style={alertProdNameStyle}>{p.name}</strong>
                      <p style={alertStatusStyle}>Only <strong style={{ color: 'var(--status-cancelled)' }}>{p.stock} {p.unit}</strong> left in stock</p>
                    </div>
                    {refillStockId === p.id ? (
                      <div style={refillBoxStyle}>
                        <input 
                          type="number" 
                          value={refillVal} 
                          onChange={(e) => setRefillVal(parseInt(e.target.value))}
                          style={refillInputStyle}
                        />
                        <button onClick={() => handleRefillStock(p.id)} style={refillSaveBtnStyle}>Save</button>
                      </div>
                    ) : (
                      <button onClick={() => { setRefillStockId(p.id); setRefillVal(50); }} style={refillBtnStyle}>
                        Refill
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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

const welcomeStyle = {
  marginBottom: '20px'
};

const helloTextStyle = {
  fontSize: '15px',
  color: 'var(--muted)',
  fontWeight: '500'
};

const subTextStyle = {
  fontSize: '20px',
  fontWeight: '700',
  color: 'var(--foreground)',
  lineHeight: '1.2',
  marginTop: '4px'
};

const earningsCardStyle = {
  background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
  color: 'white',
  padding: '24px',
  borderRadius: 'var(--radius-md)',
  marginBottom: '30px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  border: 'none',
  boxShadow: 'var(--shadow-md)'
};

const earningsHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start'
};

const earningsLabelStyle = {
  fontSize: '10px',
  fontWeight: '800',
  letterSpacing: '0.1em',
  opacity: '0.7',
  display: 'block'
};

const earningsValueStyle = {
  fontSize: '28px',
  fontWeight: '800',
  margin: '4px 0'
};

const earningsSubStyle = {
  fontSize: '11px',
  color: 'var(--accent-light)',
  fontWeight: '600'
};

const earningsYearStyle = {
  fontSize: '12px',
  backgroundColor: 'rgba(255,255,255,0.15)',
  padding: '4px 10px',
  borderRadius: '12px',
  fontWeight: '600'
};

const chartContainerStyle = {
  width: '100%',
  marginTop: '10px'
};

const svgStyle = {
  width: '100%',
  height: 'auto',
  overflow: 'visible'
};

const chartLabelsStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 4px 0 4px',
  fontSize: '10px',
  opacity: '0.6',
  fontWeight: '600'
};

const layoutStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '24px'
};

// Can be split on desktops to 1.6fr 1fr

const ordersSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const sectionTitleStyle = {
  fontSize: '15px',
  fontWeight: '800',
  color: 'var(--foreground)',
  letterSpacing: '-0.01em',
  marginBottom: '4px'
};

const emptyCardStyle = {
  padding: '30px 16px',
  backgroundColor: 'white',
  textAlign: 'center'
};

const emptyTextStyle = {
  fontSize: '13px',
  color: 'var(--muted)',
  fontStyle: 'italic'
};

const ordersListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const orderItemCardStyle = {
  backgroundColor: 'white',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const orderHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const statusBadgeStyle = {
  fontSize: '9px',
  color: 'white',
  padding: '2px 8px',
  borderRadius: '10px',
  fontWeight: '700',
  letterSpacing: '0.05em'
};

const consumerLabelStyle = {
  fontSize: '12px',
  color: 'var(--muted)'
};

const addressLabelStyle = {
  fontSize: '11px',
  color: 'var(--muted)',
  marginBottom: '4px'
};

const itemsListWrapperStyle = {
  backgroundColor: 'var(--background)',
  padding: '10px 12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const orderSubItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '12px',
  color: 'var(--foreground)',
  fontWeight: '550'
};

const orderFooterStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '8px'
};

const orderPriceStyle = {
  fontSize: '15px',
  color: 'var(--primary)',
  fontWeight: '800'
};

const actionBtnStyle = {
  backgroundColor: 'var(--primary)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '700',
  cursor: 'pointer',
  border: 'none',
  boxShadow: 'var(--shadow-sm)',
  transition: 'transform 0.1s'
};

const waitingLabelStyle = {
  fontSize: '11px',
  color: 'var(--status-ready)',
  fontWeight: '700'
};

const transitLabelStyle = {
  fontSize: '11px',
  color: 'var(--status-transit)',
  fontWeight: '700'
};

const alertsSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const noAlertsCardStyle = {
  backgroundColor: 'white',
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const greenCheckStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: 'var(--accent-light)',
  color: 'var(--accent)',
  fontSize: '18px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const alertTitleStyle = {
  fontSize: '13px',
  color: 'var(--foreground)'
};

const alertSubStyle = {
  fontSize: '11px',
  color: 'var(--muted)'
};

const alertsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const alertCardStyle = {
  backgroundColor: 'white',
  padding: '12px 16px'
};

const alertContentStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px'
};

const alertProdNameStyle = {
  fontSize: '13px',
  color: 'var(--foreground)'
};

const alertStatusStyle = {
  fontSize: '11px',
  color: 'var(--muted)'
};

const refillBtnStyle = {
  padding: '6px 12px',
  borderRadius: '14px',
  backgroundColor: 'var(--primary-light)',
  color: 'var(--primary)',
  fontWeight: '700',
  fontSize: '11px',
  cursor: 'pointer',
  border: 'none',
  transition: 'all 0.2s'
};

const refillBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const refillInputStyle = {
  width: '50px',
  padding: '4px',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  fontSize: '11px',
  textAlign: 'center',
  backgroundColor: 'white'
};

const refillSaveBtnStyle = {
  padding: '4px 8px',
  backgroundColor: 'var(--primary)',
  color: 'white',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: '600',
  cursor: 'pointer',
  border: 'none'
};
