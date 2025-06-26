import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="navbar-brand">
          Coupon Manager
        </Link>
        
        <ul className="navbar-nav">
          <li>
            <span style={{ color: '#666', marginRight: '10px' }}>
              Welcome, {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '5px 15px', fontSize: '12px' }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 