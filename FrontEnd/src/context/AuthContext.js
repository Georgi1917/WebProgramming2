import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

// Helper function to decode JWT and extract user info (ID and role)
const decodeToken = (token) => {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    // The user ID is typically in the 'sub' or 'nameid' claim
    const userId = decoded.sub || decoded.nameid || decoded.userId || null;

    // Collect possible role claim names (different issuers/serializers use different keys)
    const roleCandidates = [
      decoded.role,
      decoded.Role,
      decoded.roles,
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role']
    ];

    let role = null;
    for (const cand of roleCandidates) {
      if (cand == null) continue;
      if (typeof cand === 'string' && cand.trim()) {
        role = cand;
        break;
      }
      if (Array.isArray(cand) && cand.length > 0) {
        // take the first role if an array is provided
        role = cand[0];
        break;
      }
      if (typeof cand === 'object' && cand.value) {
        role = cand.value;
        break;
      }
    }

    // debug logging removed
    return { userId, role };
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
    let parsedUser = savedUser ? JSON.parse(savedUser) : null;

    // If we have a token, decode it and ensure we populate id/role even if no saved user
    if (savedToken) {
      const tokenData = decodeToken(savedToken);
      if (tokenData) {
        if (!parsedUser) {
          parsedUser = {
            username: null,
            id: tokenData.userId ? parseInt(tokenData.userId, 10) : null,
            role: tokenData.role || null
          };
        } else {
          if (!parsedUser.id && tokenData.userId) {
            parsedUser.id = parseInt(tokenData.userId, 10);
          }
          if (!parsedUser.role && tokenData.role) {
            parsedUser.role = tokenData.role;
          }
        }
      }
    }

    return parsedUser;
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const isAuthenticated = !!token && !!user;

  const login = useCallback((authToken, username) => {
    const tokenData = decodeToken(authToken);
    const userData = {
      username,
      id: tokenData?.userId ? parseInt(tokenData.userId, 10) : null,
      role: tokenData?.role || null
    };
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
