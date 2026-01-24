import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, isAuthenticated, logout, setShowLoginModal, setShowRegisterModal } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🎵 Playlist Dashboard</Link>
      </div>
      <div className="navbar-menu">
        <p>Welcome to your Music Management System</p>
      </div>
      <div className="navbar-auth">
        {isAuthenticated ? (
          <div className="user-info">
            <span className="username">👤 {user?.username}</span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button onClick={() => setShowLoginModal(true)} className="btn-login-navbar">Login</button>
            <button onClick={() => setShowRegisterModal(true)} className="btn-register-navbar">Register</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;