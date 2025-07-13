// seedProducts.js
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


const products = [
  {
    ProductName: 'Paracetamol Tablet 500mg',
    ProductPrice: 25,
    ProductBarcode: '100000000001',
    ProductQuantity: 20,
    Discount: 5,
    ExpiryDate: '2025-08-10'
  },
  {
    ProductName: 'Fresh Milk 1L',
    ProductPrice: 55,
    ProductBarcode: '100000000002',
    ProductQuantity: 10,
    Discount: 0,
    ExpiryDate: '2024-07-01'
  },
  {
    ProductName: 'Red T-shirt (M)',
    ProductPrice: 299,
    ProductBarcode: '100000000003',
    ProductQuantity: 15,
    Discount: 10
  },
  {
    ProductName: 'Samsung 10,000mAh Powerbank',
    ProductPrice: 1299,
    ProductBarcode: '100000000004',
    ProductQuantity: 5,
    Discount: 100
  },
  {
    ProductName: 'Organic Almonds 250g',
    ProductPrice: 249,
    ProductBarcode: '100000000005',
    ProductQuantity: 25,
    Discount: 0,
    ExpiryDate: '2025-12-31'
  },
  {
    ProductName: 'Face Wash (Aloe Vera)',
    ProductPrice: 180,
    ProductBarcode: '100000000006',
    ProductQuantity: 0,
    Discount: 0,
    ExpiryDate: '2025-09-01'
  },
  {
    ProductName: 'USB Type-C Cable (1.5m)',
    ProductPrice: 149,
    ProductBarcode: '100000000007',
    ProductQuantity: 40,
    Discount: 20
  },
  {
    ProductName: 'Amul Butter 500g',
    ProductPrice: 240,
    ProductBarcode: '100000000008',
    ProductQuantity: 12,
    Discount: 5,
    ExpiryDate: '2025-07-30'
  },
  {
    ProductName: 'Sports Shoes (Size 9)',
    ProductPrice: 1799,
    ProductBarcode: '100000000009',
    ProductQuantity: 8,
    Discount: 150
  },
  {
    ProductName: 'Eye Drops (Sterile)',
    ProductPrice: 120,
    ProductBarcode: '100000000010',
    ProductQuantity: 30,
    Discount: 0,
    ExpiryDate: '2024-05-15'
  },
  {
    ProductName: 'Cold Coffee Bottle 250ml',
    ProductPrice: 85,
    ProductBarcode: '100000000011',
    ProductQuantity: 10,
    Discount: 10,
    ExpiryDate: '2025-07-13'
  },
  {
    ProductName: 'Rechargeable Torch',
    ProductPrice: 399,
    ProductBarcode: '100000000012',
    ProductQuantity: 16,
    Discount: 0
  },
  {
    ProductName: 'Whiteboard Marker (Black)',
    ProductPrice: 20,
    ProductBarcode: '100000000013',
    ProductQuantity: 100,
    Discount: 0
  },
  {
    ProductName: 'Choco Bar Ice Cream',
    ProductPrice: 40,
    ProductBarcode: '100000000014',
    ProductQuantity: 6,
    Discount: 0,
    ExpiryDate: '2024-07-01'
  },
  {
    ProductName: 'Pain Relief Spray',
    ProductPrice: 210,
    ProductBarcode: '100000000015',
    ProductQuantity: 9,
    Discount: 5,
    ExpiryDate: '2025-07-28'
  }
];

const insertProducts = async () => {
  for (const product of products) {
    const res = await fetch('http://localhost:3001/insertproduct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });

    const msg = await res.text();
    console.log(`${product.ProductName} → ${res.status}: ${msg}`);
  }
};

insertProducts();
