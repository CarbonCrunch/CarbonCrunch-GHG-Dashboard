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
        <div className="flex-1 p-4">
          <h1 className="text-3xl font-bold text-gray-700 text-center">
            Coming Soon
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Insights;
