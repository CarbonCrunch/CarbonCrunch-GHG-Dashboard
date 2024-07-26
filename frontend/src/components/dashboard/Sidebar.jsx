import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaBullseye,
  FaDatabase,
  FaCog,
  FaSignOutAlt,
  FaLeaf,
} from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoAddCircleSharp } from "react-icons/io5";

const Sidebar = () => {
  return (
    <div className="w-1/6 bg-[rgb(251,175,88)] h-screen flex flex-col justify-between p-4">
      <div className="space-y-4">
        <SidebarItem icon={<FaHome />} text="Dashboard" link="/dashboard" />
        <SidebarItem
          icon={<HiOutlineDocumentReport />}
          text="Report"
          link="/report"
        />
        <SidebarItem
          icon={<IoAddCircleSharp />}
          text="Data-in-board"
          link="/datainboard"
        />
        <SidebarItem icon={<FaBullseye />} text="Targets" />
        <SidebarItem icon={<FaDatabase />} text="CRM Data" link="/crm" />
        <SidebarItem icon={<FaChartBar />} text="Analytics" />
        <SidebarItem icon={<FaLeaf />} text="GHG" />
        <SidebarItem icon={<FaCog />} text="Settings" />
      </div>
      <div>
        <SidebarItem icon={<FaSignOutAlt />} text="Logout" />
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, link }) => {
  const content = (
    <div className="flex items-center space-x-2 text-white hover:bg-[rgb(231,155,68)] p-2 rounded cursor-pointer">
      {icon}
      <span>{text}</span>
    </div>
  );

  return link ? <Link to={link}>{content}</Link> : content;
};

export default Sidebar;
