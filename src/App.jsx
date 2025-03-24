// Keep these regular imports
import React, { useContext, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { Outlet } from 'react-router-dom';
import "./App.css";

// Add a simple loading spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
  </div>
);

// Lazy imports
const ItineraryApp = lazy(() => import("./components/ItineraryApp"));
const ProposalsTable = lazy(() => import("./components/ProposalsTable"));
const ProposalView = lazy(() => import("./components/ProposalView"));
const LeadForm = lazy(() => import("./components/LeadForm"));
const LeadTable = lazy(() => import("./components/LeadTable"));
const LeadView = lazy(() => import("./components/LeadView"));
const ProposalEdit = lazy(() => import("./components/ProposalEdit"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));

// Additional components for City management
import CityForm from "./components/Config/CityForm";
import CityList from "./components/Config/CityList";
import CityDetail from "./components/Config/CityDetail";
import EditCity from "./components/Config/EditCity";
import Navbar from "./components/Config/Navbar2";

// Create PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <Router>
      <div className="App min-h-screen w-full bg-black text-white relative">
        {/* Starry Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {Array.from({ length: 100 }).map((_, index) => {
            const size = Math.random() * 2 + 1;
            return (
              <div
                key={index}
                className="absolute bg-white rounded-full opacity-70"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 5 + 3}s ease-in-out infinite`,
                }}
              ></div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="relative z-10 overflow-auto">
          {isAuthenticated && (
            <nav className="bg-black bg-opacity-80 py-4 shadow-md">
              <div className="container mx-auto flex justify-between items-center">
                <ul className="flex space-x-8">
                  <li>
                    <Link to="/" className="text-white hover:text-yellow-400 transition-colors">
                      Add Lead
                    </Link>
                  </li>
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
                  <li>
                    <Link to="/config" className="text-white hover:text-yellow-400 transition-colors">
                      Config
                    </Link>
                  </li>
                </ul>
                <div className="flex items-center space-x-4">
                  {user && (
                    <span className="text-yellow-400 mr-4">
                      Welcome, {user.name}
                    </span>
                  )}
                  <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </nav>
          )}

          <div className="container mx-auto p-4">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/login"
                  element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
                />
                <Route
                  path="/register"
                  element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
                />
                <Route
                  path="/forgot-password"
                  element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/" />}
                />
                <Route
                  path="/reset-password/:token"
                  element={!isAuthenticated ? <ResetPassword /> : <Navigate to="/" />}
                />

                {/* Protected Routes */}
                <Route path="/" element={
                  <PrivateRoute>
                    <LeadForm />
                  </PrivateRoute>
                } />
                <Route path="/leads" element={
                  <PrivateRoute>
                    <LeadTable />
                  </PrivateRoute>
                } />
                <Route path="/lead-details/:id" element={
                  <PrivateRoute>
                    <LeadView />
                  </PrivateRoute>
                } />
                <Route path="/itinerary" element={
                  <PrivateRoute>
                    <ItineraryApp />
                  </PrivateRoute>
                } />
                <Route path="/proposals" element={
                  <PrivateRoute>
                    <ProposalsTable />
                  </PrivateRoute>
                } />
                <Route path="/proposal-view/:id" element={
                  <PrivateRoute>
                    <ProposalView />
                  </PrivateRoute>
                } />
                <Route path="/proposals/edit/:id" element={
                  <PrivateRoute>
                    <ProposalEdit />
                  </PrivateRoute>
                } />

                {/* Config Routes */}
                <Route path="/config" element={<Navbar />}>
  <Route index element={<CityForm />} />
  <Route path="cities" element={<CityList />} />
  <Route path="city/:id" element={<CityDetail />} />
  <Route path="edit-city/:id" element={<EditCity />} />
</Route>;
                {/* Catch all redirect to login */}
                <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
