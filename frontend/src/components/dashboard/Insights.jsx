import React from "react";
import NavbarD from "./NavbarD";
import Sidebar from "./Sidebar";
import ins from "../landingPage/assets/ins.png";

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
        <div className="flex flex-col p-3 items-center  ml-96 mt-16">
          <img src={ins} style={{height: 350, width:350}}/>
          <div style={{color: '#002952', fontSize: 30, fontWeight: 600}}>Coming Soon!</div>
          <div style={{color: '#002952', fontSize: 20}}>Our team is currently working on this...</div>
        </div>
      </div>
    </div>
  );
};

export default Insights;