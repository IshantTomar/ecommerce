import React from 'react';
import { Link } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import useLogout from '../hooks/useLogout';

const Header = () => {
  const { handleLogout, handleLogoutAll } = useLogout();

  const user = useUserStore((state) => state.user);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-indigo-900">
      {/* Left */}
      <Link to="/dashboard" className="flex items-center gap-3">
        <img src="/logo.png" alt="logo" className="w-10 h-10" />
        <h1 className="text-4xl font-semibold">E-Commerce</h1>
      </Link>

      {/* Right */}
      <nav className="flex items-center gap-6 text-sm font-medium text-white">
        <Link to="/about" className="hover:text-indigo-400 hover:underline">
          About
        </Link>
        <Link to="/contact" className="hover:text-indigo-400 hover:underline">
          Contact Us
        </Link>

        {/* User dropdown */}
        <div className="relative group">
          <span className="cursor-pointer hover:text-indigo-400 underline text-base">
            {user?.username}
          </span>

          {/* Background overlay */}
          <div className="pointer-events-none fixed left-0 right-0 bottom-0 top-16 bg-black/40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10"></div>

          {/* Dropdown */}
          <div className="absolute right-0 mt-0.5 w-48 bg-gray-900 border border-indigo-900 rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
            <Link
              to="/manage-products"
              className="block px-4 py-2 hover:bg-gray-800 hover:text-indigo-400 hover:underline"
            >
              Manage Products
            </Link>

            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-800 hover:text-indigo-400 hover:underline"
              onClick={handleLogout}
            >
              Logout
            </button>

            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-800 hover:text-indigo-400 hover:underline"
              onClick={handleLogoutAll}
            >
              Logout All Devices
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
