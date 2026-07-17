"use client";

import React from 'react';
import { useApp } from '@/lib/AppContext';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import RoleSwitcher from '@/components/RoleSwitcher';

// Customer Views
import CustomerHome from '@/components/CustomerHome';
import CustomerCart from '@/components/CustomerCart';
import CustomerTracking from '@/components/CustomerTracking';

// Farmer Views
import FarmerDashboard from '@/components/FarmerDashboard';
import FarmerInventory from '@/components/FarmerInventory';
import FarmerOrders from '@/components/FarmerOrders';
import FarmerEarnings from '@/components/FarmerEarnings';

// Logistics Driver Views
import DriverDashboard from '@/components/DriverDashboard';
import DriverEarnings from '@/components/DriverEarnings';

export default function Home() {
  const { isLoaded, activeRole, activeTab } = useApp();

  if (!isLoaded) {
    return (
      <div style={loadingContainerStyle}>
        <div style={spinnerStyle}></div>
        <h3 style={loadingTitleStyle}>Loading AgriLink...</h3>
        <p style={loadingDescStyle}>Setting up direct farm-to-table simulation</p>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeRole) {
      case 'customer':
        if (activeTab === 'home') return <CustomerHome />;
        if (activeTab === 'cart') return <CustomerCart />;
        if (activeTab === 'orders') return <CustomerTracking />;
        return <CustomerHome />;

      case 'farmer':
        if (activeTab === 'dashboard') return <FarmerDashboard />;
        if (activeTab === 'products') return <FarmerInventory />;
        if (activeTab === 'orders') return <FarmerOrders />;
        if (activeTab === 'earnings') return <FarmerEarnings />;
        return <FarmerDashboard />;

      case 'driver':
        if (activeTab === 'home') return <DriverDashboard />;
        if (activeTab === 'deliveries') return <DriverDashboard />; // Integrated dispatch board
        if (activeTab === 'earnings') return <DriverEarnings />;
        return <DriverDashboard />;

      default:
        return <CustomerHome />;
    }
  };

  return (
    <div style={rootStyle}>
      {/* Simulation Helper */}
      <RoleSwitcher />

      {/* Main Layout Header */}
      <Header />

      {/* Dynamic Content Frame */}
      <main style={mainFrameStyle}>
        {renderActiveView()}
      </main>

      {/* Main Layout Footer / Bottom Navigation */}
      <Navbar />
    </div>
  );
}

const rootStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--background)'
};

const mainFrameStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column'
};

const loadingContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: 'var(--background)',
  fontFamily: 'var(--font-outfit)',
  gap: '12px'
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '4px solid var(--border)',
  borderTopColor: 'var(--primary)',
  borderRadius: '50%',
  animation: 'pulse 1s infinite linear'
};

const loadingTitleStyle = {
  fontSize: '18px',
  fontWeight: '800',
  color: 'var(--primary)',
  marginTop: '8px'
};

const loadingDescStyle = {
  fontSize: '12px',
  color: 'var(--muted)'
};
