"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_USERS, INITIAL_VENDORS, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_DELIVERIES } from './mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeRole, setActiveRole] = useState('customer'); // 'customer' | 'farmer' | 'driver'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'orders' | 'cart' | 'dashboard' etc.
  const [currentUser, setCurrentUser] = useState(DEFAULT_USERS.customer);
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [cart, setCart] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Load from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedRole = localStorage.getItem('agrilink_role') || 'customer';
        const storedProducts = localStorage.getItem('agrilink_products');
        const storedOrders = localStorage.getItem('agrilink_orders');
        const storedDeliveries = localStorage.getItem('agrilink_deliveries');
        const storedCart = localStorage.getItem('agrilink_cart');

        setActiveRole(storedRole);
        setCurrentUser(DEFAULT_USERS[storedRole] || DEFAULT_USERS.customer);
        setProducts(storedProducts ? JSON.parse(storedProducts) : INITIAL_PRODUCTS);
        setVendors(INITIAL_VENDORS);
        setOrders(storedOrders ? JSON.parse(storedOrders) : INITIAL_ORDERS);
        setDeliveries(storedDeliveries ? JSON.parse(storedDeliveries) : INITIAL_DELIVERIES);
        setCart(storedCart ? JSON.parse(storedCart) : []);
        
        // Set default tab based on loaded role
        if (storedRole === 'farmer') {
          setActiveTab('dashboard');
        } else {
          setActiveTab('home');
        }

        // Initial setup alert
        setNotifications([
          { id: 'notif-1', title: 'Welcome to AgriLink!', message: 'Switch between Customer, Farmer, and Driver views to simulate the entire marketplace.', read: false, createdAt: new Date().toISOString() }
        ]);
        
        setIsLoaded(true);
      } catch (e) {
        console.error("Failed to load local storage state", e);
        // Fallback
        setProducts(INITIAL_PRODUCTS);
        setVendors(INITIAL_VENDORS);
        setOrders(INITIAL_ORDERS);
        setDeliveries(INITIAL_DELIVERIES);
        setIsLoaded(true);
      }
    }
  }, []);

  // Save changes to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('agrilink_products', JSON.stringify(products));
    }
  }, [products, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('agrilink_orders', JSON.stringify(orders));
    }
  }, [orders, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('agrilink_deliveries', JSON.stringify(deliveries));
    }
  }, [deliveries, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('agrilink_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Role switching
  const switchRole = (role) => {
    setActiveRole(role);
    setCurrentUser(DEFAULT_USERS[role]);
    localStorage.setItem('agrilink_role', role);
    
    // Set default tab for the new role
    if (role === 'farmer') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('home');
    }

    // Auto add a notification
    addNotification(
      `Switched to ${role.charAt(0).toUpperCase() + role.slice(1)} view`,
      `You are now acting as ${DEFAULT_USERS[role].fullName}.`
    );
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.product.id === product.id);
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }
      return [...prevCart, { product, quantity }];
    });
    
    addNotification('Added to Cart', `${product.name} (${quantity} ${product.unit}) added.`);
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => item.product.id === productId ? { ...item, quantity } : item)
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Place Order
  const placeOrder = (deliverySlot, addressText) => {
    if (cart.length === 0) return null;

    // Group items by vendor
    const vendorId = cart[0].product.vendorId;
    const vendorName = cart[0].product.vendorName;
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const orderId = `order-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = {
      id: orderId,
      consumerId: currentUser.id,
      consumerName: currentUser.fullName,
      vendorId: vendorId,
      vendorName: vendorName,
      status: 'pending',
      totalPrice: totalPrice,
      deliveryAddress: addressText || currentUser.address,
      deliverySlot: deliverySlot,
      createdAt: new Date().toISOString(),
      items: cart.map((item, idx) => ({
        id: `item-${orderId}-${idx}`,
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        priceAtPurchase: item.product.price
      }))
    };

    // Update stock levels
    setProducts(prevProducts => 
      prevProducts.map(p => {
        const cartItem = cart.find(c => c.product.id === p.id);
        if (cartItem) {
          const newStock = Math.max(0, p.stock - cartItem.quantity);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    clearCart();
    
    // Notify farmer
    addNotification(
      'New Order Placed!',
      `Order ${orderId} has been successfully sent to ${vendorName} for confirmation.`
    );

    return orderId;
  };

  // Farmer operations
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );

    // If order is updated to "ready", create a delivery ticket for drivers to accept
    if (newStatus === 'ready') {
      const order = orders.find(o => o.id === orderId) || { id: orderId, vendorId: 'user-abdullahi', consumerName: 'Amina Bello' };
      const deliveryId = `deliv-${orderId.split('-')[1] || Math.floor(1000 + Math.random() * 9000)}`;
      
      const vendor = vendors.find(v => v.id === order.vendorId) || { location: [9.0820, 7.4100] };
      const consumerCoord = DEFAULT_USERS.customer.coordinates; // Amina's coordinate

      // Generate a mock path between vendor and consumer
      const routePoints = [
        vendor.location,
        [vendor.location[0] - 0.003, vendor.location[1] - 0.001],
        [vendor.location[0] - 0.006, vendor.location[1] - 0.002],
        [vendor.location[0] - 0.009, vendor.location[1] - 0.004],
        consumerCoord
      ];

      const newDelivery = {
        id: deliveryId,
        orderId: orderId,
        driverId: null,
        driverName: null,
        status: 'assigned',
        routePoints: routePoints,
        currentPointIndex: 0,
        currentLocation: vendor.location,
        updatedAt: new Date().toISOString()
      };

      setDeliveries(prev => [newDelivery, ...prev]);

      addNotification(
        'Delivery Package Ready',
        `Order ${orderId} is packed and waiting for a logistics driver.`
      );
    } else {
      addNotification(
        'Order Status Updated',
        `Order ${orderId} status changed to ${newStatus.toUpperCase()}.`
      );
    }
  };

  const addNewProduct = (productData) => {
    const newProduct = {
      id: `prod-${Math.floor(1000 + Math.random() * 9000)}`,
      vendorId: currentUser.id,
      vendorName: currentUser.fullName,
      ...productData,
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]);
    addNotification('Product Added', `${productData.name} has been added to your catalog.`);
  };

  const updateProductStock = (productId, newStock) => {
    setProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, stock: parseInt(newStock) } : p)
    );
  };

  // Logistics operations
  const acceptDeliveryJob = (orderId, driverId, driverName) => {
    setDeliveries(prev => 
      prev.map(d => d.orderId === orderId ? { 
        ...d, 
        driverId: driverId, 
        driverName: driverName,
        status: 'picking_up', 
        updatedAt: new Date().toISOString() 
      } : d)
    );

    // Update order status to in_transit
    updateOrderStatus(orderId, 'in_transit');

    addNotification(
      'Delivery Job Claimed',
      `Tunde Oyelese has accepted Delivery for Order ${orderId}.`
    );
  };

  const updateDeliveryStatus = (deliveryId, newStatus) => {
    setDeliveries(prev => 
      prev.map(d => {
        if (d.id === deliveryId) {
          const updated = { ...d, status: newStatus, updatedAt: new Date().toISOString() };
          
          if (newStatus === 'delivering') {
            updateOrderStatus(d.orderId, 'in_transit');
          } else if (newStatus === 'completed') {
            updateOrderStatus(d.orderId, 'delivered');
          }
          
          return updated;
        }
        return d;
      })
    );

    addNotification(
      'Delivery Status Update',
      `Delivery ${deliveryId} is now ${newStatus.toUpperCase()}.`
    );
  };

  // GPS Simulation
  const simulateDriverMovement = (deliveryId) => {
    setDeliveries(prev => 
      prev.map(d => {
        if (d.id === deliveryId) {
          const nextIndex = d.currentPointIndex + 1;
          if (nextIndex < d.routePoints.length) {
            const nextLocation = d.routePoints[nextIndex];
            
            // If it reaches the final point, auto trigger completion
            const isFinished = nextIndex === d.routePoints.length - 1;
            const newStatus = isFinished ? 'completed' : 'delivering';
            
            if (isFinished) {
              updateOrderStatus(d.orderId, 'delivered');
            }

            return {
              ...d,
              currentPointIndex: nextIndex,
              currentLocation: nextLocation,
              status: newStatus,
              updatedAt: new Date().toISOString()
            };
          }
        }
        return d;
      })
    );
  };

  // Notifications
  const addNotification = (title, message) => {
    const newNotif = {
      id: `notif-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider value={{
      isLoaded,
      activeRole,
      activeTab,
      setActiveTab,
      currentUser,
      products,
      vendors,
      orders,
      deliveries,
      cart,
      notifications,
      switchRole,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      placeOrder,
      updateOrderStatus,
      addNewProduct,
      updateProductStock,
      acceptDeliveryJob,
      updateDeliveryStatus,
      simulateDriverMovement,
      addNotification,
      markAllNotificationsRead
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
