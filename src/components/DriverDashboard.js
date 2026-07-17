"use client";

import React, { useEffect } from 'react';
import { useApp } from '@/lib/AppContext';

export default function DriverDashboard() {
  const { deliveries, orders, acceptDeliveryJob, updateDeliveryStatus, simulateDriverMovement } = useApp();

  // Find deliveries associated with this driver (Tunde)
  const myDeliveries = deliveries.filter(d => d.driverId === 'user-tunde');
  const activeDelivery = myDeliveries.find(d => d.status !== 'completed');
  
  // Open deliveries available to claim (status 'assigned' & driverId null)
  const openJobs = deliveries.filter(d => d.status === 'assigned' && d.driverId === null);
  
  // Delivery stats
  const completedCount = myDeliveries.filter(d => d.status === 'completed').length;
  const inTransitCount = myDeliveries.filter(d => d.status === 'delivering' || d.status === 'picking_up').length;
  const pendingJobsCount = openJobs.length;

  const activeOrder = activeDelivery ? orders.find(o => o.id === activeDelivery.orderId) : null;

  // Initialize Leaflet Map for Driver routing
  useEffect(() => {
    if (typeof window === 'undefined' || !activeDelivery) return;

    const L = require('leaflet');
    const mapContainer = document.getElementById('map-driver');
    if (!mapContainer) return;

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const driverLoc = activeDelivery.currentLocation || [9.0820, 7.4100];
    const farmLoc = [9.0820, 7.4100];
    const consumerLoc = [9.0710, 7.4050];

    const map = L.map('map-driver', { zoomControl: false }).setView(driverLoc, 14);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const farmIcon = L.divIcon({
      html: `<div style="font-size: 24px; background: white; border-radius: 50%; padding: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); display:flex; align-items:center; justify-content:center; width:36px; height:36px; border: 2px solid var(--primary)">🚜</div>`,
      className: 'custom-icon',
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const consumerIcon = L.divIcon({
      html: `<div style="font-size: 24px; background: white; border-radius: 50%; padding: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); display:flex; align-items:center; justify-content:center; width:36px; height:36px; border: 2px solid var(--accent)">🏠</div>`,
      className: 'custom-icon',
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const driverIcon = L.divIcon({
      html: `<div style="font-size: 24px; background: white; border-radius: 50%; padding: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; width:38px; height:38px; border: 2px solid #df8502; animation: pulse 1.5s infinite">🛵</div>`,
      className: 'custom-icon',
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    L.marker(farmLoc, { icon: farmIcon }).addTo(map).bindPopup('Abdullahi Farms');
    L.marker(consumerLoc, { icon: consumerIcon }).addTo(map).bindPopup('Amina (Home)');
    L.marker(driverLoc, { icon: driverIcon }).addTo(map).bindPopup('You are here').openPopup();

    const points = activeDelivery.routePoints || [farmLoc, consumerLoc];
    L.polyline(points, { color: 'var(--primary)', weight: 4, opacity: 0.8, dashArray: '5, 10' }).addTo(map);

    map.panTo(driverLoc);

    return () => {
      map.remove();
    };
  }, [activeDelivery]);

  const handleAcceptJob = (orderId) => {
    acceptDeliveryJob(orderId, 'user-tunde', 'Tunde Oyelese');
  };

  const handleUpdateStatus = (status) => {
    if (!activeDelivery) return;
    updateDeliveryStatus(activeDelivery.id, status);
  };

  const handleSimulateStep = () => {
    if (!activeDelivery) return;
    simulateDriverMovement(activeDelivery.id);
  };

  return (
    <div style={containerStyle}>
      {/* Welcome Greeting */}
      <div style={welcomeStyle}>
        <span style={helloTextStyle}>Welcome, Tunde 🚚</span>
        <h2 style={subTextStyle}>You have {inTransitCount + pendingJobsCount} deliveries to process today.</h2>
      </div>

      {/* Summary Cards Row */}
      <div style={statsRowStyle}>
        <div style={statCardStyle} className="premium-card">
          <span style={statValStyle}>{pendingJobsCount}</span>
          <span style={statLabelStyle}>Jobs in Pool</span>
        </div>
        <div style={statCardStyle} className="premium-card">
          <span style={{ ...statValStyle, color: '#df8502' }}>{inTransitCount}</span>
          <span style={statLabelStyle}>In Transit</span>
        </div>
        <div style={statCardStyle} className="premium-card">
          <span style={{ ...statValStyle, color: 'var(--status-delivered)' }}>{completedCount}</span>
          <span style={statLabelStyle}>Completed</span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={layoutStyle}>
        
        {/* Active Transit Delivery Ticket */}
        <div style={activeSectionStyle}>
          <h3 style={sectionTitleStyle}>Current Active Dispatch</h3>
          {activeDelivery ? (
            <div style={activeTicketCardStyle} className="premium-card">
              <div style={ticketHeaderStyle}>
                <div>
                  <h4 style={ticketTitleStyle}>Order #{activeDelivery.orderId.split('-')[1]}</h4>
                  <span style={ticketRewardStyle}>📦 Reward: ₦1,200</span>
                </div>
                <span style={{ ...statusBadgeStyle, backgroundColor: activeDelivery.status === 'picking_up' ? '#df8502' : 'var(--primary)' }}>
                  {activeDelivery.status.toUpperCase()}
                </span>
              </div>

              <div style={ticketAddressesStyle}>
                <div style={addressRowStyle}>
                  <span style={dotStyle}>🟢</span>
                  <div>
                    <span style={addressTitleStyle}>Pickup Farm:</span>
                    <strong style={addressTextStyle}>{activeOrder ? activeOrder.vendorName : 'Abdullahi Farms'}</strong>
                  </div>
                </div>
                <div style={addressRowStyle}>
                  <span style={{ ...dotStyle, color: 'var(--accent)' }}>🔴</span>
                  <div>
                    <span style={addressTitleStyle}>Recipient Destination:</span>
                    <strong style={addressTextStyle}>{activeOrder ? activeOrder.deliveryAddress : 'Plot 104, Wuse II, Abuja'}</strong>
                  </div>
                </div>
              </div>

              {/* Leaflet Routing Map */}
              <div style={mapWrapperStyle}>
                <div id="map-driver" style={mapStyle}></div>
                
                {/* Simulator controls overlaid on map */}
                {activeDelivery.status === 'delivering' && (
                  <div style={simOverlayStyle}>
                    <span style={simLabelStyle}>Route Playback Simulator</span>
                    <button onClick={handleSimulateStep} style={simBtnStyle}>
                      ▶ Simulate Next GPS Ping
                    </button>
                  </div>
                )}
              </div>

              <div style={ticketFooterStyle}>
                {activeDelivery.status === 'picking_up' && (
                  <button 
                    onClick={() => handleUpdateStatus('delivering')} 
                    style={primaryActionBtnStyle}
                  >
                    Confirm Farm Pickup
                  </button>
                )}
                {activeDelivery.status === 'delivering' && (
                  <button 
                    onClick={() => handleUpdateStatus('completed')} 
                    style={{ ...primaryActionBtnStyle, backgroundColor: 'var(--status-delivered)' }}
                  >
                    Mark Job Completed
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div style={emptyCardStyle} className="premium-card">
              <p style={emptyTextStyle}>You do not have any active delivery. Accept a job from the pool below to start.</p>
            </div>
          )}
        </div>

        {/* Job Pool Board */}
        <div style={poolSectionStyle}>
          <h3 style={sectionTitleStyle}>Available Deliveries Pool ({openJobs.length})</h3>
          {openJobs.length === 0 ? (
            <div style={emptyPoolCardStyle} className="premium-card">
              <p style={emptyTextStyle}>No packages currently waiting for pickup.</p>
            </div>
          ) : (
            <div style={poolListStyle}>
              {openJobs.map(job => {
                const associatedOrder = orders.find(o => o.id === job.orderId) || {};
                return (
                  <div key={job.id} style={jobCardStyle} className="premium-card">
                    <div style={jobHeaderStyle}>
                      <div>
                        <strong>Order #{job.orderId.split('-')[1]}</strong>
                        <p style={jobSubStyle}>From: {associatedOrder.vendorName || 'Abdullahi Farms'}</p>
                      </div>
                      <strong style={jobPriceStyle}>₦1,200</strong>
                    </div>
                    <div style={jobBodyStyle}>
                      <span>Drop-off Destination:</span>
                      <strong style={jobAddressStyle}>{associatedOrder.deliveryAddress || 'Wuse II, Abuja'}</strong>
                      <span>Slot: <strong>{associatedOrder.deliverySlot?.replace('_', ' ').toUpperCase() || 'MORNING'}</strong></span>
                    </div>
                    <button 
                      onClick={() => handleAcceptJob(job.orderId)} 
                      style={acceptBtnStyle}
                      disabled={!!activeDelivery}
                      title={activeDelivery ? "Complete your active delivery first" : "Accept job"}
                    >
                      Accept Delivery
                    </button>
                  </div>
                );
              })}
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

const statsRowStyle = {
  display: 'flex',
  gap: '12px',
  marginBottom: '24px'
};

const statCardStyle = {
  flex: 1,
  backgroundColor: 'white',
  padding: '16px 12px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const statValStyle = {
  fontSize: '22px',
  fontWeight: '800',
  color: 'var(--primary)'
};

const statLabelStyle = {
  fontSize: '10px',
  fontWeight: '600',
  color: 'var(--muted)',
  textTransform: 'uppercase'
};

const layoutStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '24px'
};

// Desktop screens split layout to 1.6fr 1fr

const activeSectionStyle = {
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

const activeTicketCardStyle = {
  backgroundColor: 'white',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const ticketHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start'
};

const ticketTitleStyle = {
  fontSize: '15px',
  fontWeight: '800',
  color: 'var(--foreground)'
};

const ticketRewardStyle = {
  fontSize: '11px',
  color: 'var(--accent)',
  fontWeight: '700'
};

const statusBadgeStyle = {
  fontSize: '9px',
  color: 'white',
  padding: '2px 8px',
  borderRadius: '10px',
  fontWeight: '700',
  letterSpacing: '0.05em'
};

const ticketAddressesStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  backgroundColor: 'var(--background)',
  padding: '12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)'
};

const addressRowStyle = {
  display: 'flex',
  gap: '10px',
  alignItems: 'flex-start'
};

const dotStyle = {
  fontSize: '10px',
  marginTop: '2px'
};

const addressTitleStyle = {
  fontSize: '10px',
  color: 'var(--muted)',
  display: 'block'
};

const addressTextStyle = {
  fontSize: '12px',
  color: 'var(--foreground)'
};

const mapWrapperStyle = {
  position: 'relative',
  borderRadius: '12px',
  border: '1px solid var(--border)',
  overflow: 'hidden',
  boxShadow: 'var(--shadow-sm)'
};

const mapStyle = {
  height: '220px',
  width: '100%'
};

const simOverlayStyle = {
  position: 'absolute',
  top: '12px',
  left: '12px',
  backgroundColor: 'rgba(255,255,255,0.92)',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  zIndex: 1000
};

const simLabelStyle = {
  fontSize: '9px',
  fontWeight: '700',
  color: 'var(--muted)',
  textTransform: 'uppercase'
};

const simBtnStyle = {
  padding: '6px 12px',
  backgroundColor: '#df8502',
  color: 'white',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '700',
  cursor: 'pointer',
  border: 'none',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const ticketFooterStyle = {
  marginTop: '4px'
};

const primaryActionBtnStyle = {
  width: '100%',
  backgroundColor: 'var(--primary)',
  color: 'white',
  padding: '12px',
  borderRadius: '24px',
  fontWeight: '800',
  fontSize: '13px',
  cursor: 'pointer',
  border: 'none',
  boxShadow: 'var(--shadow-sm)'
};

const poolSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const emptyPoolCardStyle = {
  padding: '30px 16px',
  backgroundColor: 'white',
  textAlign: 'center'
};

const poolListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const jobCardStyle = {
  backgroundColor: 'white',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const jobHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start'
};

const jobSubStyle = {
  fontSize: '11px',
  color: 'var(--muted)',
  marginTop: '2px'
};

const jobPriceStyle = {
  fontSize: '15px',
  color: 'var(--accent)',
  fontWeight: '800'
};

const jobBodyStyle = {
  fontSize: '11px',
  color: 'var(--muted)',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px'
};

const jobAddressStyle = {
  fontSize: '12px',
  color: 'var(--foreground)',
  marginBottom: '4px'
};

const acceptBtnStyle = {
  backgroundColor: 'var(--primary)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '16px',
  fontSize: '12px',
  fontWeight: '700',
  cursor: 'pointer',
  border: 'none',
  alignSelf: 'flex-end',
  boxShadow: 'var(--shadow-sm)',
  transition: 'opacity 0.2s',
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
};
