import React from 'react';
import inventoryImage from '../assets/inventory.jpg'; 

export default function About() {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Text Section */}
        <div>
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            🛒 QuickMart
          </h1>

          <p className="text-lg text-gray-700 mb-4">
            This <span className="font-semibold">MERN</span> CRUD application helps shopkeepers manage their product inventory effortlessly. It supports:
          </p>

          <ul className="list-disc list-inside text-gray-800 text-base space-y-2 mb-6">
            <li>📦 Add new products with name, price & barcode</li>
            <li>🔍 View & search product inventory</li>
            <li>✏️ Update existing product details</li>
            <li>🗑️ Delete expired or unsold products</li>
            <li>🧾 Generate bills and track transactions</li>
            <li>📊 View billing history and summaries</li>
          </ul>

          <p className="text-md text-gray-600 mb-6">
            Built with <span className="font-semibold">MongoDB</span>, <span className="font-semibold">Express.js</span>, <span className="font-semibold">React</span>, and <span className="font-semibold">Node.js</span>, this system is crafted to mirror real-world retail needs, just like platforms such as <span className="font-semibold">Amazon</span> or <span className="font-semibold">Flipkart</span>.
          </p>

          <div className="text-sm text-gray-500 mt-4">
            Developed by <span className="font-semibold">Tanish Jindal</span> & <span className="font-semibold">Prasoon Mishra</span> · © 2025
          </div>
        </div>

        {/* Image Section */}
        <div className="flex justify-center">
          <img
            src={inventoryImage}
            alt="Inventory Management Illustration"
            className="w-full max-w-md shadow-md rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
