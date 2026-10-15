import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'ragaa_user';
const USERS_KEY = 'ragaa_registered_users';

const getStoredUser = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const getRegisteredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (email, password, rememberMe = true) => {
    setAuthError(null);

    if (!email || !password) {
      setAuthError('Please provide both email and password.');
      return false;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const registeredUsers = getRegisteredUsers();
    const registeredUser = registeredUsers[normalizedEmail];

    // Only allow accounts registered in this browser.
    if (!registeredUser || registeredUser.password !== password) {
      setAuthError('Invalid email or password. Please register first.');
      return false;
    }

    const loggedInUser = {
      ...registeredUser.profile,
    };

    setUser(loggedInUser);

    if (rememberMe) {
      localStorage.setItem('ragaa_remember_me', 'true');
    } else {
      localStorage.removeItem('ragaa_remember_me');
    }

    return true;
  };

  const register = (name, email, password) => {
    setAuthError(null);

    if (!name?.trim() || !email?.trim() || !password) {
      setAuthError('All fields are required.');
      return false;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const registeredUsers = getRegisteredUsers();

    if (registeredUsers[normalizedEmail]) {
      setAuthError('An account with this email already exists.');
      return false;
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      preferredLanguages: ['Telugu', 'Hindi', 'Tamil', 'English'],
      audioQuality: 'High (320kbps)',
      privateSession: false,
      joinedDate: 'Just now',
    };

    registeredUsers[normalizedEmail] = {
      profile: newUser,
      password,
    };

    localStorage.setItem(USERS_KEY, JSON.stringify(registeredUsers));
    setUser(newUser);

    return true;
  };

  const logout = () => {
    setUser(null);
    setAuthError(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('ragaa_remember_me');
  };

  const updateProfile = (updatedFields) => {
    setUser((previousUser) => {
      if (!previousUser) return null;

      const updatedUser = {
        ...previousUser,
        ...updatedFields,
      };

      const registeredUsers = getRegisteredUsers();
      const email = updatedUser.email.toLowerCase();

      if (registeredUsers[email]) {
        registeredUsers[email].profile = updatedUser;
        localStorage.setItem(USERS_KEY, JSON.stringify(registeredUsers));
      }

      return updatedUser;
    });
  };

  const forgotPassword = (email) => {
    if (!email || !email.includes('@')) {
      return {
        success: false,
        message: 'Please enter a valid email address.',
      };
    }

    return {
      success: false,
      message:
        'Password reset requires a backend email service. Please contact support.',
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
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
