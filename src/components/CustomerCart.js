"use client";

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';

export default function CustomerCart() {
  const { cart, updateCartQuantity, removeFromCart, placeOrder, setActiveTab } = useApp();
  const [deliverySlot, setDeliverySlot] = useState('morning_9_12');
  const [address, setAddress] = useState('Plot 104, Wuse II, Abuja, Nigeria');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  const deliveryFee = cart.length > 0 ? 500 : 0;
  const serviceFee = cart.length > 0 ? 200 : 0;
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const total = subtotal + deliveryFee + serviceFee;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const orderId = placeOrder(deliverySlot, address);
    if (orderId) {
      setPlacedOrderId(orderId);
      setCheckoutSuccess(true);
    }
  };

  const handleViewOrder = () => {
    setActiveTab('orders');
  };

  if (checkoutSuccess) {
    return (
      <div style={successContainerStyle}>
        <div style={successCardStyle} className="premium-card">
          <div style={successBadgeStyle}>✓</div>
          <h2 style={successTitleStyle}>Order Placed Successfully!</h2>
          <p style={successDescStyle}>Your order <strong>{placedOrderId}</strong> has been sent to the farmer. They are preparing your fresh harvests now.</p>
          <div style={successDetailsStyle}>
            <div style={successRowStyle}>
              <span>Estimated Delivery:</span>
              <strong>Today, {deliverySlot === 'morning_9_12' ? '9:00 AM - 12:00 PM' : deliverySlot === 'afternoon_14_17' ? '2:00 PM - 5:00 PM' : '6:00 PM - 8:00 PM'}</strong>
            </div>
            <div style={successRowStyle}>
              <span>Address:</span>
              <strong>{address}</strong>
            </div>
          </div>
          <button onClick={handleViewOrder} style={viewOrderBtnStyle}>Track Order Live</button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Shopping Cart</h2>

      {cart.length === 0 ? (
        <div style={emptyCartStyle}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p style={emptyTextStyle}>Your cart is empty.</p>
          <button onClick={() => setActiveTab('home')} style={shopBtnStyle}>Browse Products</button>
        </div>
      ) : (
        <div style={layoutStyle}>
          {/* Items List */}
          <div style={itemsSectionStyle}>
            <h3 style={sectionHeaderStyle}>Items</h3>
            <div style={itemsListStyle}>
              {cart.map((item) => (
                <div key={item.product.id} style={cartItemCardStyle} className="premium-card">
                  <img src={item.product.imageUrl} alt={item.product.name} style={itemImgStyle} />
                  <div style={itemDetailsStyle}>
                    <span style={itemVendorStyle}>{item.product.vendorName}</span>
                    <h4 style={itemNameStyle}>{item.product.name}</h4>
                    <span style={itemPriceStyle}>₦{item.product.price.toLocaleString()} / {item.product.unit}</span>
                  </div>
                  <div style={itemActionsStyle}>
                    <div style={quantityStyle}>
                      <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} style={qtyBtnStyle}>-</button>
                      <span style={qtyValueStyle}>{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} style={qtyBtnStyle}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} style={removeBtnStyle}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Schedule Options */}
            <h3 style={sectionHeaderStyle}>Choose Delivery Time</h3>
            <div style={slotsWrapperStyle}>
              <button 
                onClick={() => setDeliverySlot('morning_9_12')}
                style={{ ...slotBtnStyle, ...(deliverySlot === 'morning_9_12' ? activeSlotBtnStyle : {}) }}
              >
                🌅 Morning (9am - 12pm)
              </button>
              <button 
                onClick={() => setDeliverySlot('afternoon_14_17')}
                style={{ ...slotBtnStyle, ...(deliverySlot === 'afternoon_14_17' ? activeSlotBtnStyle : {}) }}
              >
                ☀️ Afternoon (2pm - 5pm)
              </button>
              <button 
                onClick={() => setDeliverySlot('evening_18_20')}
                style={{ ...slotBtnStyle, ...(deliverySlot === 'evening_18_20' ? activeSlotBtnStyle : {}) }}
              >
                🌆 Evening (6pm - 8pm)
              </button>
            </div>

            {/* Address */}
            <h3 style={sectionHeaderStyle}>Delivery Address</h3>
            <textarea 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={addressInputStyle}
              placeholder="Enter your complete delivery address in Abuja"
            />
          </div>

          {/* Pricing & Checkout Summary */}
          <div style={summarySectionStyle} className="premium-card">
            <h3 style={summaryHeaderStyle}>Checkout Summary</h3>
            <div style={summaryRowStyle}>
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div style={summaryRowStyle}>
              <span>Delivery Fee</span>
              <span>₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div style={summaryRowStyle}>
              <span>Service Fee</span>
              <span>₦{serviceFee.toLocaleString()}</span>
            </div>
            <hr style={dividerStyle} />
            <div style={totalRowStyle}>
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>

            {/* Mock Secure Payment Info */}
            <div style={paymentCardStyle}>
              <div style={paymentHeaderStyle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                </svg>
                <strong>Secure Payment via Paystack</strong>
              </div>
              <p style={paymentDescStyle}>Securely held in escrow. Payout occurs only after successful delivery verification.</p>
            </div>

            <button onClick={handleCheckout} style={checkoutBtnStyle}>
              Confirm & Pay ₦{total.toLocaleString()}
            </button>
          </div>
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

const emptyCartStyle = {
  textAlign: 'center',
  padding: '60px 24px',
  color: 'var(--muted)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px'
};

const emptyTextStyle = {
  fontSize: '14px',
  fontWeight: '600'
};

const shopBtnStyle = {
  backgroundColor: 'var(--primary)',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '24px',
  fontWeight: '700',
  cursor: 'pointer',
  border: 'none',
  marginTop: '8px',
  boxShadow: 'var(--shadow-sm)'
};

const layoutStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '24px',
  alignItems: 'flex-start'
};

// When screen is wider, change layoutStyle to:
// '@media (min-width: 768px)': { gridTemplateColumns: '1.6fr 1fr' }
// Next.js CSS classes or responsive inline styling handles this in unified pages, we'll lay them out logically.

const itemsSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const sectionHeaderStyle = {
  fontSize: '14px',
  fontWeight: '800',
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginTop: '10px'
};

const itemsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const cartItemCardStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px',
  gap: '14px'
};

const itemImgStyle = {
  width: '60px',
  height: '60px',
  borderRadius: 'var(--radius-sm)',
  objectFit: 'cover'
};

const itemDetailsStyle = {
  flex: 1
};

const itemVendorStyle = {
  fontSize: '9px',
  fontWeight: '600',
  color: 'var(--muted)',
  textTransform: 'uppercase'
};

const itemNameStyle = {
  fontSize: '13px',
  fontWeight: '700',
  color: 'var(--foreground)',
  lineHeight: '1.2',
  margin: '2px 0'
};

const itemPriceStyle = {
  fontSize: '12px',
  color: 'var(--primary)',
  fontWeight: '700'
};

const itemActionsStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '8px'
};

const quantityStyle = {
  display: 'flex',
  alignItems: 'center',
  border: '1px solid var(--border)',
  borderRadius: '16px',
  backgroundColor: 'var(--primary-light)',
  padding: '2px'
};

const qtyBtnStyle = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: 'white',
  color: 'var(--primary)',
  fontSize: '14px',
  fontWeight: '700',
  cursor: 'pointer',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const qtyValueStyle = {
  fontSize: '13px',
  fontWeight: '700',
  padding: '0 8px',
  minWidth: '24px',
  textAlign: 'center'
};

const removeBtnStyle = {
  fontSize: '11px',
  color: 'var(--status-cancelled)',
  fontWeight: '600',
  cursor: 'pointer',
  background: 'none',
  border: 'none'
};

const slotsWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const slotBtnStyle = {
  padding: '12px 16px',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'white',
  border: '1px solid var(--border)',
  color: 'var(--foreground)',
  fontWeight: '600',
  fontSize: '13px',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

const activeSlotBtnStyle = {
  backgroundColor: 'var(--primary-light)',
  borderColor: 'var(--primary)',
  color: 'var(--primary)',
  boxShadow: 'inset 0 0 0 1px var(--primary)'
};

const addressInputStyle = {
  width: '100%',
  height: '70px',
  padding: '12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  backgroundColor: 'white',
  fontSize: '13px',
  resize: 'none',
  color: 'var(--foreground)'
};

const summarySectionStyle = {
  padding: '20px',
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const summaryHeaderStyle = {
  fontSize: '15px',
  fontWeight: '800',
  color: 'var(--foreground)',
  marginBottom: '4px'
};

const summaryRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '13px',
  color: 'var(--muted)',
  fontWeight: '500'
};

const dividerStyle = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '4px 0'
};

const totalRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '16px',
  fontWeight: '800',
  color: 'var(--foreground)'
};

const paymentCardStyle = {
  backgroundColor: 'var(--primary-light)',
  padding: '12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid rgba(0, 100, 48, 0.1)',
  marginTop: '8px'
};

const paymentHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '11px',
  color: 'var(--primary)',
  marginBottom: '4px'
};

const paymentDescStyle = {
  fontSize: '10px',
  color: 'var(--muted)',
  lineHeight: '1.3'
};

const checkoutBtnStyle = {
  width: '100%',
  backgroundColor: 'var(--primary)',
  color: 'white',
  padding: '14px',
  borderRadius: '24px',
  fontWeight: '800',
  fontSize: '14px',
  cursor: 'pointer',
  border: 'none',
  boxShadow: 'var(--shadow-sm)',
  textAlign: 'center',
  marginTop: '10px'
};

// Success state styling
const successContainerStyle = {
  padding: '120px 16px 80px 16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '80vh',
  animation: 'scaleIn 0.3s ease-out'
};

const successCardStyle = {
  backgroundColor: 'white',
  maxWidth: '450px',
  width: '100%',
  padding: '40px 24px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const successBadgeStyle = {
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  backgroundColor: 'var(--accent)',
  color: 'white',
  fontSize: '28px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
  boxShadow: '0 8px 20px rgba(0, 100, 48, 0.2)'
};

const successTitleStyle = {
  fontSize: '20px',
  fontWeight: '800',
  color: 'var(--foreground)',
  marginBottom: '8px'
};

const successDescStyle = {
  fontSize: '13px',
  color: 'var(--muted)',
  lineHeight: '1.4',
  marginBottom: '24px'
};

const successDetailsStyle = {
  width: '100%',
  backgroundColor: 'var(--background)',
  borderRadius: 'var(--radius-sm)',
  padding: '16px',
  marginBottom: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  textAlign: 'left'
};

const successRowStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  fontSize: '12px',
  color: 'var(--muted)'
};

const viewOrderBtnStyle = {
  backgroundColor: 'var(--primary)',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '24px',
  fontWeight: '800',
  fontSize: '13px',
  cursor: 'pointer',
  border: 'none',
  width: '100%',
  boxShadow: 'var(--shadow-sm)'
};
