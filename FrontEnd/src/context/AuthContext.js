import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const isAuthenticated = !!token && !!user;

  const login = useCallback((authToken, username) => {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify({ username }));
    setToken(authToken);
    setUser({ username });
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
