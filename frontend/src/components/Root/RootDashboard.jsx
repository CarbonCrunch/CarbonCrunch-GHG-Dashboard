import React from "react";
import Sidebar from "../dashboard/Sidebar";
import NavbarD from "../dashboard/NavbarD";

const RootDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <NavbarD />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/6 flex-shrink-0 sticky top-0 h-screen">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default RootDashboard;
