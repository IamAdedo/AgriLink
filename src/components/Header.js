"use client";

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';

export default function Header() {
  const { currentUser, activeRole, notifications, markAllNotificationsRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getRoleLabel = () => {
    switch (activeRole) {
      case 'customer': return 'Consumer Account';
      case 'farmer': return 'Verified Farmer';
      case 'driver': return 'Logistics Partner';
      default: return '';
    }
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      markAllNotificationsRead();
    }
  };

  return (
    <header style={headerStyle} className="glass-panel">
      {/* Brand Logo */}
      <div style={logoContainerStyle}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={leafIconStyle}>
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="var(--primary)" />
          <path d="M12 3C8.5 7.5 7 10.5 7 13.5C7 16.54 9.46 19 12.5 19C15.54 19 18 16.54 18 13.5C18 10.5 16.5 7.5 12 3Z" fill="var(--accent)" opacity="0.85" />
        </svg>
        <span style={logoTextStyle}>Agri<span style={{ color: 'var(--accent)' }}>Link</span></span>
      </div>

      {/* User Actions */}
      <div style={actionsStyle}>
        {/* Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button onClick={handleToggleNotifications} style={bellButtonStyle}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {unreadCount > 0 && <span style={badgeStyle}>{unreadCount}</span>}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={dropdownStyle} className="premium-card animate-scale-in">
              <div style={dropdownHeaderStyle}>
                <h4>Notifications</h4>
                {unreadCount > 0 && <span style={unreadBadgeStyle}>{unreadCount} new</span>}
              </div>
              <div style={dropdownBodyStyle} className="no-scrollbar">
                {notifications.length === 0 ? (
                  <p style={emptyNotifStyle}>No notifications yet.</p>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} style={notifItemStyle}>
                      <div style={notifBulletStyle}></div>
                      <div>
                        <h5 style={notifTitleStyle}>{notif.title}</h5>
                        <p style={notifMsgStyle}>{notif.message}</p>
                        <span style={notifTimeStyle}>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        <div style={userCardStyle}>
          <div style={avatarStyle}>
            {currentUser.fullName.charAt(0)}
          </div>
          <div style={userInfoStyle}>
            <h4 style={userNameStyle}>{currentUser.fullName}</h4>
            <span style={userRoleStyle}>{getRoleLabel()}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

const headerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '70px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  zIndex: 9999,
  boxShadow: '0 2px 10px rgba(0,60,20,0.03)'
};

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const leafIconStyle = {
  transform: 'rotate(-15deg)'
};

const logoTextStyle = {
  fontSize: '22px',
  fontWeight: '800',
  color: 'var(--primary)',
  letterSpacing: '-0.02em',
  fontFamily: 'var(--font-outfit)'
};

const actionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px'
};

const bellButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--foreground)',
  cursor: 'pointer',
  padding: '6px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  transition: 'all 0.2s',
  backgroundColor: 'var(--primary-light)'
};

const badgeStyle = {
  position: 'absolute',
  top: '-2px',
  right: '-2px',
  backgroundColor: 'var(--status-cancelled)',
  color: 'white',
  borderRadius: '50%',
  width: '18px',
  height: '18px',
  fontSize: '10px',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid white'
};

const userCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  backgroundColor: 'white',
  padding: '6px 14px 6px 6px',
  borderRadius: '30px',
  border: '1px solid var(--border)'
};

const avatarStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: 'var(--accent)',
  color: 'white',
  fontSize: '16px',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 6px rgba(0, 100, 48, 0.15)'
};

const userInfoStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const userNameStyle = {
  fontSize: '13px',
  fontWeight: '600',
  color: 'var(--foreground)',
  lineHeight: '1.2'
};

const userRoleStyle = {
  fontSize: '10px',
  color: 'var(--muted)',
  fontWeight: '500'
};

const dropdownStyle = {
  position: 'absolute',
  top: '42px',
  right: '0',
  width: '320px',
  backgroundColor: 'white',
  borderRadius: '16px',
  boxShadow: 'var(--shadow-lg)',
  border: '1px solid var(--border)',
  overflow: 'hidden',
  animation: 'scaleIn 0.2s ease-out'
};

const dropdownHeaderStyle = {
  padding: '12px 16px',
  borderBottom: '1px solid var(--border)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'var(--primary-light)'
};

const unreadBadgeStyle = {
  fontSize: '10px',
  backgroundColor: 'var(--primary)',
  color: 'white',
  padding: '2px 8px',
  borderRadius: '10px',
  fontWeight: '600'
};

const dropdownBodyStyle = {
  maxHeight: '300px',
  overflowY: 'auto',
  padding: '8px 0'
};

const emptyNotifStyle = {
  textAlign: 'center',
  padding: '24px',
  color: 'var(--muted)',
  fontSize: '13px'
};

const notifItemStyle = {
  padding: '12px 16px',
  borderBottom: '1px solid hsl(149, 15%, 96%)',
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-start',
  transition: 'background-color 0.2s'
};

const notifBulletStyle = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: 'var(--accent)',
  marginTop: '7px',
  flexShrink: 0
};

const notifTitleStyle = {
  fontSize: '12px',
  fontWeight: '700',
  color: 'var(--foreground)',
  marginBottom: '2px'
};

const notifMsgStyle = {
  fontSize: '11px',
  color: 'var(--muted)',
  lineHeight: '1.4',
  marginBottom: '4px'
};

const notifTimeStyle = {
  fontSize: '9px',
  color: 'var(--muted)',
  fontWeight: '500'
};
