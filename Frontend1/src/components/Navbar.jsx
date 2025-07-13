import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar({ title = 'Inventory System' }) {
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
    { to: '/invoices', label: 'Billing History' }, // ✅ Billing History Link
  ];

  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">
        {/* Logo / Title */}
        <NavLink to="/" className="text-2xl font-bold tracking-tight">
          {title}
        </NavLink>

        {/* Hamburger toggle */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Links */}
        <nav
          className={`${
            menuOpen ? 'block' : 'hidden'
          } absolute top-16 left-0 w-full bg-blue-700 lg:bg-transparent lg:static lg:flex lg:items-center gap-6 transition-all duration-300`}
        >
          <ul className="lg:flex lg:space-x-6 px-6 lg:px-0 py-3 lg:py-0">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block px-2 py-1 rounded transition hover:bg-white/10 ${
                      isActive ? 'font-semibold underline underline-offset-4' : ''
                    }`
                  }
                  onClick={() => {
                    if (window.innerWidth < 1024) setMenuOpen(false);
                  }}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Search */}
        <form
          onSubmit={handleSubmit}
          className="hidden lg:flex items-center space-x-2"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="rounded-md px-3 py-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-gray-100 font-semibold"
          >
            Search
          </button>
        </form>
      </div>
    </header>
  );
}
