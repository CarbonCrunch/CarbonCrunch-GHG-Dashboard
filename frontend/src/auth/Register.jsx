import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/dashboard/Sidebar";
import NavbarD from "../components/dashboard/NavbarD";

const Register = () => {
  const [activeTab, setActiveTab] = useState("registerUser"); // State to manage active tab
  const [facilityName, setFacilityName] = useState("");
  const [facilityLocation, setFacilityLocation] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullAccess, setFullAccess] = useState(false);
  const [email, setEmail] = useState("");
  const [roleH, setRoleH] = useState("");
  const [permissions, setPermissions] = useState([
    { category: "", action: "" },
  ]);
  const [isRootUser, setIsRootUser] = useState(false); // New state to manage root user registration
  const [companyName, setCompanyName] = useState(""); // Make companyName stateful and editable
  const [error, setError] = useState("");

  const { user } = useAuth();

  // Permissions check
  const canRegisterUser =
    user?.role === "SuperUser" ||
    user?.facilities?.some((facility) =>
      facility.userRoles.some((role) =>
        role.permissions.some(
          (permission) =>
            permission.entity === "Role" &&
            (permission.actions.includes("create") ||
              permission.actions.includes("manage"))
        )
      )
    );

  const canCreateFacility =
    user?.role === "SuperUser" ||
    user?.facilities?.some((facility) =>
      facility.userRoles.some((role) =>
        role.permissions.some(
          (permission) =>
            permission.entity === "Facility" &&
            permission.actions.includes("create")
        )
      )
    );

  const canAssignPermissions =
    user?.role === "SuperUser" ||
    user?.facilities?.some((facility) =>
      facility.userRoles.some((role) =>
        role.permissions.some(
          (permission) =>
            permission.entity === "Facility" &&
            permission.actions.includes("create")
        )
      )
    );

  const handleCreateFacility = async (e) => {
    e.preventDefault();
    try {
     await axios.post(
       "/api/facilities/createFacility",
       {
         facilityName,
         facilityLocation,
       },
       {
         headers: {
           Authorization: `Bearer ${user.accessToken}`, // Include accessToken in headers
         },
         withCredentials: true, // Ensure cookies are sent
       }
     );

      toast.success("Facility created successfully!");
      setActiveTab("registerUser"); // Switch to next tab
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create facility."
      );
    }
  };

  const handleRegisterFacilityAdmin = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
     await axios.post(
       "/api/users/register",
       {
         username,
         password,
         email: isRootUser ? email : undefined, // Include email only if registering root user
         companyName: isRootUser ? undefined : companyName, // Include companyName only if not root user
         role: roleH,
       },
       {
         headers: {
           Authorization: `Bearer ${user.accessToken}`, // Include accessToken in headers
         },
         withCredentials: true, // Ensure cookies are sent
       }
     );


      toast.success("User created successfully!");
      setActiveTab("addUserPermission"); // Switch to next tab
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to register user.");
    }
  };

  const handleAssignPermissions = async (e) => {
    e.preventDefault();
    try {
     await axios.post(
       "/api/facilities/createPermission",
       {
         username,
         facilityName,
         permissions: fullAccess ? fullAccess : permissions,
       },
       {
         headers: {
           Authorization: `Bearer ${user.accessToken}`, // Include accessToken in headers
         },
         withCredentials: true, // Ensure cookies are sent
       }
     );

      toast.success("Permissions assigned successfully!");
      setActiveTab("registerUser"); // Reset to the initial tab
      setFacilityName("");
      setFacilityLocation("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setEmail("");
      setPermissions([{ category: "", action: "" }]); // Reset permissions
      setFullAccess(false); // Reset full access
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to assign permissions."
      );
    }
  };

  const handleAddPermission = () => {
    setPermissions([...permissions, { category: "", action: "" }]);
  };

  const handleRemovePermission = (index) => {
    const newPermissions = permissions.filter((_, i) => i !== index);
    setPermissions(newPermissions);
  };

  const handlePermissionChange = (index, field, value) => {
    const newPermissions = [...permissions];
    newPermissions[index][field] = value;
    setPermissions(newPermissions);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-100 to-gray-200">
      <NavbarD />
      <div className="flex">
        <div className="w-1/6 sticky top-0 h-screen">
          <Sidebar />
        </div>
        <div className="flex-grow flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl w-full space-y-8 bg-white p-8 shadow-lg rounded-lg">
            {/* Tab Navigation */}
            <div className="flex justify-between mb-8">
              <button
                className={`w-1/3 text-center py-2 px-4 ${
                  activeTab === "registerUser"
                    ? "border-b-2 border-indigo-500 text-indigo-500"
                    : "text-gray-700"
                }`}
                onClick={() => setActiveTab("registerUser")}
              >
                Register User
              </button>
              <button
                className={`w-1/3 text-center py-2 px-4 ${
                  activeTab === "createFacility"
                    ? "border-b-2 border-indigo-500 text-indigo-500"
                    : "text-gray-700"
                }`}
                onClick={() => setActiveTab("createFacility")}
              >
                Create Facility
              </button>
              <button
                className={`w-1/3 text-center py-2 px-4 ${
                  activeTab === "addUserPermission"
                    ? "border-b-2 border-indigo-500 text-indigo-500"
                    : "text-gray-700"
                }`}
                onClick={() => setActiveTab("addUserPermission")}
              >
                Add User Permission
              </button>
            </div>

            {/* Register User Tab Content */}
            {activeTab === "registerUser" && (
              <>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                  Register User
                </h2>
                <form
                  className="space-y-6"
                  onSubmit={handleRegisterFacilityAdmin}
                >
                  <div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                      className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                      className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                  {/* Show Root User Checkbox Only to SuperUser */}
                  {user?.role === "SuperUser" && (
                    <div className="flex items-center">
                      <input
                        id="isRootUser"
                        name="isRootUser"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={isRootUser}
                        onChange={(e) => setIsRootUser(e.target.checked)}
                      />
                      <label
                        htmlFor="isRootUser"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Register as Root User
                      </label>
                    </div>
                  )}
                  {/* Show Email if Root User */}
                  {isRootUser && (
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
                  {/* Show Company Name if not Root User */}
                  {!isRootUser && (
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
                  )}
                  <div>
                    <select
                      id="role"
                      name="role"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      value={roleH}
                      onChange={(e) => setRoleH(e.target.value)}
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

                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={!canRegisterUser} // Disable button if user cannot register
                  >
                    Register User
                  </button>
                </form>
              </>
            )}

            {/* Create Facility Tab Content */}
            {activeTab === "createFacility" && (
              <>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                  Create New Facility
                </h2>
                <form className="space-y-6" onSubmit={handleCreateFacility}>
                  <div>
                    <input
                      id="facilityName"
                      name="facilityName"
                      type="text"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Facility Name"
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      id="facilityLocation"
                      name="facilityLocation"
                      type="text"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Facility Location"
                      value={facilityLocation}
                      onChange={(e) => setFacilityLocation(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={!canCreateFacility} // Disable button if user cannot create facility
                  >
                    Create Facility
                  </button>
                </form>
              </>
            )}

            {/* Add User Permission Tab Content */}
            {activeTab === "addUserPermission" && (
              <>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                  Assign Permissions to User
                </h2>
                <form className="space-y-6" onSubmit={handleAssignPermissions}>
                  <div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      id="facilityName"
                      name="facilityName"
                      type="text"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Facility Name"
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                    />
                  </div>

                  {!fullAccess && // Conditionally render Select Category and Select Action fields
                    permissions.map((permission, index) => (
                      <div key={index} className="space-y-4">
                        <div>
                          <label htmlFor={`category-${index}`}>
                            Select Category
                          </label>
                          <select
                            id={`category-${index}`}
                            name="category"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            value={permission.category}
                            onChange={(e) =>
                              handlePermissionChange(
                                index,
                                "category",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select a category</option>
                            <option value="fuel">Fuels</option>
                            <option value="bioenergy">Bioenergy</option>
                            <option value="refrigerants">Refrigerants</option>
                            <option value="ownedVehicles">
                              Owned Vehicles
                            </option>
                            <option value="wttfuel">WTT Fuel</option>
                            <option value="material">Materials Used</option>
                            <option value="waste">Waste Disposal</option>
                            <option value="fa">Flights & Accommodations</option>
                            <option value="ehctd">Electricity Heating</option>
                            <option value="btls">Business Travel</option>
                            <option value="fg">Freighting Goods</option>
                            <option value="ec">Employee Commuting</option>
                            <option value="food">Food</option>
                            <option value="homeOffice">Home Office</option>
                            <option value="water">Water</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor={`action-${index}`}>
                            Select Action
                          </label>
                          <select
                            id={`action-${index}`}
                            name="action"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            value={permission.action}
                            onChange={(e) =>
                              handlePermissionChange(
                                index,
                                "action",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select an action</option>
                            <option value="read">Read</option>
                            <option value="create">Create</option>
                            <option value="update">Update</option>
                            <option value="delete">Delete</option>
                            <option value="manage">Manage</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemovePermission(index)}
                          className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Remove Permission
                        </button>
                      </div>
                    ))}

                  <div className="flex items-center">
                    <input
                      id="fullAccess"
                      name="fullAccess"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={fullAccess}
                      onChange={(e) => setFullAccess(e.target.checked)}
                    />
                    <label
                      htmlFor="fullAccess"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Full Access
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddPermission}
                    className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={fullAccess} // Disable add more permission button if full access is checked
                  >
                    Add More Permission
                  </button>

                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={!canAssignPermissions} // Disable button if user cannot assign permissions
                  >
                    Assign Permissions
                  </button>
                </form>
              </>
            )}

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
