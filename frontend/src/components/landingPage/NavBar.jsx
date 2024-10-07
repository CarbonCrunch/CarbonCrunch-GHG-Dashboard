import React, { useState, useRef } from "react";
import logoCC from "./assets/logoCC.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUser, FaCaretDown, FaBars, FaTimes } from "react-icons/fa";
import anomaly from "./assets/anomaly.png";
import csri from "./assets/csri.png";
import brsr from "./assets/brsr.png";
import esrs from "./assets/esrs.png";
import ghg from "./assets/ghg.png";
import gri from "./assets/gri.png";
import repanalysis from "./assets/repanalysis.png";
import selfai from "./assets/selfai.png";
import supply from "./assets/supply.png";
import Modal from "./ComingSoon"; // Import the Modal component

const ServiceItem = ({ text, imgSrc }) => (
  <div className="flex items-center mb-4">
    <img src={imgSrc} alt="" className="w-16 h-16 mr-3" />
    <span className="text-gray-700">{text}</span>
  </div>
);

const ServiceGrid = ({ onClose }) => {
  const services = [
    {
      title: "Measure",
      items: [
        {
          text: "GHG Accounting - Scope 1, Scope 2, Scope 3",
          imgSrc: ghg,
        },
      ],
    },
    {
      title: "Analyze",
      items: [
        { text: "Self-Serve AI assistant", imgSrc: selfai },
        { text: "Reporting Analysis", imgSrc: repanalysis },
        { text: "Anomaly Detection", imgSrc: anomaly },
        { text: "Supply Chain analysis", imgSrc: supply },
      ],
    },
    {
      title: "Report",
      items: [
        { text: "BRSR Reporting", imgSrc: brsr },
        { text: "GRI Reporting", imgSrc: gri },
        { text: "CSRD", imgSrc: csri },
        { text: "ESRS", imgSrc: esrs },
      ],
    },
  ];
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/services");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-h-[400px] md:max-h-[500px] overflow-y-auto">
      <button
        onClick={onClose}
        className="float-right mb-4 px-4 py-2"
      >
        <FaTimes />
      </button>
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-6">
        {services.map((service, index) => (
          <div key={index} className="flex-1 min-w-[250px] px-4 mb-6 md:mb-0">
            <h2 className="text-navy-600 font-semibold mb-4">{service.title}</h2>
            {service.items.map((item, idx) => (
              <ServiceItem key={idx} text={item.text} imgSrc={item.imgSrc} />
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={handleExploreClick}
        className="mt-4 px-4 py-2 text-white bg-[#002952] hover:bg-blue-600 rounded"
      >
        Explore More
      </button>
    </div>
  );
};

const Navbar = ({ scrolltoContact, scrolltowhy }) => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
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

  const handleWhyUs = () => {
    scrolltowhy();
  };

  const handleInsightsClick = () => {
    setIsModalOpen(true); // Open modal when Insights is clicked
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close modal when called
  };

  const closeDropdown = () => {
    setIsServicesOpen(false);
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
          <Link to="/" className="font-bold text-xl px-4 hidden md:block">
            Carbon Crunch
          </Link>
        </div>
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <button className="px-3 py-2" onClick={handleWhyUs}>
            Why Us
          </button>
          <button
            className="px-3 py-2"
            onClick={() => setIsServicesOpen(!isServicesOpen)}
          >
            Services ▼
          </button>
          {isServicesOpen && (
            <div className="absolute left-0 mt-2 w-full md:w-auto bg-white shadow-md rounded-lg z-10">
              <ServiceGrid onClose={closeDropdown} />
            </div>
          )}
          <button className="px-3 py-2" onClick={handleInsightsClick}>
            Insights
          </button>
        </div>
        <div className="hidden md:flex space-x-6">
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
        {/* Mobile Menu Icon */}
        <div className="md:hidden mr-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-2xl"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md py-4 space-y-4">
          <button className="block w-full px-4 py-2 text-left" onClick={handleWhyUs}>
            Why Us
          </button>
          <button
            className="block w-full px-4 py-2 text-left"
            onClick={() => setIsServicesOpen(!isServicesOpen)}
          >
            Services ▼
          </button>
          {isServicesOpen && (
            <div className="w-full px-4">
              <ServiceGrid onClose={closeDropdown} />
            </div>
          )}
          <button className="block w-full px-4 py-2 text-left" onClick={handleInsightsClick}>
            Insights
          </button>
          <button
            onClick={handleRequestDemoClick}
            className="block w-full px-4 py-2 text-left"
          >
            Request a Demo
          </button>
          {user && (
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left"
            >
              Logout
            </button>
          )}
          {!user && (
            <button
              onClick={handleSignInClick}
              className="block w-full px-4 py-2 text-left"
            >
              Sign In
            </button>
          )}
        </div>
      )}

      {/* Modal for Insights */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
        <p>The Insights feature is coming soon. Stay tuned!</p>
      </Modal>
    </nav>
  );
};

export default Navbar;