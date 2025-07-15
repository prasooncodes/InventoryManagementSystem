import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Returns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // form states
  const [barcode, setBarcode] = useState('');
  const [returnQty, setReturnQty] = useState('');
  const [reason, setReason] = useState('');
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const res = await API.get('/api/returns');
      setReturns(res.data);
    } catch (err) {
      console.error(err);
      setError('Server error while fetching return data.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    setFormMessage('');

    if (!barcode || !returnQty || !reason) {
      setFormMessage('❌ Please fill all return fields.');
      return;
    }

    try {
      const res = await API.post('/api/returnproduct', {
        barcode,
        returnQty: parseInt(returnQty),
        reason,
      });

      if (res.status === 200) {
        setFormMessage('✅ Product returned successfully.');
        setBarcode('');
        setReturnQty('');
        setReason('');
        fetchReturns(); // refresh log
      } else {
        setFormMessage('❌ Return failed. Try again.');
      }
    } catch (err) {
      console.error(err);
      setFormMessage('❌ Server error during return.');
    }
  };

  return (
    <div className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center">🔁 Product Returns</h1>

        {/* Return Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Initiate a Return</h2>
          <form onSubmit={handleReturnSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Product Barcode"
              className="w-full border rounded px-4 py-2"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
            />
            <input
              type="number"
              placeholder="Return Quantity"
              className="w-full border rounded px-4 py-2"
              value={returnQty}
              onChange={(e) => setReturnQty(e.target.value)}
              min={1}
            />
            <select
              className="w-full border rounded px-4 py-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Select Reason</option>
              <option value="expired">Expired</option>
              <option value="damaged">Damaged</option>
              <option value="customer return">Customer Return</option>
              <option value="other">Other</option>
            </select>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium"
            >
              Process Return
            </button>
          </form>

          {formMessage && <p className="mt-4 text-sm text-gray-700">{formMessage}</p>}
        </div>

        {/* Return Logs */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">📋 Return History</h2>
        {loading && <p className="text-gray-600">Loading return records...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && returns.length === 0 && (
          <p className="text-gray-500 text-center">No return records found.</p>
        )}

        {!loading && returns.length > 0 && (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Barcode</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Discount</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Received</th>
                  <th className="px-4 py-3">Impact</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {returns.map((r, index) => (
                  <tr key={r._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{r.ProductName}</td>
                    <td className="px-4 py-2">{r.ProductBarcode}</td>
                    <td className="px-4 py-2">{r.returnedQuantity}</td>
                    <td className="px-4 py-2">₹{r.productPrice?.toFixed(2)}</td>
                    <td className="px-4 py-2">₹{r.discount?.toFixed(2)}</td>
                    <td className="px-4 py-2 text-green-700 font-semibold">₹{r.returnValue?.toFixed(2)}</td>
                    <td className="px-4 py-2">₹{r.actualMoneyReceived?.toFixed(2)}</td>
                    <td className={`px-4 py-2 font-bold ${r.costImpact < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                      ₹{r.costImpact?.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 capitalize">{r.reason}</td>
                    <td className="px-4 py-2 text-gray-500">
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
