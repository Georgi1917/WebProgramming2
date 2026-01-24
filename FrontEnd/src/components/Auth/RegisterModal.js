import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './LoginModal.css';

function RegisterModal() {
  const { showRegisterModal, setShowRegisterModal, switchToLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', { username, email, password });
      setSuccess('Registration successful! Redirecting to login...');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        switchToLogin();
      }, 1500);
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Username already exists');
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowRegisterModal(false);
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  if (!showRegisterModal) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-header">
          <h2>Create Account</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <div className="login-modal-content">
          <p>Create a new account to get started.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="register-username">Username</label>
              <input
                id="register-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-email">Email</label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-confirm-password">Confirm Password</label>
              <input
                id="register-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-actions">
              <button
                type="submit"
                className="btn-login"
                disabled={loading || !username || !email || !password || !confirmPassword}
              >
                {loading ? 'Creating Account...' : 'Register'}
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
              <p>Already have an account? <button type="button" className="link-btn" onClick={switchToLogin}>Login here</button></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;
