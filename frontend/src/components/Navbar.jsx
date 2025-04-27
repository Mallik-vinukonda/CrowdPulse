import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext.jsx';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const navLinks = (
    <>
      <Link to="/submit" className="hover:text-blue-600">Report Issue</Link>
      <Link to="/courses" className="hover:text-blue-600">ResourceHub</Link>
      {user && (
        <>
          <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <Link to="/redeem" className="hover:text-blue-600">Redeem</Link>
          <Link to="/profile" className="hover:text-blue-600">Profile</Link>
          {user.role === 'moderator' && <Link to="/review" className="hover:text-blue-600">Review</Link>}
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white/80 shadow px-4 py-3 flex items-center justify-between sticky top-0 z-30 backdrop-blur">
      <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-blue-700 tracking-tight">
        <img src="/favicon.svg" alt="CrowdPulse logo" className="w-8 h-8" />
        CrowdPulse
      </Link>
      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-6 text-base font-medium">
        {navLinks}
        {user ? (
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold">Logout</button>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-600">Login</Link>
            <Link to="/register" className="border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-semibold">Register</Link>
          </>
        )}
      </div>
      {/* Mobile nav toggle */}
      <button className="block md:hidden p-2 text-blue-700" onClick={() => setMobileOpen(o => !o)}>
        {mobileOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
      </button>
      {/* Mobile nav menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setMobileOpen(false)}>
          <div className="absolute right-0 top-0 w-64 bg-white shadow-lg h-full flex flex-col gap-6 p-6 text-lg font-medium animate-slide-in overflow-y-auto">
            {navLinks}
            <div className="flex flex-col gap-3 mt-4">
              {user ? (
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold">Logout</button>
              ) : (
                <>
                  <Link to="/login" className="hover:text-blue-600">Login</Link>
                  <Link to="/register" className="border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-semibold">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
