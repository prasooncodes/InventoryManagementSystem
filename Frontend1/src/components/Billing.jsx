import React, { useEffect, useState } from 'react';

export default function Billing() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [amountReceived, setAmountReceived] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:3001/products');
    const data = await res.json();
    if (res.status === 201) setProducts(data);
  };

  const addToCart = (product) => {
    const exists = cart.find(item => item._id === product._id);
    if (exists) {
      setCart(cart.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQty = (id, qty) => {
    if (qty < 1 || isNaN(qty)) return;
    setCart(cart.map(item => item._id === id ? { ...item, quantity: qty } : item));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  const finalizeOrder = async () => {
    const numericAmount = parseFloat(amountReceived);
    if (!cart.length || !numericAmount || !customerName.trim()) {
      setMessage('❌ Please fill all fields and add items to cart.');
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.quantity * item.ProductPrice, 0);
    if (numericAmount < total) {
      setMessage('❌ Amount received is less than total.');
      return;
    }

    const res = await fetch('http://localhost:3001/createbill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map(item => ({
          productId: item._id,
          name: item.ProductName,
          price: item.ProductPrice,
          quantity: item.quantity
        })),
        totalAmount: total,
        customerName,
        paymentMode,
        amountReceived: numericAmount
      })
    });

    if (res.status === 201) {
      setCart([]);
      setCustomerName('');
      setAmountReceived('');
      setMessage('✅ Bill created successfully.');
    } else {
      const err = await res.text();
      setMessage(`❌ Error creating bill: ${err}`);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.quantity * item.ProductPrice, 0);
  const change = amountReceived ? parseFloat(amountReceived) - total : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">🧾 Billing</h1>

      {message && (
        <div className="mb-4 p-4 rounded bg-blue-100 text-blue-700 border border-blue-300">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Products List */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">🛒 Add Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map(product => (
              <div
                key={product._id}
                className="border border-gray-200 p-4 rounded-md shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">{product.ProductName}</h3>
                <p className="text-gray-600">₹{product.ProductPrice}</p>
                <button
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div>
          <h2 className="text-xl font-semibold mb-4">🧺 Cart</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">No items in cart.</p>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div
                  key={item._id}
                  className="border p-4 rounded-md bg-white shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{item.ProductName}</h3>
                      <p className="text-sm text-gray-600">₹{item.ProductPrice} × {item.quantity}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity || ''}
                    onChange={(e) => updateQty(item._id, parseInt(e.target.value))}
                    className="mt-2 w-full border px-3 py-1 rounded"
                  />
                </div>
              ))}

              <div className="border-t pt-4 mt-4 space-y-1">
                <p className="text-right text-lg font-semibold text-green-700">
                  Total: ₹{total.toFixed(2)}
                </p>
                {amountReceived && !isNaN(change) && (
                  <p className="text-right text-sm text-gray-700">
                    Change to return: ₹{change.toFixed(2)}
                  </p>
                )}
              </div>

              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border px-3 py-2 rounded mt-4"
              />
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
              </select>
              <input
                type="number"
                placeholder="Amount Received"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <button
                onClick={() => setAmountReceived(total.toFixed(2))}
                className="text-sm text-blue-600 underline mb-2 text-left"
              >
                Autofill with Total
              </button>
              <button
                onClick={finalizeOrder}
                className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded text-lg font-medium"
              >
                Finalize Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
