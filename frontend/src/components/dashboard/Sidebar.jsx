import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaDatabase,
  FaCog,
  FaSignOutAlt,
  FaCamera,
  FaUserPlus,
  FaFileInvoiceDollar, // Icon for Bills
} from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoAddCircleSharp } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const dashboardLink =
    user.role === "SuperUser" ? "/rootDashboard" : "/dashboard";

  return (
    <div className="bg-[rgb(251,175,88)] h-screen flex flex-col justify-between p-4">
      <div className="space-y-4">
        <SidebarItem icon={<FaHome />} text="Dashboard" link={dashboardLink} />
        {user.role !== "SuperUser" && (
          <>
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
            <SidebarItem icon={<FaDatabase />} text="Integration" link="/crm" />
            <SidebarItem icon={<FaCamera />} text="Tables" link="/ocr/tables" />
            <SidebarItem
              icon={<FaChartBar />}
              text="Insights"
              link="/insights"
            />
          </>
        )}
        <SidebarItem
          icon={<FaUserPlus />}
          text="Register"
          link="/register"
        />
        {user.role === "SuperUser" && (
          <SidebarItem
            icon={<FaFileInvoiceDollar />}
            text="Bills"
            link="/viewbills"
          />
        )}
      </div>
      <div>
        <SidebarItem icon={<FaCog />} text="Settings" link="/settings" />
        <SidebarItem
          icon={<FaSignOutAlt />}
          text="Logout"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, link, onClick }) => {
  const content = (
    <div
      onClick={onClick}
      className="flex items-center space-x-2 text-white hover:bg-[rgb(231,155,68)] p-2 rounded cursor-pointer"
    >
      {icon}
      <span>{text}</span>
    </div>
  );

  return link ? <Link to={link}>{content}</Link> : content;
};

export default Sidebar;
