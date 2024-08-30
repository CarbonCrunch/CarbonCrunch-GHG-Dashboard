import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Sidebar from "../Sidebar";
import NavbarD from "../NavbarD";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios"; // Import axios for making HTTP requests
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

const Settings = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file
  // console.log(user._id)
  // Handle file input change
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Set selected file
  };

  // Handle form submission
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload."); // Show error if no file is selected
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile); // Append file to FormData
    formData.append("userId", user._id); // Append user._id to FormData

    try {
      const response = await axios.post("/api/users/uploadLogo", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set content type for file upload
          Authorization: `Bearer ${user.accessToken}`, // Include accessToken in the headers
        },
        withCredentials: true, // Ensure cookies are sent with the request
      });

      console.log("response", response);

      if (response.status === 200) {
        toast.success("Logo uploaded successfully!"); // Show success toast
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo. Please try again."); // Show error toast
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      {/* Navbar */}
      <NavbarD />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/6 flex-shrink-0 sticky top-0 h-screen bg-gray-100 shadow-lg">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-grow p-8 m-4">
          <h2 className="text-4xl font-extrabold text-black mb-8 border-b-2 border-gray-300 pb-4">
            Settings
          </h2>

          {/* Manage Your Users Heading */}
          <div className="mb-6">
            <Link
              to="/manageUsers"
              className="text-xl font-semibold text-black hover:text-gray-700 hover:underline transition duration-300 ease-in-out"
            >
              Manage Your Users &rarr;
            </Link>
          </div>

          {/* Manage Your Facilities Heading */}
          <div className="mb-6">
            <Link
              to="/manageFacilities"
              className="text-xl font-semibold text-black hover:text-gray-700 hover:underline transition duration-300 ease-in-out"
            >
              Manage Your Facilities &rarr;
            </Link>
          </div>

          {/* Upload Company Logo Heading */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-black mb-4">
              Upload Company Logo
            </h3>
            <input type="file" onChange={handleFileChange} className="mb-4" />
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              Upload Logo
            </button>
          </div>
        </div>
      </div>

      {/* React Toastify Container for Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default Settings;
