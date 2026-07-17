"use client";

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';

export default function FarmerOrders() {
  const { orders, updateOrderStatus } = useApp();
  const [filter, setFilter] = useState('all');

  const farmerOrders = orders.filter(o => o.vendorId === 'user-abdullahi');

  const filteredOrders = farmerOrders.filter(o => {
    if (filter === 'all') return true;
    if (filter === 'active') return o.status !== 'delivered' && o.status !== 'cancelled';
    if (filter === 'completed') return o.status === 'delivered';
    return o.status === filter;
  });

  const handleUpdateStatus = (orderId, currentStatus) => {
    if (currentStatus === 'pending') {
      updateOrderStatus(orderId, 'preparing');
    } else if (currentStatus === 'preparing') {
      updateOrderStatus(orderId, 'ready');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Order Management</h2>

      {/* Filter Tabs */}
      <div style={filterRowStyle}>
        {['all', 'active', 'pending', 'preparing', 'ready', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...filterBtnStyle,
              ...(filter === f ? activeFilterBtnStyle : {})
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div style={emptyCardStyle} className="premium-card">
          <p style={emptyTextStyle}>No orders match the selected filter.</p>
        </div>
      ) : (
        <div style={listStyle}>
          {filteredOrders.map(o => (
            <div key={o.id} style={orderCardStyle} className="premium-card">
              <div style={orderHeaderStyle}>
                <div>
                  <strong>Order #{o.id.split('-')[1]}</strong>
                  <span style={orderTimeStyle}>{new Date(o.createdAt).toLocaleDateString()} {new Date(o.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <span style={{ ...statusBadgeStyle, backgroundColor: `var(--status-${o.status})` }}>{o.status.toUpperCase()}</span>
              </div>

              <div style={orderBodyStyle}>
                <div style={customerInfoStyle}>
                  <span>Customer:</span>
                  <strong>{o.consumerName}</strong>
                </div>
                <div style={customerInfoStyle}>
                  <span>Delivery Address:</span>
                  <strong>{o.deliveryAddress}</strong>
                </div>
                <div style={customerInfoStyle}>
                  <span>Delivery Slot:</span>
                  <strong>{o.deliverySlot.replace('_', ' ').toUpperCase()}</strong>
                </div>
              </div>

              <div style={itemsListStyle}>
                {o.items.map((it, idx) => (
                  <div key={idx} style={itemRowStyle}>
                    <span>{it.productName}</span>
                    <strong>x{it.quantity} (₦{it.priceAtPurchase.toLocaleString()}/u)</strong>
                  </div>
                ))}
              </div>

              <div style={orderFooterStyle}>
                <div style={totalStyle}>
                  <span>Total Amount</span>
                  <strong>₦{o.totalPrice.toLocaleString()}</strong>
                </div>

                {o.status === 'pending' && (
                  <button onClick={() => handleUpdateStatus(o.id, 'pending')} style={actionBtnStyle}>
                    Accept Order
                  </button>
                )}
                {o.status === 'preparing' && (
                  <button onClick={() => handleUpdateStatus(o.id, 'preparing')} style={{ ...actionBtnStyle, backgroundColor: 'var(--status-ready)' }}>
                    Mark Ready for Pickup
                  </button>
                )}
                {o.status === 'ready' && <span style={statusLabelStyle}>Awaiting Driver Claim</span>}
                {o.status === 'in_transit' && <span style={{ ...statusLabelStyle, color: 'var(--status-transit)' }}>In Transit</span>}
                {o.status === 'delivered' && <span style={{ ...statusLabelStyle, color: 'var(--status-delivered)' }}>Delivered & Paid</span>}
              </div>
            </div>
          ))}
        </div>
      )}
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

const filterRowStyle = {
  display: 'flex',
  gap: '8px',
  overflowX: 'auto',
  paddingBottom: '8px',
  marginBottom: '20px'
};

const filterBtnStyle = {
  padding: '6px 12px',
  borderRadius: '14px',
  border: '1px solid var(--border)',
  backgroundColor: 'white',
  fontSize: '11px',
  fontWeight: '700',
  color: 'var(--muted)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s'
};

const activeFilterBtnStyle = {
  backgroundColor: 'var(--primary)',
  color: 'white',
  borderColor: 'var(--primary)'
};

const emptyCardStyle = {
  padding: '40px',
  backgroundColor: 'white',
  textAlign: 'center'
};

const emptyTextStyle = {
  fontSize: '13px',
  color: 'var(--muted)',
  fontStyle: 'italic'
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const orderCardStyle = {
  backgroundColor: 'white',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const orderHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid var(--border)',
  paddingBottom: '10px'
};

const orderTimeStyle = {
  fontSize: '10px',
  color: 'var(--muted)',
  display: 'block',
  marginTop: '2px'
};

const statusBadgeStyle = {
  fontSize: '9px',
  color: 'white',
  padding: '2px 8px',
  borderRadius: '10px',
  fontWeight: '700',
  letterSpacing: '0.05em'
};

const orderBodyStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  fontSize: '12px',
  color: 'var(--muted)'
};

const customerInfoStyle = {
  display: 'flex',
  justifyContent: 'space-between'
};

const itemsListStyle = {
  backgroundColor: 'var(--background)',
  padding: '10px 12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const itemRowStyle = {
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
  borderTop: '1px solid var(--border)',
  paddingTop: '12px',
  marginTop: '4px'
};

const totalStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const orderPriceStyle = {
  fontSize: '16px',
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
  boxShadow: 'var(--shadow-sm)'
};

const statusLabelStyle = {
  fontSize: '12px',
  fontWeight: '700',
  color: 'var(--primary)'
};
