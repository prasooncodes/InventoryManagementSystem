import React, { useEffect, useState } from 'react';

export default function BillingHistory() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await fetch('http://localhost:3001/invoices');
      const data = await res.json();
      if (res.status === 200) {
        setBills(data);
      } else {
        setError('Failed to load billing history.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">📜 Billing History</h1>

      {loading && <p className="text-gray-600">Loading bills...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && bills.length === 0 && (
        <p className="text-gray-500">No bills found.</p>
      )}

      {!loading && bills.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="p-3 border">#</th>
                <th className="p-3 border">Customer</th>
                <th className="p-3 border">Payment Mode</th>
                <th className="p-3 border">Total Amount</th>
                <th className="p-3 border">Amount Received</th>
                <th className="p-3 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, index) => (
                <tr key={bill._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border">{bill.customerName}</td>
                  <td className="p-3 border">{bill.paymentMode}</td>
                  <td className="p-3 border">₹{bill.totalAmount.toFixed(2)}</td>
                  <td className="p-3 border">₹{bill.amountReceived.toFixed(2)}</td>
                  <td className="p-3 border">{new Date(bill.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
