import React from 'react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">
        Inventory Management System (IMS)
      </h1>

      <p className="text-lg text-gray-700 mb-4">
        This <span className="font-semibold">MERN</span> CRUD application empowers shopkeepers to manage their product inventory efficiently.
        Key features include:
      </p>

      <ul className="list-disc list-inside text-gray-800 text-base space-y-2 mb-6">
        <li>📦 Adding new products with name, price, and barcode</li>
        <li>📋 Viewing current product inventory</li>
        <li>✏️ Updating existing product details</li>
        <li>🗑️ Deleting products from the inventory</li>
      </ul>

      <p className="text-lg text-gray-700 mb-4">
        Built with <span className="font-semibold">MongoDB</span>, <span className="font-semibold">Express.js</span>, <span className="font-semibold">React</span>, and <span className="font-semibold">Node.js</span>,
        the system supports both cloud-based and offline-first workflows for real-world retail needs.
      </p>

      <div className="text-sm text-gray-500 mt-8 border-t pt-4">
        Developed by <span className="font-semibold">Tanish Jindal</span> & <span className="font-semibold">Prasoon Mishra</span> · © 2025
      </div>
    </div>
  );
}
