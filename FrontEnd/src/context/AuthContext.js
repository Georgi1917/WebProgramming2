import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

// Helper function to decode JWT and extract user ID
const decodeToken = (token) => {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    // The user ID is typically in the 'sub' or 'nameid' claim
    return decoded.sub || decoded.nameid || decoded.userId || null;
  } catch (e) {
    console.error('Failed to decode token:', e);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('authToken');
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;
    
    // If we have a token but the user object doesn't have an ID, decode it
    if (savedToken && parsedUser && !parsedUser.id) {
      const userId = decodeToken(savedToken);
      if (userId) {
        parsedUser.id = parseInt(userId, 10);
      }
    }
    
    return parsedUser;
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const isAuthenticated = !!token && !!user;

  const login = useCallback((authToken, username) => {
    const userId = decodeToken(authToken);
    const userData = { username, id: userId ? parseInt(userId, 10) : null };
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const requireLogin = useCallback((action) => {
    if (!isAuthenticated) {
      setPendingAction(() => action);
      setShowLoginModal(true);
      return false;
    }
    return true;
  }, [isAuthenticated]);

  const executePendingAction = useCallback(() => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setShowLoginModal(false);
  }, [pendingAction]);

  const switchToRegister = useCallback(() => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  }, []);

  const switchToLogin = useCallback(() => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        logout,
        requireLogin,
        showLoginModal,
        setShowLoginModal,
        showRegisterModal,
        setShowRegisterModal,
        executePendingAction,
        switchToRegister,
        switchToLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
