import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/landingPage/Header";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingToken = async () => {
      const token = localStorage.getItem("accessToken");
      // console.log("Token from localStorage:", token);
      if (token) {
        // axios.defaults.baseURL = "http://127.0.0.1:8000";
        axios.defaults.baseURL = "http://64.227.131.250:8000";
        https: axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        try {
          const response = await axios.get("/api/users/verify-token");
          if (response.data.isValid) {
            login(response.data.user, token);
            navigate("/dashboard");
          } else {
            localStorage.removeItem("accessToken");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          localStorage.removeItem("accessToken");
        }
      }
      setIsLoading(false);
    };

    checkExistingToken();
  }, [login, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/users/login", {
        username: username,
        password: password,
        facilityName: facilityName,
      });
      const { user, accessToken } = res.data.data;
      localStorage.setItem("accessToken", accessToken); // Store accessToken in localStorage
      login(user, accessToken);
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid Username/Password or Facility Name");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="facilityName" className="sr-only">
                  Facility Name
                </label>
                <input
                  id="facilityName"
                  name="facilityName"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Facility Name"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>

          {error && (
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
          )}

          <div className="text-sm text-center">
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Don't have an account? Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
