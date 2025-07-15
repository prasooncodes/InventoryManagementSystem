import React from 'react';
import bgImage from '../assets/inventory.jpg'; // Ensure this image exists

export default function About() {
  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white/80 backdrop-blur-sm p-10 md:p-16 rounded-xl shadow-2xl max-w-4xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
          🛒 Welcome to <span className="text-indigo-600">QuickMart</span>
        </h1>

        <p className="text-lg text-gray-700 mb-4">
          <strong>QuickMart</strong> is your all-in-one solution for managing store inventory, billing,
          returns, and transactions — inspired by the efficiency of platforms like <strong>Amazon</strong> and <strong>Flipkart</strong>.
        </p>

        <ul className="list-disc list-inside text-gray-800 space-y-2 text-base mb-6">
          <li>📦 Easily add, update, or delete products</li>
          <li>🔎 Smart search with barcode support</li>
          <li>🧾 Generate PDF bills and manage transactions</li>
          <li>📊 Track sales history and stock valuation</li>
          <li>⚡ Works offline with cloud-sync support</li>
        </ul>

        <p className="text-sm text-gray-600 mb-2">
          Built with <strong>MERN Stack</strong>: MongoDB, Express, React, and Node.js.
        </p>

        <div className="text-sm text-gray-500 border-t pt-3 mt-4">
          Developed by <strong>Prasoon Mishra</strong> & <strong>Tanish Jindal</strong> · © 2025
        </div>
      </div>
    </div>
  );
}
