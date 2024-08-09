import React from "react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-green-400 to-blue-500 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Carbon Crunch
          </h1>
        </div>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white p-1 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <svg
              className="h-full w-full text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
