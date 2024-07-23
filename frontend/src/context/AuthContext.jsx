import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios"; // Make sure to import axios

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

   axios.defaults.baseURL = "http://127.0.0.1:8000";
   axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkUserAuth = async () => {
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        try {
          const response = await axios.get("/api/users/verify-token", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          console.log("Response from verify-token:", response.data);
          if (response.data.isValid) {
            setUser(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));
          } else {
            Cookies.remove("accessToken");
            localStorage.removeItem("user");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          Cookies.remove("accessToken");
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };

    checkUserAuth();
  }, []);

  const login = (userData, token) => {
    console.log("Login called with userData:", userData);
    console.log("Login called with token:", token);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(user));
    Cookies.set("token", token, {
      secure: true,
      sameSite: "strict",
    });
  };

 const logout = async () => {
   const accessToken = Cookies.get("accessToken");
   try {
     await axios.post(
       "/api/users/logout",
       {},
       {
         withCredentials: true,
         headers: {
           Authorization: `Bearer ${Cookies.get("accessToken")}`,
         },
       }
     );
     setUser(null);
    //  localStorage.removeItem("user");
    //  Cookies.remove("accessToken");
    //  Cookies.remove("refreshToken");
   } catch (error) {
    //  console.error("Logout failed:", error);
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
