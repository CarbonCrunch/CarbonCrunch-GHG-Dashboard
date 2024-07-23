import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gray-100">
      <div className="container mx-auto px-4 py-3 flex space-x-6">
        <div className="relative group">
          <button className="px-3 py-2 hover:bg-gray-200">Product ▼</button>
          <div className="absolute hidden group-hover:block bg-white shadow-md mt-1 py-2 w-48">
            {/* Add dropdown items here */}
          </div>
        </div>
        <div className="relative group">
          <button className="px-3 py-2 hover:bg-gray-200">Blog ▼</button>
          <div className="absolute hidden group-hover:block bg-white shadow-md mt-1 py-2 w-48">
            {/* Add dropdown items here */}
          </div>
        </div>
        <div className="relative group">
          <button className="px-3 py-2 hover:bg-gray-200">Resources ▼</button>
          <div className="absolute hidden group-hover:block bg-white shadow-md mt-1 py-2 w-48">
            {/* Add dropdown items here */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
