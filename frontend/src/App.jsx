import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import CreateCoupon from './components/CreateCoupon';
import EditCoupon from './components/EditCoupon';
import CouponDetail from './components/CouponDetail';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Main App Component
const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {isAuthenticated && <Navbar />}
      <div className="container">
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/" /> : <Register />
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute>
              <CreateCoupon />
            </ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <EditCoupon />
            </ProtectedRoute>
          } />
          <Route path="/coupon/:id" element={
            <ProtectedRoute>
              <CouponDetail />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
};

// App Component with Auth Provider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App; 