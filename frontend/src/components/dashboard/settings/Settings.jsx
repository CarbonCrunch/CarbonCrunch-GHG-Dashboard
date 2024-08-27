import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Sidebar from "../Sidebar";
import NavbarD from "../NavbarD";

const Settings = () => {
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
        </div>
      </div>
    </div>
  );
};

export default Settings;
