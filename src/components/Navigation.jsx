import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-black bg-opacity-80 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex space-x-8">
          {/* Customer Routes */}
          {user && user.role === 'customer' && (
            <li>
              <Link to="/" className="text-white hover:text-yellow-400 transition-colors">
                Add Lead
              </Link>
            </li>
          )}

          {/* Employee Routes */}
          {user && user.role === 'employee' && (
            <>
              <li>
                <Link to="/leads" className="text-white hover:text-yellow-400 transition-colors">
                  Lead Management
                </Link>
              </li>
              <li>
                <Link to="/itinerary" className="text-white hover:text-yellow-400 transition-colors">
                  Itinerary
                </Link>
              </li>
              <li>
                <Link to="/proposals" className="text-white hover:text-yellow-400 transition-colors">
                  Proposals
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="flex items-center space-x-4">
          {user && (
            <>
              <span className="text-yellow-400 mr-4">
                Welcome, {user.username} ({user.role})
              </span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;