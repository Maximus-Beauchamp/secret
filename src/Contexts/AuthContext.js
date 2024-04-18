import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const persistAuthUser = (user) => {
  if (user) {
    // Ensure that user is directly an object here, and not a stringified object within a string
    localStorage.setItem('authUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('authUser');
  }
};

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => {
    const storedUser = localStorage.getItem('authUser');
    // Ensure direct parsing of the stored JSON, without additional string layers
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(!!authUser);

  useEffect(() => {
    persistAuthUser(authUser);
  }, [authUser]);

  const value = {
    authUser,
    setAuthUser,
    isLoggedIn,
    setIsLoggedIn
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
