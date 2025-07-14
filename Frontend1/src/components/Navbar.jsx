import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ title = 'QuickMart' }) {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/returns', label: 'Returns' },
    { to: '/billing', label: 'Billing' },
    { to: '/about', label: 'About' },
    { to: '/invoices', label: 'Billing History' },
  ];

  return (
    <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md sticky top-0 z-50 rounded-b-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <NavLink to="/" className="text-3xl font-extrabold text-white drop-shadow-lg">
            🛒 Quick<span className="text-yellow-300">Mart</span>
          </NavLink>
        </motion.div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Links */}
        <nav className="hidden lg:flex gap-6 items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-1 rounded-full text-sm font-medium transition ${
                  isActive ? 'bg-white text-purple-700' : 'text-white hover:bg-white/20'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Search */}
        <form
          onSubmit={handleSubmit}
          className="hidden lg:flex items-center gap-2"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="rounded-full px-4 py-1 text-sm border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <button
            type="submit"
            className="bg-yellow-300 hover:bg-yellow-400 text-purple-900 font-semibold px-4 py-1 rounded-full"
          >
            Search
          </button>
        </form>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-pink-50 px-4 py-4 space-y-2 rounded-b-xl"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block py-2 px-4 rounded-full text-sm font-medium ${
                    isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-purple-50'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}

            <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="rounded-full px-4 py-1 text-sm w-full border border-gray-300"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700"
              >
                Go
              </button>
            </form>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
