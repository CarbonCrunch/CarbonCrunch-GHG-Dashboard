import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // axios.defaults.baseURL = "http://127.0.0.1:8000";
  axios.defaults.baseURL = "https://ghg.carboncrunch.in";
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkUserAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          const response = await axios.get("/api/users/verify-token", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          // console.log("Response from verify-token:", response.data);
          if (response.data.isValid) {
            setUser(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));
          } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };

    checkUserAuth();
  }, []);

  const login = (userData, token) => {
    // console.log("Login called with userData:", userData);
    // console.log("Login called with token:", token);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", token);
  };

  const logout = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      await axios.post(
        "/api/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or any loading component
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
