export const DEFAULT_USERS = {
  customer: {
    id: "user-amina",
    email: "amina@agrilink.com",
    fullName: "Amina Bello",
    role: "customer",
    phone: "+234 803 123 4567",
    address: "Plot 104, Wuse II, Abuja, Nigeria",
    coordinates: [9.0710, 7.4050]
  },
  farmer: {
    id: "user-abdullahi",
    email: "abdullahi@agrilink.com",
    fullName: "Abdullahi Farms",
    role: "farmer",
    phone: "+234 812 345 6789",
    farmName: "Abdullahi & Sons Agricultural Group",
    bio: "Pioneering organic, fresh, and healthy vegetables, tubers, and grains directly from the fertile soils of Abuja's outskirts.",
    address: "Kuje Road, Abuja, Nigeria",
    coordinates: [9.0820, 7.4100],
    rating: 4.8,
    bannerUrl: "https://images.unsplash.com/photo-1500937386664-56d15fe06767?w=800&auto=format&fit=crop&q=60"
  },
  driver: {
    id: "user-tunde",
    email: "tunde@agrilink.com",
    fullName: "Tunde Oyelese",
    role: "driver",
    phone: "+234 905 987 6543",
    address: "Garki Area 11, Abuja, Nigeria",
    coordinates: [9.0760, 7.3900],
    vehicleType: "Motorcycle (Carrier Box)"
  }
};

export const INITIAL_VENDORS = [
  {
    id: "user-abdullahi",
    farmName: "Abdullahi Farms",
    ownerName: "Abdullahi & Sons",
    bio: "Pioneering organic, fresh, and healthy vegetables, tubers, and grains directly from the fertile soils of Abuja's outskirts.",
    location: [9.0820, 7.4100],
    addressText: "Kuje Road, Abuja, Nigeria",
    bannerUrl: "https://images.unsplash.com/photo-1500937386664-56d15fe06767?w=800&auto=format&fit=crop&q=60",
    rating: 4.8,
    category: "Organic Farming"
  },
  {
    id: "vendor-mama-sheila",
    farmName: "Mama Sheila's Poultry & Dairy",
    ownerName: "Sheila Danjuma",
    bio: "Fresh dairy, cage-free eggs, and healthy poultry feed directly to your family dinner table.",
    location: [9.0550, 7.4320],
    addressText: "Gwarinpa Estate, Abuja, Nigeria",
    bannerUrl: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=800&auto=format&fit=crop&q=60",
    rating: 4.6,
    category: "Poultry & Dairy"
  },
  {
    id: "vendor-bello-grains",
    farmName: "Bello Organic Grain Depot",
    ownerName: "Alhaji Bello",
    bio: "Top quality millet, sorghum, maize, and beans cleaned and bagged in standard sizes.",
    location: [9.0910, 7.3750],
    addressText: "Life Camp, Abuja, Nigeria",
    bannerUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=60",
    rating: 4.9,
    category: "Grains & Cereals"
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: "prod-tomatoes",
    vendorId: "user-abdullahi",
    vendorName: "Abdullahi Farms",
    name: "Fresh Red Tomatoes",
    description: "Firm, vine-ripened red tomatoes. Perfect for stews, salads, and jollof rice.",
    price: 1200,
    unit: "kg",
    stock: 120,
    imageUrl: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&auto=format&fit=crop&q=60",
    category: "Vegetables",
    isSeasonal: true
  },
  {
    id: "prod-maize",
    vendorId: "user-abdullahi",
    vendorName: "Abdullahi Farms",
    name: "Yellow Maize Ears",
    description: "Sweet, freshly harvested yellow sweet corn. Ideal for boiling or roasting.",
    price: 800,
    unit: "kg",
    stock: 200,
    imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&auto=format&fit=crop&q=60",
    category: "Grains",
    isSeasonal: false
  },
  {
    id: "prod-pepper",
    vendorId: "user-abdullahi",
    vendorName: "Abdullahi Farms",
    name: "Habanero Pepper (Ata Rodo)",
    description: "Extremely spicy and aromatic fresh local peppers. Essential for local stews.",
    price: 1500,
    unit: "kg",
    stock: 8,
    imageUrl: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=60",
    category: "Vegetables",
    isSeasonal: true
  },
  {
    id: "prod-plantain",
    vendorId: "user-abdullahi",
    vendorName: "Abdullahi Farms",
    name: "Unripe / Ripe Plantain Bunch",
    description: "Large, nutrient-rich local plantains. Great for frying (dodo) or boiling.",
    price: 600,
    unit: "bundle",
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1566393028639-d108a42c46a7?w=400&auto=format&fit=crop&q=60",
    category: "Fruits",
    isSeasonal: false
  },
  {
    id: "prod-eggs",
    vendorId: "vendor-mama-sheila",
    vendorName: "Mama Sheila's Poultry & Dairy",
    name: "Organic Farm Eggs (Crate)",
    description: "A crate of 30 fresh, large brown eggs from pasture-raised hens.",
    price: 2800,
    unit: "crate",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=400&auto=format&fit=crop&q=60",
    category: "Dairy",
    isSeasonal: false
  },
  {
    id: "prod-milk",
    vendorId: "vendor-mama-sheila",
    vendorName: "Mama Sheila's Poultry & Dairy",
    name: "Raw Fresh Cow Milk",
    description: "Pure, fresh cow milk pasteurized and chilled. Full fat and highly nutritious.",
    price: 1800,
    unit: "litre",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop&q=60",
    category: "Dairy",
    isSeasonal: false
  },
  {
    id: "prod-millet",
    vendorId: "vendor-bello-grains",
    vendorName: "Bello Organic Grain Depot",
    name: "Cleaned Pearl Millet",
    description: "Premium pearl millet, perfectly winnowed. Ideal for preparing fura or local porridge.",
    price: 950,
    unit: "kg",
    stock: 500,
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=60",
    category: "Grains",
    isSeasonal: false
  },
  {
    id: "prod-spinach",
    vendorId: "user-abdullahi",
    vendorName: "Abdullahi Farms",
    name: "Green Spinach Leaves (Efo Shoko)",
    description: "Freshly cut green spinach leaves. Nutrient rich and washed.",
    price: 400,
    unit: "bundle",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=60",
    category: "Vegetables",
    isSeasonal: true
  }
];

export const INITIAL_ORDERS = [
  {
    id: "order-101",
    consumerId: "user-amina",
    consumerName: "Amina Bello",
    vendorId: "user-abdullahi",
    vendorName: "Abdullahi Farms",
    status: "delivered",
    totalPrice: 4200,
    deliveryAddress: "Plot 104, Wuse II, Abuja, Nigeria",
    deliverySlot: "morning_9_12",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { id: "item-1", productId: "prod-tomatoes", productName: "Fresh Red Tomatoes", quantity: 2, priceAtPurchase: 1200 },
      { id: "item-2", productId: "prod-pepper", productName: "Habanero Pepper", quantity: 1, priceAtPurchase: 1500 },
      { id: "item-3", productId: "prod-spinach", productName: "Green Spinach Leaves", quantity: 2, priceAtPurchase: 450 }
    ]
  },
  {
    id: "order-102",
    consumerId: "user-amina",
    consumerName: "Amina Bello",
    vendorId: "user-abdullahi",
    vendorName: "Abdullahi Farms",
    status: "in_transit",
    totalPrice: 3800,
    deliveryAddress: "Plot 104, Wuse II, Abuja, Nigeria",
    deliverySlot: "afternoon_14_17",
    createdAt: new Date().toISOString(),
    items: [
      { id: "item-4", productId: "prod-maize", productName: "Yellow Maize Ears", quantity: 3, priceAtPurchase: 800 },
      { id: "item-5", productId: "prod-plantain", productName: "Unripe / Ripe Plantain Bunch", quantity: 2, priceAtPurchase: 600 }
    ]
  }
];

export const INITIAL_DELIVERIES = [
  {
    id: "deliv-102",
    orderId: "order-102",
    driverId: "user-tunde",
    driverName: "Tunde Oyelese",
    status: "delivering",
    routePoints: [
      [9.0820, 7.4100], // Start at Abdullahi Farms
      [9.0790, 7.4080],
      [9.0760, 7.4060],
      [9.0730, 7.4055],
      [9.0710, 7.4050]  // End at Amina Bello's address
    ],
    currentPointIndex: 1,
    currentLocation: [9.0790, 7.4080],
    updatedAt: new Date().toISOString()
  }
];
