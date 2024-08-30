import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaCog, FaBell } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import logoCC from "../landingPage/assets/logoCC.png";

const NavbarD = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // console.log("NavbarD", user);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="shadow-md w-full">
      <div className="px-4 py-1.5 flex justify-between items-center">
        <div className="flex items-center">
          <img src={logoCC} alt="Logo" className="h-8 mr-2" />
          <Link className="font-bold text-xl">Carbon Crunch</Link>
        </div>
        <div className="flex items-center space-x-6">
          <FaCog className="text-gray-600 text-xl" />
          <FaBell className="text-gray-600 text-xl" />
          <div className="relative" ref={dropdownRef}>
            {/* Conditionally render user's photo or FaUserCircle */}
            {user.photo ? (
              <img
                src={user.photo}
                alt="User Avatar"
                className="h-8 w-8 rounded-full cursor-pointer"
                onClick={handleAvatarClick}
              />
            ) : (
              <FaUserCircle
                onClick={handleAvatarClick}
                className="text-gray-600 text-2xl cursor-pointer"
              />
            )}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                <div className="px-4 py-2 text-gray-800 font-bold">
                  {user.username}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavbarD;
