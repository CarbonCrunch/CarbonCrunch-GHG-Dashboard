import React, { useState, useRef } from "react";
import logoCC from "./assets/logoCC.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUser, FaCaretDown } from "react-icons/fa";

const ServiceItem = ({ text, imgSrc }) => (
  <div className="flex items-center mb-4">
    <img src={imgSrc} alt="" className="w-5 h-5 mr-3" />
    <span className="text-gray-700">{text}</span>
  </div>
);

const ServiceGrid = () => {
  const services = [
    {
      title: "Measure",
      items: [
        {
          text: "GHG Accounting - Scope 1, Scope 2, Scope 3",
          imgSrc: "path/to/measure1.png",
        },
      ],
    },
    {
      title: "Analyze",
      items: [
        { text: "Self-Serve AI assistant", imgSrc: "path/to/analyze1.png" },
        { text: "Reporting Analysis", imgSrc: "path/to/analyze2.png" },
        { text: "Anomaly Detection", imgSrc: "path/to/analyze3.png" },
        { text: "Supply Chain analysis", imgSrc: "path/to/analyze4.png" },
      ],
    },
    {
      title: "Report",
      items: [
        { text: "BRSR Reporting", imgSrc: "path/to/report1.png" },
        { text: "GRI Reporting", imgSrc: "path/to/report2.png" },
        { text: "CSRD", imgSrc: "path/to/report3.png" },
        { text: "ESRS", imgSrc: "path/to/report4.png" },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-grow flex-row md:flex-row justify-between space-x-6">
        {services.map((service, index) => (
          <div key={index} className="flex-1 min-w-[250px] px-4 mb-6 md:mb-0">
            <h2 className="text-navy-600 font-semibold mb-4">
              {service.title}
            </h2>
            {service.items.map((item, idx) => (
              <ServiceItem key={idx} text={item.text} imgSrc={item.imgSrc} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignInClick = () => {
    navigate("/login");
  };

  const handleRequestDemoClick = () => {
    navigate("/request-demo");
  };

  const handleAvatarClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full shadow-md z-20 bg-white">
      <div className="container mx-auto px-4 py-1 flex justify-between items-center">
        <div className="flex items-center">
          <img
            onClick={() => (window.location.href = "/")}
            src={logoCC}
            alt="Logo"
            style={{ height: 70, width: 70, cursor: "pointer" }}
          />
          <Link to="/" className="font-bold text-xl px-4">
            Carbon Crunch
          </Link>
          <div className="hidden md:flex space-x-6">
            <div className="relative group">
              <button className="px-3 py-2">Why Us</button>
            </div>
            <div className="relative group">
              <button
                className="px-3 py-2"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
              >
                Services ▼
              </button>
              {isServicesOpen && (
                <div className="absolute left-0 mt-2 w-auto bg-white shadow-md rounded-lg">
                  <ServiceGrid />
                </div>
              )}
            </div>
            <div className="relative group">
              <button className="px-3 py-2">Insights</button>
            </div>
          </div>
        </div>
        <div className="flex space-x-6">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleAvatarClick}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FaUser />
                <span>{user.username}</span>
                <FaCaretDown />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleSignInClick}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Sign In
            </button>
          )}
          <button onClick={handleRequestDemoClick} className="px-3 py-2">
            Request a Demo
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className="md:hidden flex justify-between items-center">
        <div className="flex space-x-6">
          <button className="px-3 py-2">Why Us</button>
          <button
            className="px-3 py-2"
            onClick={() => setIsServicesOpen(!isServicesOpen)}
          >
            Services ▼
          </button>
          <button className="px-3 py-2">Insights</button>
        </div>
      </div>
      {isServicesOpen && (
        <div className="md:hidden w-auto">
          <ServiceGrid />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
