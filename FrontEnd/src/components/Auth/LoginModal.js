import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './LoginModal.css';

function LoginModal() {
  const { showLoginModal, setShowLoginModal, login, executePendingAction, switchToRegister } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      const { token } = response.data;
      
      login(token, username);
      
      // Set the token in API headers for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUsername('');
      setPassword('');
      
      // Execute the pending action if exists
      executePendingAction();
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowLoginModal(false);
    setUsername('');
    setPassword('');
    setError('');
  };

  if (!showLoginModal) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-header">
          <h2>Login Required</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <div className="login-modal-content">
          <p>You need to log in to perform this action.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button
                type="submit"
                className="btn-login"
                disabled={loading || !username || !password}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
            <div className="register-link">
              <p>Don't have an account? <button type="button" className="link-btn" onClick={switchToRegister}>Register here</button></p>
            </div>          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
