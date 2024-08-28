import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user as null

  axios.defaults.baseURL = "http://127.0.0.1:8000";
  axios.defaults.withCredentials = true;

  // On initial load, check for stored user data in cookies
  useEffect(() => {
    const storedUser = Cookies.get("user"); // Get user from cookies

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // Parse and set user from cookie if it exists
      } catch (error) {
        console.error("Error parsing user data from cookie:", error);
        Cookies.remove("user"); // Remove corrupt user cookie
      }
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData); // Set user state in React
    Cookies.set("user", JSON.stringify(userData), { expires: 1 }); // Store user in cookie (1 day expiry)
    Cookies.set("accessToken", token, { expires: 1 }); // Store accessToken in cookie (1 day expiry)
  };

  const logout = async () => {
    const accessToken = Cookies.get("accessToken"); // Get accessToken from cookies
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
      setUser(null); // Clear user state
      Cookies.remove("user"); // Remove user from cookies
      Cookies.remove("accessToken"); // Remove accessToken from cookies
      Cookies.remove("refreshToken"); // Remove refreshToken from cookies if used
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
