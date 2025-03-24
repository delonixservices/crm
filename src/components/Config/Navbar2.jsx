import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/config', label: 'Enter City Details' },
    { path: '/config/cities', label: 'City List' },
  ];

  return (
    <div>
      <nav className="bg-gray-800 p-4 mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="text-white font-bold text-xl">Travel Details</div>

          {/* Navigation Links */}
          <div className="space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${
                  location.pathname === link.path
                    ? 'bg-gray-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Render Nested Routes */}
      <div className="container mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Navbar;
