"use client";

import React, { useEffect, useState } from 'react';
import { useApp } from '@/lib/AppContext';

export default function CustomerTracking() {
  const { orders, deliveries, updateOrderStatus } = useApp();
  const [selectedOrderId, setSelectedOrderId] = useState('');

  // Get active orders (all orders except delivered/cancelled)
  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const pastOrders = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

  useEffect(() => {
    // Auto-select the newest active order if available
    if (activeOrders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(activeOrders[0].id);
    } else if (orders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders, activeOrders, selectedOrderId]);

  const selectedOrder = orders.find(o => o.id === selectedOrderId);
  const selectedDelivery = deliveries.find(d => d.orderId === selectedOrderId);

  // Initialize Leaflet Map for Live Tracking
  useEffect(() => {
    if (typeof window === 'undefined' || !selectedOrder || selectedOrder.status !== 'in_transit' || !selectedDelivery) return;
    
    // Dynamically load leaflet
    const L = require('leaflet');
    
    // Check if container exists
    const mapContainer = document.getElementById('map-customer');
    if (!mapContainer) return;

    // Reset container default icons in Leaflet to prevent broken image references
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const driverLoc = selectedDelivery.currentLocation || [9.0820, 7.4100];
    const farmLoc = [9.0820, 7.4100]; // Abdullahi Farms default
    const consumerLoc = [9.0710, 7.4050]; // Amina Wuse II default

    // Initialize Map
    const map = L.map('map-customer', {
      zoomControl: false
    }).setView(driverLoc, 14);

    // Zoom buttons in bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    // Dynamic Markers using custom DivIcons to ensure they load offline/locally
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

    L.marker(farmLoc, { icon: farmIcon }).addTo(map).bindPopup('<strong>Pickup:</strong> Abdullahi Farms');
    L.marker(consumerLoc, { icon: consumerIcon }).addTo(map).bindPopup('<strong>Drop-off:</strong> Amina (Home)');
    const driverMarker = L.marker(driverLoc, { icon: driverIcon }).addTo(map).bindPopup('<strong>Driver (Tunde):</strong> In Transit').openPopup();

    // Draw route line
    const points = selectedDelivery.routePoints || [farmLoc, consumerLoc];
    L.polyline(points, { 
      color: 'var(--primary)', 
      weight: 4, 
      opacity: 0.8,
      dashArray: '5, 10'
    }).addTo(map);

    // Pan map to follow driver
    map.panTo(driverLoc);

    return () => {
      map.remove();
    };
  }, [selectedOrderId, selectedDelivery, selectedOrder]);

  const handleConfirmDelivery = () => {
    updateOrderStatus(selectedOrderId, 'delivered');
  };

  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'pending': return 0;
      case 'accepted':
      case 'preparing': return 1;
      case 'ready': return 2;
      case 'in_transit': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const steps = [
    { title: 'Order Placed', desc: 'Awaiting farmer response' },
    { title: 'Farmer Preparing', desc: 'Produce being cleaned & packed' },
    { title: 'Ready for Pickup', desc: 'Package waiting for dispatch' },
    { title: 'In Transit', desc: 'Driver is delivering your order' },
    { title: 'Delivered', desc: 'Confirmed and escrow payouts released' }
  ];

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Order Tracking</h2>

      {orders.length === 0 ? (
        <p style={emptyTextStyle}>You have not placed any orders yet.</p>
      ) : (
        <div style={layoutStyle}>
          {/* Active Orders List */}
          <div style={sidebarStyle}>
            <h4 style={sectionHeaderStyle}>Active Orders</h4>
            {activeOrders.length === 0 ? (
              <p style={noActiveStyle}>No active deliveries.</p>
            ) : (
              activeOrders.map(o => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOrderId(o.id)}
                  style={{ ...orderCardStyle, ...(selectedOrderId === o.id ? activeOrderCardStyle : {}) }}
                  className="premium-card"
                >
                  <div style={cardHeaderStyle}>
                    <strong>Order #{o.id.split('-')[1]}</strong>
                    <span style={{ ...statusBadgeStyle, backgroundColor: `var(--status-${o.status})` }}>{o.status.toUpperCase()}</span>
                  </div>
                  <span style={cardSubStyle}>{o.vendorName}</span>
                  <strong style={cardPriceStyle}>₦{o.totalPrice.toLocaleString()}</strong>
                </button>
              ))
            )}

            <h4 style={{ ...sectionHeaderStyle, marginTop: '20px' }}>Past Orders</h4>
            <div style={pastListStyle}>
              {pastOrders.map(o => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOrderId(o.id)}
                  style={{ ...orderCardStyle, ...(selectedOrderId === o.id ? activeOrderCardStyle : {}), opacity: 0.8 }}
                  className="premium-card"
                >
                  <div style={cardHeaderStyle}>
                    <strong>Order #{o.id.split('-')[1]}</strong>
                    <span style={{ ...statusBadgeStyle, backgroundColor: 'var(--status-delivered)' }}>DELIVERED</span>
                  </div>
                  <span style={cardSubStyle}>{o.vendorName}</span>
                  <strong style={cardPriceStyle}>₦{o.totalPrice.toLocaleString()}</strong>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Tracking Details */}
          {selectedOrder && (
            <div style={mainPanelStyle} className="premium-card">
              <div style={detailHeaderStyle}>
                <div>
                  <h3 style={detailTitleStyle}>Order #{selectedOrder.id}</h3>
                  <span style={detailSubStyle}>From: {selectedOrder.vendorName}</span>
                </div>
                <div style={detailTotalStyle}>
                  <span>Total Amount</span>
                  <strong>₦{selectedOrder.totalPrice.toLocaleString()}</strong>
                </div>
              </div>

              {/* Real-time map when in transit */}
              {selectedOrder.status === 'in_transit' && (
                <div style={mapSectionStyle}>
                  <h4 style={mapHeaderStyle}>Live Delivery Route (Abuja)</h4>
                  <div id="map-customer" style={mapContainerStyle}></div>
                  {selectedDelivery && (
                    <div style={driverInfoBarStyle}>
                      <div style={driverAvatarStyle}>T</div>
                      <div>
                        <strong>Tunde Oyelese (Logistics Partner)</strong>
                        <p style={driverSubStyle}>Simulating real-time route navigation</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Status Timeline */}
              <div style={timelineStyle}>
                <h4 style={timelineHeaderStyle}>Order Progress</h4>
                <div style={timelineStepsStyle}>
                  {steps.map((step, idx) => {
                    const activeIndex = getStatusStepIndex(selectedOrder.status);
                    const isCompleted = idx <= activeIndex;
                    const isActive = idx === activeIndex;

                    return (
                      <div key={idx} style={stepRowStyle}>
                        <div style={stepIndicatorStyle}>
                          <div style={{
                            ...stepCircleStyle,
                            backgroundColor: isCompleted ? 'var(--primary)' : 'var(--border)',
                            boxShadow: isActive ? '0 0 0 4px var(--primary-glow)' : 'none'
                          }}>
                            {isCompleted ? '✓' : ''}
                          </div>
                          {idx < steps.length - 1 && (
                            <div style={{
                              ...stepLineStyle,
                              backgroundColor: idx < activeIndex ? 'var(--primary)' : 'var(--border)'
                            }}></div>
                          )}
                        </div>
                        <div style={stepContentStyle}>
                          <h5 style={{ ...stepTitleStyle, color: isCompleted ? 'var(--foreground)' : 'var(--muted)' }}>{step.title}</h5>
                          <p style={stepDescStyle}>{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Confirm Receipt (Only if status is in_transit or ready, or simulating receipt confirmation) */}
              {selectedOrder.status === 'in_transit' && (
                <div style={confirmBoxStyle}>
                  <p style={confirmTextStyle}>Has your order arrived? Clicking below verifies delivery and releases payment from escrow to the farmer.</p>
                  <button onClick={handleConfirmDelivery} style={confirmBtnStyle}>
                    Confirm Delivery Receipt
                  </button>
                </div>
              )}
            </div>
          )}
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

const emptyTextStyle = {
  textAlign: 'center',
  padding: '40px',
  color: 'var(--muted)',
  fontSize: '14px'
};

const layoutStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '24px'
};

// Larger screen styling can split to '1.2fr 2fr' grid, we render cleanly.

const sidebarStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const sectionHeaderStyle = {
  fontSize: '12px',
  fontWeight: '800',
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const noActiveStyle = {
  fontSize: '13px',
  color: 'var(--muted)',
  fontStyle: 'italic',
  padding: '12px 4px'
};

const orderCardStyle = {
  width: '100%',
  padding: '16px',
  textAlign: 'left',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  backgroundColor: 'white'
};

const activeOrderCardStyle = {
  borderColor: 'var(--primary)',
  boxShadow: 'var(--shadow-md)',
  backgroundColor: 'var(--primary-light)'
};

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '13px'
};

const statusBadgeStyle = {
  fontSize: '9px',
  color: 'white',
  padding: '2px 8px',
  borderRadius: '10px',
  fontWeight: '700',
  letterSpacing: '0.05em'
};

const cardSubStyle = {
  fontSize: '11px',
  color: 'var(--muted)'
};

const cardPriceStyle = {
  fontSize: '14px',
  color: 'var(--primary)',
  fontWeight: '850'
};

const pastListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const mainPanelStyle = {
  backgroundColor: 'white',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const detailHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid var(--border)',
  paddingBottom: '16px'
};

const detailTitleStyle = {
  fontSize: '16px',
  fontWeight: '800',
  color: 'var(--foreground)'
};

const detailSubStyle = {
  fontSize: '12px',
  color: 'var(--muted)'
};

const detailTotalStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end'
};

const detailTotalLabel = {
  fontSize: '10px',
  color: 'var(--muted)'
};

const detailTotalStyle2 = {
  fontSize: '16px',
  fontWeight: '800',
  color: 'var(--primary)'
};

const mapSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const mapHeaderStyle = {
  fontSize: '13px',
  fontWeight: '800',
  color: 'var(--muted)',
  textTransform: 'uppercase'
};

const mapContainerStyle = {
  height: '240px',
  width: '100%',
  borderRadius: '12px',
  border: '1px solid var(--border)',
  overflow: 'hidden',
  boxShadow: 'var(--shadow-sm)'
};

const driverInfoBarStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  backgroundColor: 'var(--background)',
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid var(--border)'
};

const driverAvatarStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: '#df8502',
  color: 'white',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const driverSubStyle = {
  fontSize: '10px',
  color: 'var(--muted)'
};

const timelineStyle = {
  marginTop: '10px'
};

const timelineHeaderStyle = {
  fontSize: '13px',
  fontWeight: '800',
  color: 'var(--muted)',
  textTransform: 'uppercase',
  marginBottom: '16px'
};

const timelineStepsStyle = {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative'
};

const stepRowStyle = {
  display: 'flex',
  gap: '16px',
  paddingBottom: '20px',
  position: 'relative'
};

const stepIndicatorStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  width: '24px'
};

const stepCircleStyle = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  color: 'white',
  fontSize: '12px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
  transition: 'all 0.3s'
};

const stepLineStyle = {
  width: '2px',
  height: '100%',
  position: 'absolute',
  top: '24px',
  bottom: 0,
  zIndex: 1,
  transition: 'all 0.3s'
};

const stepContentStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const stepTitleStyle = {
  fontSize: '13px',
  fontWeight: '700',
  lineHeight: '1.2',
  marginBottom: '2px'
};

const stepDescStyle = {
  fontSize: '11px',
  color: 'var(--muted)',
  lineHeight: '1.3'
};

const confirmBoxStyle = {
  backgroundColor: 'var(--primary-light)',
  padding: '16px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid rgba(0, 100, 48, 0.1)',
  textAlign: 'center'
};

const confirmTextStyle = {
  fontSize: '12px',
  color: 'var(--muted)',
  lineHeight: '1.4',
  marginBottom: '12px'
};

const confirmBtnStyle = {
  backgroundColor: 'var(--primary)',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '20px',
  fontWeight: '700',
  fontSize: '12px',
  cursor: 'pointer',
  border: 'none',
  boxShadow: 'var(--shadow-sm)'
};
