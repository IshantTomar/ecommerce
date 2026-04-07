import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import useLogout from '../hooks/useLogout';

const Header = () => {
  const { handleLogout, handleLogoutAll } = useLogout();
  const user = useUserStore((state) => state.user);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative flex items-center justify-between px-4 md:px-6 py-4 bg-gray-900 border-b border-indigo-900">
      {/* Left */}
      <Link to="/dashboard" className="flex items-center gap-3 focus:outline-none">
        <img src="/logo.png" alt="logo" className="w-8 h-8 md:w-10 md:h-10" />
        <h1 className="text-xl md:text-4xl font-semibold m-0">E-Commerce</h1>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white">
        <Link to="/about" className="hover:text-indigo-400 hover:underline">
          About
        </Link>
        <Link to="/contact" className="hover:text-indigo-400 hover:underline">
          Contact Us
        </Link>

        {/* Dropdown (desktop only) */}
        <div className="relative group">
          <span className="cursor-pointer hover:text-indigo-400 underline text-base">
            {user?.username}
          </span>

          <div className="absolute right-0 mt-1 w-48 bg-gray-900 border border-indigo-900 rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
            {/* Show only if user is a seller */}
            {user?.role === 'seller' && (
              <Link
                to="/manage-products"
                className="block px-4 py-2 hover:text-indigo-400 hover:underline"
              >
                Manage Products
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-800 hover:text-indigo-400 hover:underline"
            >
              Logout
            </button>

            <button
              onClick={handleLogoutAll}
              className="w-full text-left px-4 py-2 hover:bg-gray-800 hover:text-indigo-400 hover:underline"
            >
              Logout All Devices
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* Mobile Slide Menu */}
      <div
        className={`absolute top-full left-0 w-full bg-gray-900 border-t border-indigo-900 transform transition-all duration-300 md:hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="flex flex-col px-4 py-4 gap-3 text-white">
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>

          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            Contact Us
          </Link>

          <hr className="border-gray-700" />

          <span className="text-sm text-gray-400">{user?.username}</span>

          <Link to="/manage-products" onClick={() => setMenuOpen(false)}>
            Manage Products
          </Link>

          <button onClick={handleLogout} className="text-left">
            Logout
          </button>

          <button onClick={handleLogoutAll} className="text-left">
            Logout All Devices
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
