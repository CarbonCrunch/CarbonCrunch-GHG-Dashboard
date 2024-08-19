import React from "react";
import NavbarD from "./NavbarD";
import Sidebar from "./Sidebar";

const Insights = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarD />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/6 sticky top-0 h-screen">
          <Sidebar />
        </div>
        {/* Main Content */}
        <div className="flex-1 flex justify-center items-center p-4 bg-gray-100">
          <h1 className="text-5xl font-extrabold text-gray-800 text-center">
            Coming Out Soon
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Insights;
