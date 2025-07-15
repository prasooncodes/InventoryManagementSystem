import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import API from '../api';

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
    try {
      const res = await API.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to fetch products.');
    }
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

    try {
      const res = await API.post('/api/createbill', {
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
      });

      if (res.status === 201) {
        generatePDFInvoice();
        setCart([]);
        setCustomerName('');
        setAmountReceived('');
        setMessage('✅ Bill created successfully.');
      }
    } catch (err) {
      console.error(err);
      setMessage(`❌ Error creating bill: ${err.response?.data || err.message}`);
    }
  };

  const generatePDFInvoice = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('QuickMart - Invoice #001', 14, 20);

    doc.setFontSize(12);
    doc.text(`Customer: ${customerName}`, 14, 30);
    doc.text(`Payment Mode: ${paymentMode}`, 14, 36);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 42);

    const tableColumn = ['Product', 'Price', 'Qty', 'Total'];
    const tableRows = cart.map(item => [
      item.ProductName,
      `₹${item.ProductPrice.toFixed(2)}`,
      item.quantity,
      `₹${(item.ProductPrice * item.quantity).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 50,
      head: [tableColumn],
      body: tableRows
    });

    const total = cart.reduce((sum, item) => sum + item.ProductPrice * item.quantity, 0);
    doc.text(`Total: ₹${total.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Amount Received: ₹${amountReceived}`, 14, doc.lastAutoTable.finalY + 16);

    doc.save(`Invoice_${customerName}_${Date.now()}.pdf`);
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
        {/* Product List */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">🛒 Add Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product._id} className="border p-4 rounded shadow">
                <h3 className="text-lg font-semibold">{product.ProductName}</h3>
                <p className="text-gray-700">₹{product.ProductPrice}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-1 rounded"
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
            <p className="text-gray-600">No items in cart.</p>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item._id} className="border p-3 rounded bg-white shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{item.ProductName}</h3>
                      <p className="text-sm text-gray-600">
                        ₹{item.ProductPrice} × {item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑
                    </button>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQty(item._id, parseInt(e.target.value))}
                    className="mt-2 w-full border px-2 py-1 rounded"
                  />
                </div>
              ))}

              <div className="pt-4 border-t">
                <p className="text-right font-semibold text-green-700">Total: ₹{total.toFixed(2)}</p>
                {amountReceived && !isNaN(change) && (
                  <p className="text-right text-sm text-gray-600">
                    Change: ₹{change.toFixed(2)}
                  </p>
                )}
              </div>

              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border px-3 py-2 rounded"
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
                className="text-sm text-blue-600 underline text-left"
              >
                Autofill with Total
              </button>
              <button
                onClick={finalizeOrder}
                className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded mt-2"
              >
                Finalize Order
              </button>
              {cart.length > 0 && (
                <button
                  onClick={generatePDFInvoice}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 mt-2 rounded"
                >
                  Download Invoice (PDF)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
