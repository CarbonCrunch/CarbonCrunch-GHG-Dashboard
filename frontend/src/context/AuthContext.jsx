import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user state
  const [isLoading, setIsLoading] = useState(true); // Loading state to handle async checks

  axios.defaults.baseURL = "http://127.0.0.1:8000"; // Set base URL for axios
  axios.defaults.withCredentials = true; // Allow cookies to be sent with requests

  // On initial load, check for stored user data in cookies
  useEffect(() => {
    const accessToken = Cookies.get("accessToken"); // Get accessToken from cookies
    const storedUser = Cookies.get("user"); // Get user data from cookies
    // console.log("useEffect", accessToken, storedUser, "All-Cookies", Cookies.get());
    if (accessToken) {
      const verifyUserAuth = async () => {
        try {
          const response = await axios.get("/api/users/verify-token", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          console.log("response.data", response.data);

          // After verifying the token and getting a valid response
          if (response.data.isValid) {
            setUser((prevUser) => {
              // Include accessToken in the user object
              const updatedUser = { ...response.data.user, accessToken };

              // Log the updated user object for debugging
              // console.log("Updated user object:", updatedUser);

              // Return the new user state
              return updatedUser;
            });

            // Set the cookie with the new user data including accessToken
            Cookies.set(
              "user",
              JSON.stringify({ ...response.data.user, accessToken }),
              {
                expires: 1,
              }
            );
          } else {
            // Remove cookies if the token is not valid
            Cookies.remove("accessToken");
            Cookies.remove("user");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          Cookies.remove("accessToken");
          Cookies.remove("user");
        }
        setIsLoading(false); // Set loading to false after check
      };

      verifyUserAuth();
    } else {
      setIsLoading(false); // No accessToken or user stored, set loading to false
    }
  }, []);

  const login = (userData, token) => {
    // Update user data to include accessToken
    setUser((prevUser) => {
      const updatedUser = { ...userData, accessToken: token };

      // Log the updated user object for debugging
      // console.log("Updated user object:", updatedUser);

      // Return the new user state
      return updatedUser;
    });

    // Store user in cookie with accessToken included (1 day expiry)
    Cookies.set("user", JSON.stringify({ ...userData, accessToken: token }), {
      expires: 1,
    });
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
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Render a loading state while checking authentication
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
