import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/AuthContext.jsx';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SubmitIssue from './pages/SubmitIssue';
import RedeemCredits from './pages/RedeemCredits';
import ReviewIssues from './pages/ReviewIssues';
import CourseCatalog from './pages/CourseCatalog';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/submit" element={<PrivateRoute><SubmitIssue /></PrivateRoute>} />
            <Route path="/redeem" element={<PrivateRoute><RedeemCredits /></PrivateRoute>} />
            <Route path="/review" element={<PrivateRoute><ReviewIssues /></PrivateRoute>} />
            <Route path="/courses" element={<PrivateRoute><CourseCatalog /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
