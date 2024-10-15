import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation
import logo from '../../../landingPage/assets/logoCC.png'; // Replace with your logo path

const BlogNav = () => {
  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Section: Logo and Heading */}
          <div className="flex items-center">
            <img src={logo} alt="Company Logo" className="h-16 w-16 mr-5" />
            <h1 className="text-xl font-semibold text-gray-900">Insights</h1>
          </div>

          {/* Right Section: Login and Register */}
          <div className="flex items-center space-x-10 font-poppins">
            <Link to={'/auth'} className="text-gray-900 cursor-pointer">
              Login/Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BlogNav;