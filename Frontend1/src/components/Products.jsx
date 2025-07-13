import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function isNearExpiry(expiryDateStr) {
  if (!expiryDateStr) return false;
  const expiry = new Date(expiryDateStr);
  const now = new Date();
  const diff = (expiry - now) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 30;
}

function isExpired(expiryDateStr) {
  if (!expiryDateStr) return false;
  return new Date(expiryDateStr) < new Date();
}

export default function Products() {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [showExpiryModal, setShowExpiryModal] = useState(true);
  const [expiredProducts, setExpiredProducts] = useState([]);

  const query = useQuery();
  const searchKeyword = query.get('search')?.toLowerCase() || '';

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:3001/products');
      const data = await res.json();

      if (res.status === 201) {
        const now = new Date();
        const expired = data.filter(p => p.ExpiryDate && new Date(p.ExpiryDate) < now);
        const valid = data.filter(p => !p.ExpiryDate || new Date(p.ExpiryDate) >= now);

        setExpiredProducts(expired);
        setProductData(valid);
        if (valid.length === 0) setMessage('All products expired or none available.');
      } else {
        setMessage('❌ Failed to fetch products. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`http://localhost:3001/deleteproduct/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      getProducts();
      setMessage('✅ Product deleted.');
    } catch (err) {
      console.error(err);
      setMessage('❌ Error deleting product.');
    }
  };

  const confirmDeleteExpired = async () => {
    for (const p of expiredProducts) {
      await fetch(`http://localhost:3001/deleteproduct/${p._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
    }
    setExpiredProducts([]);
    setShowExpiryModal(false);
    getProducts();
  };

  const cancelDeleteExpired = () => {
    setShowExpiryModal(false);
  };

  const filteredProducts = productData
    .filter(p => p.ProductName?.toLowerCase().includes(searchKeyword))
    .filter(p => {
      if (filter === 'near') return isNearExpiry(p.ExpiryDate);
      return true;
    });

  const nearCount = productData.filter(p => isNearExpiry(p.ExpiryDate)).length;

  const totalValue = filteredProducts.reduce((sum, item) => {
    const price = parseFloat(item.ProductPrice) || 0;
    const qty = parseInt(item.ProductQuantity) || 0;
    return sum + price * qty;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">📦 Product Inventory</h1>

      {searchKeyword && (
        <p className="text-gray-600 mb-4">
          Searching: <span className="font-semibold">{searchKeyword}</span>
        </p>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <NavLink
          to="/insertproduct"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-lg font-medium shadow"
        >
          + Add New Product
        </NavLink>

        <select
          className="border rounded-md px-4 py-2 text-gray-700"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Show All</option>
          <option value="near">Near Expiry (≤ 30 days)</option>
        </select>
      </div>

      {message && (
        <div className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-2 rounded mb-4 max-w-xl">
          {message}
        </div>
      )}

      {nearCount > 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded mb-4 max-w-xl">
          ⚠ {nearCount} product{nearCount > 1 ? 's are' : ' is'} near expiry (within 30 days)!
        </div>
      )}

      {showExpiryModal && expiredProducts.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-md shadow-md w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4">⚠ Expired Products Found</h3>
            <p className="text-gray-700 mb-6">
              {expiredProducts.length} product(s) are expired. Do you want to delete them now?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                onClick={cancelDeleteExpired}
              >
                No
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={confirmDeleteExpired}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-lg text-gray-600 mt-6">Loading products...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p, i) => (
                <div
                  key={p._id}
                  className="relative bg-white rounded-lg shadow hover:shadow-md p-4 border border-gray-200 transition-transform hover:-translate-y-1"
                >
                  {isNearExpiry(p.ExpiryDate) && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-medium">
                      ⏳ Near Expiry
                    </span>
                  )}
                  <div className="text-5xl text-blue-500 mb-3 text-center">📦</div>
                  <h2 className="text-lg font-semibold text-gray-800 text-center">{p.ProductName}</h2>

                  <div className="mt-3 space-y-1 text-sm text-gray-700">
                    <p><strong>Price:</strong> ₹{parseFloat(p.ProductPrice).toFixed(2)}</p>
                    <p><strong>Barcode:</strong> {p.ProductBarcode}</p>
                    <p><strong>Qty:</strong> {p.ProductQuantity}</p>
                    <p><strong>Expiry:</strong> {p.ExpiryDate ? p.ExpiryDate.slice(0, 10) : '-'}</p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <NavLink
                      to={`/updateproduct/${p._id}`}
                      className="text-yellow-600 hover:text-yellow-800 text-sm font-semibold"
                    >
                      <i className="fas fa-edit mr-1"></i> Edit
                    </NavLink>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold"
                    >
                      <i className="fas fa-trash mr-1"></i> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No products available.</p>
            )}
          </div>

          <div className="mt-10 bg-green-50 border border-green-300 rounded-md p-4 text-right max-w-sm ml-auto">
            <h5 className="text-lg font-semibold mb-1">💰 Total Inventory Value</h5>
            <p className="text-2xl font-bold text-green-700">₹{totalValue.toFixed(2)}</p>
          </div>
        </>
      )}
    </div>
  );
}
