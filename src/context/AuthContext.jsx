import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: 'usr-101',
  name: 'Sathwik Pasupuleti',
  email: 'sathwikpasupuleti29@gmail.com',
  preferredLanguages: ['Telugu', 'Hindi', 'Tamil', 'English'],
  audioQuality: 'High (320kbps)',
  privateSession: false,
  joinedDate: 'October 2026',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ragaa_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ragaa_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ragaa_user');
    }
  }, [user]);

  const login = (email, password, rememberMe = true) => {
    setAuthError(null);
    if (!email || !password) {
      setAuthError('Please provide both email and password.');
      return false;
    }
    const loggedInUser = {
      ...DEFAULT_USER,
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    };
    setUser(loggedInUser);
    if (rememberMe) {
      localStorage.setItem('ragaa_remember_me', 'true');
    }
    return true;
  };

  const register = (name, email, password) => {
    setAuthError(null);
    if (!name || !email || !password) {
      setAuthError('All fields are required.');
      return false;
    }
    const newUser = {
      id: 'usr-' + Date.now(),
      name,
      email,
      preferredLanguages: ['Telugu', 'Hindi', 'Tamil', 'English'],
      audioQuality: 'High (320kbps)',
      privateSession: false,
      joinedDate: 'Just now',
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ragaa_user');
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedFields };
      return updated;
    });
  };

  const forgotPassword = (email) => {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    return {
      success: true,
      message: `Password reset instructions have been sent to ${email}. Check your inbox!`,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authError,
        setAuthError,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
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
