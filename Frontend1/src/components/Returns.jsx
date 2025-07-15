import React, { useEffect, useState } from 'react';
import API from '../api'; // ✅ Axios instance with VITE_API_BASE

export default function Returns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center">
          🔄 Product Returns Log
        </h1>

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
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Barcode</th>
                  <th className="px-4 py-3 text-left">Qty Returned</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Discount</th>
                  <th className="px-4 py-3 text-left">Return Value</th>
                  <th className="px-4 py-3 text-left">Money Received</th>
                  <th className="px-4 py-3 text-left">Cost Impact</th>
                  <th className="px-4 py-3 text-left">Reason</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {returns.map((r, index) => (
                  <tr
                    key={r._id}
                    className="border-t hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 font-medium text-gray-900">{r.ProductName}</td>
                    <td className="px-4 py-2 text-gray-600">{r.ProductBarcode}</td>
                    <td className="px-4 py-2">{r.returnedQuantity}</td>
                    <td className="px-4 py-2">₹{r.productPrice?.toFixed(2)}</td>
                    <td className="px-4 py-2">₹{r.discount?.toFixed(2)}</td>
                    <td className="px-4 py-2 text-green-700 font-semibold">₹{r.returnValue?.toFixed(2)}</td>
                    <td className="px-4 py-2">₹{r.actualMoneyReceived?.toFixed(2)}</td>
                    <td
                      className={`px-4 py-2 font-bold ${
                        r.costImpact < 0 ? 'text-red-600' : 'text-gray-800'
                      }`}
                    >
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
