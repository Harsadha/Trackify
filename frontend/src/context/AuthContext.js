// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate user from localStorage on page refresh
 useEffect(() => {
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") {
      setUser(JSON.parse(stored));
    }
  } catch (err) {
    console.error("Failed to parse user from localStorage:", err);
  } finally {
    setLoading(false);
  }
}, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};