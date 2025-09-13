// Shared static data for tenants, products, and orders

export const tenants = [
  { 
    id: 'electronics-hub', 
    name: 'Electronics Hub', 
    theme: 'tech', 
    enabledFeatures: ['catalog', 'storefront', 'analytics', 'inventory', 'payments', 'reviews'] 
  },
  { 
    id: 'fashion-store', 
    name: 'Fashion Store', 
    theme: 'elegant', 
    enabledFeatures: ['catalog', 'storefront', 'analytics', 'inventory', 'payments', 'reviews', 'wishlist'] 
  },
  { 
    id: 'book-corner', 
    name: 'Book Corner', 
    theme: 'classic', 
    enabledFeatures: ['catalog', 'storefront', 'inventory', 'payments', 'reviews', 'recommendations'] 
  },
  { 
    id: 'demo-shop', 
    name: 'Universal Shop', 
    theme: 'modern', 
    enabledFeatures: ['catalog', 'storefront', 'analytics', 'inventory', 'payments', 'reviews', 'recommendations', 'wishlist'] 
  },
];

export const products = [
  // Electronics Hub Products
  { id: 'elec-1', name: 'OnePlus Pro Max', price: 74999, variants: ['128GB', '256GB', '512GB'], tenantId: 'electronics-hub', category: 'electronics', description: 'Latest flagship smartphone with premium features' },
  { id: 'elec-2', name: 'boAt Wireless Earbuds', price: 14999, variants: ['Black', 'White', 'Blue'], tenantId: 'electronics-hub', category: 'electronics', description: 'True wireless earbuds with noise cancellation' },
  { id: 'elec-3', name: 'Mi 4K Smart TV', price: 59999, variants: ['55"', '65"', '75"'], tenantId: 'electronics-hub', category: 'electronics', description: 'Ultra HD smart TV with Android TV' },
  { id: 'elec-4', name: 'ASUS Gaming Laptop', price: 97499, variants: ['16GB RAM', '32GB RAM'], tenantId: 'electronics-hub', category: 'electronics', description: 'High-performance gaming laptop with RTX graphics' },
  
  // Fashion Store Products
  { id: 'fash-1', name: 'Ethnic Kurti', price: 11999, variants: ['S', 'M', 'L', 'XL'], tenantId: 'fashion-store', category: 'clothing', description: 'Traditional Indian kurti with modern design' },
  { id: 'fash-2', name: 'Adidas Sneakers', price: 6749, variants: ['7', '8', '9', '10', '11'], tenantId: 'fashion-store', category: 'clothing', description: 'Premium sports sneakers for everyday wear' },
  { id: 'fash-3', name: 'Leather Handbag', price: 22499, variants: ['Black', 'Brown', 'Tan'], tenantId: 'fashion-store', category: 'clothing', description: 'Genuine leather handbag with multiple compartments' },
  { id: 'fash-4', name: 'Cotton T-Shirt', price: 2249, variants: ['S', 'M', 'L', 'XL'], tenantId: 'fashion-store', category: 'clothing', description: '100% cotton casual t-shirt in various colors' },
  
  // Book Corner Products
  { id: 'book-1', name: 'Ramayana - Complete Edition', price: 1124, variants: ['Paperback', 'Hardcover'], tenantId: 'book-corner', category: 'books', description: 'Complete Ramayana with beautiful illustrations' },
  { id: 'book-2', name: 'Indian History', price: 3749, variants: ['Hindi', 'English'], tenantId: 'book-corner', category: 'books', description: 'Comprehensive guide to Indian history and culture' },
  { id: 'book-3', name: 'Hindi Literature Collection', price: 2624, variants: ['Set of 3', 'Set of 5'], tenantId: 'book-corner', category: 'books', description: 'Collection of classic Hindi literature' },
  { id: 'book-4', name: 'Indian Cooking Guide', price: 1874, variants: ['Vegetarian', 'Complete'], tenantId: 'book-corner', category: 'books', description: 'Traditional Indian recipes and cooking techniques' },
  
  // Universal Shop Products
  { id: 'demo-1', name: 'Home Tool Kit', price: 2999, variants: ['Basic', 'Pro', 'Expert'], tenantId: 'demo-shop', category: 'home', description: 'Complete toolkit for home repairs and maintenance' },
  { id: 'demo-2', name: 'Steel Water Bottle', price: 1499, variants: ['500ml', '750ml', '1L'], tenantId: 'demo-shop', category: 'home', description: 'Eco-friendly stainless steel water bottle' },
  { id: 'demo-3', name: 'Wireless Charger', price: 2249, variants: ['Standard', 'Fast Charge'], tenantId: 'demo-shop', category: 'electronics', description: 'Qi-enabled wireless charging pad' },
  { id: 'demo-4', name: 'Organic Tea', price: 974, variants: ['Green Tea', 'Black Tea', 'Masala Chai'], tenantId: 'demo-shop', category: 'home', description: 'Premium organic tea blends from Darjeeling' },
];

export const orders = [
  // Electronics Hub Orders
  { id: 'order-1', productId: 'elec-1', tenantId: 'electronics-hub', status: 'Processing', customer: 'Rahul Sharma', value: 74999, date: '2025-09-13' },
  { id: 'order-2', productId: 'elec-2', tenantId: 'electronics-hub', status: 'Shipped', customer: 'Priya Patel', value: 14999, date: '2025-09-12' },
  { id: 'order-3', productId: 'elec-3', tenantId: 'electronics-hub', status: 'Delivered', customer: 'Arjun Kumar', value: 59999, date: '2025-09-11' },
  
  // Fashion Store Orders
  { id: 'order-4', productId: 'fash-1', tenantId: 'fashion-store', status: 'Processing', customer: 'Sneha Gupta', value: 11999, date: '2025-09-13' },
  { id: 'order-5', productId: 'fash-2', tenantId: 'fashion-store', status: 'Shipped', customer: 'Vikram Singh', value: 6749, date: '2025-09-12' },
  { id: 'order-6', productId: 'fash-3', tenantId: 'fashion-store', status: 'Processing', customer: 'Ananya Iyer', value: 22499, date: '2025-09-13' },
  
  // Book Corner Orders
  { id: 'order-7', productId: 'book-1', tenantId: 'book-corner', status: 'Delivered', customer: 'Suresh Reddy', value: 1124, date: '2025-09-10' },
  { id: 'order-8', productId: 'book-2', tenantId: 'book-corner', status: 'Processing', customer: 'Kavya Nair', value: 3749, date: '2025-09-13' },
  
  // Universal Shop Orders
  { id: 'order-9', productId: 'demo-1', tenantId: 'demo-shop', status: 'Shipped', customer: 'Aditya Joshi', value: 2999, date: '2025-09-12' },
  { id: 'order-10', productId: 'demo-2', tenantId: 'demo-shop', status: 'Processing', customer: 'Pooja Mehta', value: 1499, date: '2025-09-13' },
];

export const analytics = {
  totalSales: 1142358,
  activeCustomers: 342,
  abTestWinner: 'Variant B',
  customerInsights: [
    'Most sales occur during festival seasons',
    'Returning customers spend 30% more',
    'Mobile users convert 2x desktop users', 
    'Product reviews increase conversion by 15%',
    'Free shipping above ₹500 drives larger orders'
  ],
  monthlyRevenue: [
    { month: 'Jan', revenue: 93000 },
    { month: 'Feb', revenue: 103500 },
    { month: 'Mar', revenue: 114000 },
    { month: 'Apr', revenue: 109500 },
    { month: 'May', revenue: 120750 },
    { month: 'Jun', revenue: 129750 },
    { month: 'Jul', revenue: 119250 },
    { month: 'Aug', revenue: 136500 },
    { month: 'Sep', revenue: 114235 }
  ]
};
