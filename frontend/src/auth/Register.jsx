import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/dashboard/Sidebar";
import NavbarD from "../components/dashboard/NavbarD";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const { login, user } = useAuth();

const handleRegister = async (e) => {
  e.preventDefault();
  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    const res = await axios.post("/api/users/register", {
      username: username,
      password: password,
      email: role === "SuperUser" ? email : undefined, // Conditionally include email
      companyName: role !== "SuperUser" ? companyName : undefined, // Conditionally include companyName
      facilityName: role !== "SuperUser" ? facilityName : undefined, // Conditionally include facilityName
      role: role, 
    });

    const { user, accessToken } = res.data.data;
    localStorage.setItem("accessToken", accessToken);
    login(user, accessToken);
    toast.success("Registration successful!");
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  } catch (error) {
    if (error.response?.status === 409) {
      setError("Username already exists");
    } else {
      setError(error.response?.data?.message || "Registration failed");
    }
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-100 to-gray-200">
      <NavbarD />
      <div className="flex">
        <div className="w-1/6 sticky top-0 h-screen">
          <Sidebar />
        </div>
        <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-8 shadow-lg rounded-lg">
            <div>
              <h2 className="text-center text-3xl font-extrabold text-gray-900">
                Create your account
              </h2>
            </div>
            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="rounded-md shadow-sm">
                <div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {password !== confirmPassword && confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>
                {role !== "SuperUser" && (
                  <>
                    <div>
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        required
                        className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Company Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        id="facilityName"
                        name="facilityName"
                        type="text"
                        required
                        className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Facility Name"
                        value={facilityName}
                        onChange={(e) => setFacilityName(e.target.value)}
                      />
                    </div>
                  </>
                )}
                {role === "SuperUser" && (
                  <div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}
                <div>
                  <select
                    id="role"
                    name="role"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Select your role</option>
                    <option value="Admin">Admin</option>
                    <option value="FacAdmin">Facility Admin</option>
                    <option value="Employee">Employee</option>
                    {user?.role === "SuperUser" && (
                      <option value="SuperUser">SuperUser</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Register
                </button>
              </div>
            </form>

            {error && (
              <p className="mt-4 text-center text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;
