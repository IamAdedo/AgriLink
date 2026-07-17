"use client";

import React from 'react';
import { useApp } from '@/lib/AppContext';

export default function Navbar() {
  const { activeRole, activeTab, setActiveTab, cart } = useApp();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderCustomerTabs = () => (
    <>
      <button 
        onClick={() => setActiveTab('home')} 
        style={{ ...tabButtonStyle, ...(activeTab === 'home' ? activeTabStyle : {}) }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>Home</span>
      </button>

      <button 
        onClick={() => setActiveTab('orders')} 
        style={{ ...tabButtonStyle, ...(activeTab === 'orders' ? activeTabStyle : {}) }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>Orders</span>
      </button>

      <button 
        onClick={() => setActiveTab('cart')} 
        style={{ ...tabButtonStyle, ...(activeTab === 'cart' ? activeTabStyle : {}), position: 'relative' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {cartCount > 0 && <span style={cartBadgeStyle}>{cartCount}</span>}
        <span>Cart</span>
      </button>
    </>
  );

  const renderFarmerTabs = () => (
    <>
      <button 
        onClick={() => setActiveTab('dashboard')} 
        style={{ ...tabButtonStyle, ...(activeTab === 'dashboard' ? activeTabStyle : {}) }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9"></rect>
          <rect x="14" y="3" width="7" height="5"></rect>
          <rect x="14" y="12" width="7" height="9"></rect>
          <rect x="3" y="16" width="7" height="5"></rect>
        </svg>
        <span>Dashboard</span>
      </button>

      <button 
        onClick={() => setActiveTab('products')} 
        style={{ ...tabButtonStyle, ...(activeTab === 'products' ? activeTabStyle : {}) }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
        <span>Products</span>
      </button>

      <button 
        onClick={() => setActiveTab('orders')} 
        style={{ ...tabButtonStyle, ...(activeTab === 'orders' ? activeTabStyle : {}) }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <span>Orders</span>
      </button>

      <button 
        onClick={() => setActiveTab('earnings')} 
        style={{ ...tabButtonStyle, ...(activeTab === 'earnings' ? activeTabStyle : {}) }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
        <span>Earnings</span>
      </button>
    </>
  );

  const renderDriverTabs = () => (
    <>
      <button 
        onClick={() => setActiveTab('home')} 
        style={{ ...tabButtonStyle, ...(activeTab === 'home' ? activeTabStyle : {}) }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="9" x2="15" y2="9"></line>
          <line x1="9" y1="13" x2="15" y2="13"></line>
          <line x1="9" y1="17" x2="11" y2="17"></line>
        </svg>
        <span>Dashboard</span>
      </button>

      <button 
        onClick={() => setActiveTab('deliveries')} 
        style={{ ...tabButtonStyle, ...(activeTab === 'deliveries' ? activeTabStyle : {}) }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>Pool</span>
      </button>

      <button 
        onClick={() => setActiveTab('earnings')} 
        style={{ ...tabButtonStyle, ...(activeTab === 'earnings' ? activeTabStyle : {}) }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
        <span>Earnings</span>
      </button>
    </>
  );

  return (
    <nav style={navbarStyle} className="glass-panel">
      {activeRole === 'customer' && renderCustomerTabs()}
      {activeRole === 'farmer' && renderFarmerTabs()}
      {activeRole === 'driver' && renderDriverTabs()}
    </nav>
  );
}

const navbarStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: '65px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  padding: '0 12px',
  zIndex: 9999,
  boxShadow: '0 -2px 10px rgba(0,60,20,0.03)',
  borderTop: '1px solid var(--border)'
};

const tabButtonStyle = {
  flex: 1,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  color: 'var(--muted)',
  cursor: 'pointer',
  fontSize: '11px',
  fontWeight: '600',
  transition: 'all 0.2s',
  border: 'none',
  background: 'none'
};

const activeTabStyle = {
  color: 'var(--primary)'
};

const cartBadgeStyle = {
  position: 'absolute',
  top: '4px',
  right: 'calc(50% - 18px)',
  backgroundColor: 'var(--accent)',
  color: 'white',
  borderRadius: '50%',
  width: '16px',
  height: '16px',
  fontSize: '10px',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 4px rgba(0,100,48,0.2)'
};
