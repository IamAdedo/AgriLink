"use client";

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';

export default function FarmerInventory() {
  const { products, addNewProduct, updateProductStock } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editStockId, setEditStockId] = useState('');
  const [newStockVal, setNewStockVal] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [isSeasonal, setIsSeasonal] = useState(false);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=60');

  // Filter products for this farmer (Abdullahi)
  const farmProducts = products.filter(p => p.vendorId === 'user-abdullahi');

  const presetImages = [
    { name: 'Vegetables Mix', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=60' },
    { name: 'Tomatoes', url: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&auto=format&fit=crop&q=60' },
    { name: 'Yellow Maize', url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&auto=format&fit=crop&q=60' },
    { name: 'Hot Peppers', url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=60' },
    { name: 'Bananas / Plantains', url: 'https://images.unsplash.com/photo-1566393028639-d108a42c46a7?w=400&auto=format&fit=crop&q=60' },
    { name: 'Spinach / Greens', url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=60' }
  ];

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !stock) return;

    addNewProduct({
      name,
      description,
      price: parseFloat(price),
      unit,
      stock: parseInt(stock),
      category,
      isSeasonal,
      imageUrl
    });

    // Reset Form
    setName('');
    setDescription('');
    setPrice('');
    setUnit('kg');
    setStock('');
    setCategory('Vegetables');
    setIsSeasonal(false);
    setShowAddForm(false);
  };

  const handleSaveStock = (productId) => {
    updateProductStock(productId, newStockVal);
    setEditStockId('');
  };

  return (
    <div style={containerStyle}>
      <div style={headerRowStyle}>
        <h2 style={titleStyle}>Farm Inventory</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          style={addBtnStyle}
        >
          {showAddForm ? 'Close Form' : '+ Add New Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <form onSubmit={handleAddProductSubmit} style={formStyle} className="premium-card">
          <h3 style={formTitleStyle}>New Produce Details</h3>
          
          <div style={formRowStyle}>
            <label style={labelStyle}>Product Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Yam Tubers, Fresh Carrots" 
              required
              style={inputStyle}
            />
          </div>

          <div style={formRowStyle}>
            <label style={labelStyle}>Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Provide fresh qualities, harvest dates or size descriptors..." 
              style={textareaStyle}
            />
          </div>

          <div style={gridFormStyle}>
            <div style={formRowStyle}>
              <label style={labelStyle}>Price (₦)</label>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="₦" 
                required
                style={inputStyle}
              />
            </div>
            <div style={formRowStyle}>
              <label style={labelStyle}>Sale Unit</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} style={selectStyle}>
                <option value="kg">kg</option>
                <option value="item">item / count</option>
                <option value="bundle">bundle</option>
                <option value="crate">crate</option>
                <option value="basket">basket</option>
              </select>
            </div>
          </div>

          <div style={gridFormStyle}>
            <div style={formRowStyle}>
              <label style={labelStyle}>Stock Quantity</label>
              <input 
                type="number" 
                value={stock} 
                onChange={(e) => setStock(e.target.value)} 
                placeholder="e.g. 50" 
                required
                style={inputStyle}
              />
            </div>
            <div style={formRowStyle}>
              <label style={labelStyle}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Grains">Grains</option>
                <option value="Dairy">Dairy</option>
              </select>
            </div>
          </div>

          <div style={checkboxRowStyle}>
            <input 
              type="checkbox" 
              id="isSeasonal" 
              checked={isSeasonal} 
              onChange={(e) => setIsSeasonal(e.target.checked)} 
              style={checkboxStyle}
            />
            <label htmlFor="isSeasonal" style={checkboxLabelStyle}>This is a seasonal harvest</label>
          </div>

          {/* Preset Images Selection */}
          <div style={formRowStyle}>
            <label style={labelStyle}>Select Showcase Image</label>
            <div style={imagesGridStyle}>
              {presetImages.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImageUrl(img.url)}
                  style={{
                    ...imageSelectBtnStyle,
                    ...(imageUrl === img.url ? activeImageSelectStyle : {})
                  }}
                >
                  <img src={img.url} alt={img.name} style={selectImgStyle} />
                  <span style={selectImgLabelStyle}>{img.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" style={submitBtnStyle}>Publish to AgriLink Marketplace</button>
        </form>
      )}

      {/* Inventory List */}
      <div style={inventoryListStyle}>
        {farmProducts.map(p => (
          <div key={p.id} style={itemCardStyle} className="premium-card">
            <img src={p.imageUrl} alt={p.name} style={itemImgStyle} />
            <div style={itemDetailsStyle}>
              <h4 style={itemNameStyle}>{p.name}</h4>
              <span style={itemCategoryStyle}>{p.category} {p.isSeasonal && '• Seasonal'}</span>
              <strong style={itemPriceStyle}>₦{p.price.toLocaleString()} / {p.unit}</strong>
            </div>

            <div style={itemActionsStyle}>
              <div style={stockIndicatorStyle}>
                <span>Current Stock:</span>
                <strong>{p.stock} {p.unit}</strong>
              </div>

              {editStockId === p.id ? (
                <div style={editStockStyle}>
                  <input 
                    type="number"
                    value={newStockVal}
                    onChange={(e) => setNewStockVal(e.target.value)}
                    style={editInputStyle}
                  />
                  <button onClick={() => handleSaveStock(p.id)} style={saveBtnStyle}>Save</button>
                </div>
              ) : (
                <button 
                  onClick={() => { setEditStockId(p.id); setNewStockVal(p.stock); }}
                  style={adjustBtnStyle}
                >
                  Adjust Stock
                </button>
              )}
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

const headerRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
};

const titleStyle = {
  fontSize: '20px',
  fontWeight: '800',
  color: 'var(--foreground)',
  letterSpacing: '-0.02em'
};

const addBtnStyle = {
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

const formStyle = {
  backgroundColor: 'white',
  padding: '20px',
  marginBottom: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  animation: 'scaleIn 0.2s ease-out'
};

const formTitleStyle = {
  fontSize: '15px',
  fontWeight: '800',
  color: 'var(--primary)',
  marginBottom: '4px'
};

const formRowStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const gridFormStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px'
};

const labelStyle = {
  fontSize: '11px',
  fontWeight: '700',
  color: 'var(--muted)'
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  fontSize: '13px',
  backgroundColor: 'var(--background)'
};

const textareaStyle = {
  width: '100%',
  height: '60px',
  padding: '10px 12px',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  fontSize: '13px',
  backgroundColor: 'var(--background)',
  resize: 'none'
};

const selectStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  fontSize: '13px',
  backgroundColor: 'var(--background)',
  cursor: 'pointer'
};

const checkboxRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const checkboxStyle = {
  width: '16px',
  height: '16px',
  cursor: 'pointer'
};

const checkboxLabelStyle = {
  fontSize: '12px',
  fontWeight: '600',
  color: 'var(--foreground)',
  cursor: 'pointer'
};

const imagesGridStyle = {
  display: 'flex',
  gap: '10px',
  overflowX: 'auto',
  padding: '4px 0'
};

const imageSelectBtnStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  padding: '4px',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  backgroundColor: 'white',
  cursor: 'pointer',
  minWidth: '90px'
};

const activeImageSelectStyle = {
  borderColor: 'var(--primary)',
  backgroundColor: 'var(--primary-light)',
  boxShadow: '0 2px 6px rgba(0,100,48,0.1)'
};

const selectImgStyle = {
  width: '80px',
  height: '60px',
  objectFit: 'cover',
  borderRadius: '6px'
};

const selectImgLabelStyle = {
  fontSize: '9px',
  fontWeight: '600',
  color: 'var(--muted)'
};

const submitBtnStyle = {
  backgroundColor: 'var(--primary)',
  color: 'white',
  padding: '12px',
  borderRadius: '24px',
  fontWeight: '800',
  fontSize: '13px',
  cursor: 'pointer',
  border: 'none',
  marginTop: '8px',
  boxShadow: 'var(--shadow-sm)'
};

const inventoryListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const itemCardStyle = {
  backgroundColor: 'white',
  padding: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '14px'
};

const itemImgStyle = {
  width: '60px',
  height: '60px',
  objectFit: 'cover',
  borderRadius: 'var(--radius-sm)'
};

const itemDetailsStyle = {
  flex: 1
};

const itemNameStyle = {
  fontSize: '14px',
  fontWeight: '700',
  color: 'var(--foreground)'
};

const itemCategoryStyle = {
  fontSize: '10px',
  color: 'var(--muted)',
  fontWeight: '600',
  display: 'block',
  margin: '2px 0'
};

const itemPriceStyle = {
  fontSize: '13px',
  color: 'var(--primary)',
  fontWeight: '750'
};

const itemActionsStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '6px'
};

const stockIndicatorStyle = {
  fontSize: '11px',
  color: 'var(--muted)',
  display: 'flex',
  gap: '4px'
};

const adjustBtnStyle = {
  padding: '4px 10px',
  borderRadius: '12px',
  border: '1px solid var(--border)',
  fontSize: '11px',
  fontWeight: '600',
  color: 'var(--foreground)',
  backgroundColor: 'white',
  cursor: 'pointer'
};

const editStockStyle = {
  display: 'flex',
  gap: '6px'
};

const editInputStyle = {
  width: '50px',
  padding: '4px',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  fontSize: '11px',
  textAlign: 'center',
  backgroundColor: 'var(--background)'
};

const saveBtnStyle = {
  padding: '4px 8px',
  backgroundColor: 'var(--primary)',
  color: 'white',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: '600',
  cursor: 'pointer',
  border: 'none'
};
