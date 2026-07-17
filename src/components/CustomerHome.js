"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';

export default function CustomerHome() {
  const { products, addToCart, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy'];

  // Fetch AI recommendations from local API Route (which uses Gemini)
  useEffect(() => {
    async function fetchAiSuggestions() {
      setAiLoading(true);
      try {
        const response = await fetch('/api/ai-suggest?role=customer');
        const data = await response.json();
        setAiSuggestions(data.suggestions);
      } catch (e) {
        console.error("Failed to load AI suggestions", e);
        // Fallback recommendations if offline
        setAiSuggestions([
          { title: "Tomato & Pepper Stew Combo", desc: "Get 2kg Fresh Tomatoes and 1kg Pepper for the perfect traditional stew.", discount: "Save 10%" },
          { title: "Sweet Corn & Butter Breakfast", desc: "Combine Abdullahi Farms' fresh yellow maize with organic farm butter.", discount: "Highly Recommended" }
        ]);
      } finally {
        setAiLoading(false);
      }
    }
    fetchAiSuggestions();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={containerStyle}>
      {/* Welcome Message */}
      <div style={welcomeStyle}>
        <span style={helloTextStyle}>Hello, Amina 👋</span>
        <h2 style={subTextStyle}>What fresh produce are you looking for today?</h2>
      </div>

      {/* Search Input */}
      <div style={searchContainerStyle}>
        <svg style={searchIconStyle} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          placeholder="Search fresh vegetables, fruits, local sellers..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      {/* Promotion Card */}
      <div style={promoCardStyle}>
        <div style={promoContentStyle}>
          <span style={promoLabelStyle}>FRESH FROM THE FARM</span>
          <h3 style={promoTitleStyle}>100% Organic & Clean</h3>
          <p style={promoDescStyle}>Supporting local Nigerian farmers. Fast home deliveries to your doorstep in Abuja.</p>
          <button style={promoBtnStyle}>Shop Best Sellers</button>
        </div>
        <div style={promoImageContainerStyle}>
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60" 
            alt="Fresh produce basket"
            style={promoImgStyle}
          />
        </div>
      </div>

      {/* Categories Row */}
      <div style={sectionHeaderStyle}>
        <h3 style={sectionTitleStyle}>Categories</h3>
      </div>
      <div style={categoriesWrapperStyle} className="no-scrollbar">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              ...categoryBtnStyle,
              ...(selectedCategory === cat ? activeCategoryBtnStyle : {})
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div style={sectionHeaderStyle}>
        <h3 style={sectionTitleStyle}>Best Sellers</h3>
        <span style={seeAllStyle}>See All ({filteredProducts.length})</span>
      </div>

      {filteredProducts.length === 0 ? (
        <p style={emptyGridStyle}>No matching produce found nearby.</p>
      ) : (
        <div style={gridStyle}>
          {filteredProducts.map((prod) => (
            <div key={prod.id} className="premium-card" style={productCardStyle}>
              <div style={cardImageWrapperStyle}>
                <img src={prod.imageUrl} alt={prod.name} style={productImgStyle} />
                {prod.isSeasonal && <span style={seasonalBadgeStyle}>Seasonal</span>}
              </div>
              <div style={cardBodyStyle}>
                <span style={vendorNameStyle}>{prod.vendorName}</span>
                <h4 style={productNameStyle}>{prod.name}</h4>
                <p style={productDescStyle}>{prod.description}</p>
                <div style={cardFooterStyle}>
                  <div style={priceContainerStyle}>
                    <span style={priceStyle}>₦{prod.price.toLocaleString()}</span>
                    <span style={unitStyle}>/ {prod.unit}</span>
                  </div>
                  {prod.stock === 0 ? (
                    <span style={outOfStockStyle}>Sold Out</span>
                  ) : (
                    <button 
                      onClick={() => addToCart(prod, 1)}
                      style={addBtnStyle}
                      title="Add to Cart"
                    >
                      +
                    </button>
                  )}
                </div>
                <div style={stockTextStyle}>
                  {prod.stock <= 10 && prod.stock > 0 ? (
                    <span style={lowStockStyle}>Only {prod.stock} left!</span>
                  ) : (
                    <span style={inStockStyle}>In stock</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Recommendations Panel */}
      <div style={aiPanelStyle} className="premium-card">
        <div style={aiHeaderStyle}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          <div>
            <h3 style={aiTitleStyle}>AI Smart Recommendations</h3>
            <p style={aiSubTitleStyle}>Personalized recipe combos using current seasonal farm harvests</p>
          </div>
        </div>
        {aiLoading ? (
          <p style={aiLoadingStyle}>Analyzing local harvest dates...</p>
        ) : (
          <div style={aiListStyle}>
            {aiSuggestions && aiSuggestions.map((item, idx) => (
              <div key={idx} style={aiItemStyle}>
                <span style={aiBadgeStyle}>{item.discount}</span>
                <h4 style={aiItemTitleStyle}>{item.title}</h4>
                <p style={aiItemDescStyle}>{item.desc}</p>
              </div>
            ))}
          </div>
        )}
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

const searchContainerStyle = {
  position: 'relative',
  marginBottom: '24px'
};

const searchIconStyle = {
  position: 'absolute',
  top: '50%',
  left: '16px',
  transform: 'translateY(-50%)',
  color: 'var(--muted)'
};

const searchInputStyle = {
  width: '100%',
  padding: '14px 16px 14px 44px',
  borderRadius: '24px',
  border: '1px solid var(--border)',
  backgroundColor: 'white',
  fontSize: '14px',
  boxShadow: 'var(--shadow-sm)',
  transition: 'all 0.2s',
  ':focus': {
    borderColor: 'var(--primary)',
    boxShadow: '0 0 0 3px var(--primary-glow)'
  }
};

const promoCardStyle = {
  background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
  color: 'white',
  borderRadius: 'var(--radius-md)',
  padding: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  marginBottom: '30px',
  overflow: 'hidden',
  position: 'relative',
  boxShadow: 'var(--shadow-md)'
};

const promoContentStyle = {
  flex: 1,
  zIndex: 2
};

const promoLabelStyle = {
  fontSize: '10px',
  fontWeight: '800',
  letterSpacing: '0.15em',
  color: 'var(--accent-light)',
  display: 'block',
  marginBottom: '6px'
};

const promoTitleStyle = {
  fontSize: '22px',
  fontWeight: '800',
  lineHeight: '1.2',
  marginBottom: '8px'
};

const promoDescStyle = {
  fontSize: '12px',
  opacity: '0.85',
  lineHeight: '1.4',
  marginBottom: '16px'
};

const promoBtnStyle = {
  backgroundColor: 'var(--accent)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '700',
  cursor: 'pointer',
  border: 'none',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};

const promoImageContainerStyle = {
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  overflow: 'hidden',
  border: '4px solid rgba(255,255,255,0.2)',
  flexShrink: 0
};

const promoImgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const sectionHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '14px',
  marginTop: '10px'
};

const sectionTitleStyle = {
  fontSize: '16px',
  fontWeight: '800',
  color: 'var(--foreground)',
  letterSpacing: '-0.01em'
};

const seeAllStyle = {
  fontSize: '12px',
  color: 'var(--accent)',
  fontWeight: '600',
  cursor: 'pointer'
};

const categoriesWrapperStyle = {
  display: 'flex',
  gap: '10px',
  overflowX: 'auto',
  paddingBottom: '8px',
  marginBottom: '24px'
};

const categoryBtnStyle = {
  padding: '8px 16px',
  borderRadius: '20px',
  backgroundColor: 'white',
  border: '1px solid var(--border)',
  color: 'var(--foreground)',
  fontSize: '13px',
  fontWeight: '600',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

const activeCategoryBtnStyle = {
  backgroundColor: 'var(--primary)',
  color: 'white',
  borderColor: 'var(--primary)',
  boxShadow: '0 4px 10px rgba(0,100,48,0.15)'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
  gap: '16px',
  marginBottom: '32px'
};

const productCardStyle = {
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
};

const cardImageWrapperStyle = {
  position: 'relative',
  height: '120px',
  backgroundColor: 'var(--primary-light)',
  overflow: 'hidden'
};

const productImgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const seasonalBadgeStyle = {
  position: 'absolute',
  top: '8px',
  left: '8px',
  backgroundColor: 'var(--accent)',
  color: 'white',
  fontSize: '9px',
  fontWeight: '800',
  padding: '2px 8px',
  borderRadius: '10px',
  letterSpacing: '0.05em'
};

const cardBodyStyle = {
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  flex: 1
};

const vendorNameStyle = {
  fontSize: '10px',
  color: 'var(--muted)',
  fontWeight: '600',
  textTransform: 'uppercase',
  marginBottom: '2px'
};

const productNameStyle = {
  fontSize: '14px',
  fontWeight: '700',
  color: 'var(--foreground)',
  lineHeight: '1.2',
  marginBottom: '4px'
};

const productDescStyle = {
  fontSize: '11px',
  color: 'var(--muted)',
  lineHeight: '1.3',
  marginBottom: '8px',
  display: '-webkit-box',
  WebkitLineClamp: '2',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  flex: 1
};

const cardFooterStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto'
};

const priceContainerStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const priceStyle = {
  fontSize: '15px',
  fontWeight: '800',
  color: 'var(--primary)'
};

const unitStyle = {
  fontSize: '9px',
  color: 'var(--muted)',
  fontWeight: '500'
};

const addBtnStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  backgroundColor: 'var(--primary)',
  color: 'white',
  fontSize: '18px',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  border: 'none',
  transition: 'transform 0.1s',
  ':active': {
    transform: 'scale(0.9)'
  }
};

const outOfStockStyle = {
  fontSize: '10px',
  color: 'var(--status-cancelled)',
  fontWeight: '700'
};

const stockTextStyle = {
  fontSize: '10px',
  marginTop: '6px'
};

const lowStockStyle = {
  color: 'var(--status-pending)',
  fontWeight: '700'
};

const inStockStyle = {
  color: 'var(--status-delivered)',
  fontWeight: '600'
};

const emptyGridStyle = {
  textAlign: 'center',
  padding: '36px 0',
  color: 'var(--muted)',
  fontSize: '14px'
};

const aiPanelStyle = {
  padding: '20px',
  background: 'linear-gradient(135deg, #ffffff, var(--primary-light))',
  border: '1px solid rgba(0, 100, 48, 0.1)',
  marginTop: '20px',
  borderRadius: 'var(--radius-md)'
};

const aiHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  color: 'var(--primary)',
  marginBottom: '16px'
};

const aiTitleStyle = {
  fontSize: '15px',
  fontWeight: '800',
  color: 'var(--primary)'
};

const aiSubTitleStyle = {
  fontSize: '11px',
  color: 'var(--muted)'
};

const aiLoadingStyle = {
  fontSize: '12px',
  color: 'var(--muted)',
  fontStyle: 'italic'
};

const aiListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const aiItemStyle = {
  backgroundColor: 'white',
  padding: '12px 16px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  position: 'relative'
};

const aiBadgeStyle = {
  position: 'absolute',
  top: '12px',
  right: '16px',
  backgroundColor: 'var(--accent-light)',
  color: 'var(--primary)',
  fontSize: '9px',
  fontWeight: '700',
  padding: '2px 8px',
  borderRadius: '10px'
};

const aiItemTitleStyle = {
  fontSize: '13px',
  fontWeight: '700',
  color: 'var(--foreground)',
  marginBottom: '4px'
};

const aiItemDescStyle = {
  fontSize: '11px',
  color: 'var(--muted)',
  lineHeight: '1.4'
};
