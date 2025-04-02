import React, { createContext, useState, useEffect } from "react";
import { getUserData } from "../services/authServices";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  const login = async (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    try {
      const userData = await getUserData();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const userData = await getUserData();
          setUser(userData);
        } catch (error) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    fetchUserData();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
