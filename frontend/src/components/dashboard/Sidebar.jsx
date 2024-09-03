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
  FaFileInvoiceDollar,
  FaBuilding,
  FaUser,
} from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoAddCircleSharp } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { useTour } from "../../context/TourContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { runTour, setRunTour } = useTour(); 

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

  const facilityName =
    user.facilities && user.facilities.length > 0
      ? user.facilities[0].facilityName
      : "";

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
              className="tour-generate-reports"
            />
            <SidebarItem
              icon={<IoAddCircleSharp />}
              text="Data-in-board"
              link="/datainboard"
              className="tour-add-data"
            />
            <SidebarItem
              icon={<FaDatabase />}
              text="Integration"
              link="/crm"
              className="tour-data-integration"
            />
            <SidebarItem
              icon={<FaCamera />}
              text="Tables"
              link="/ocr/tables"
              className="tour-upload-bills"
            />
            <SidebarItem
              icon={<FaChartBar />}
              text="Insights"
              link="/insights"
              className="tour-insights"
            />
          </>
        )}
        <SidebarItem
          icon={<FaUserPlus />}
          text="Register"
          link="/register"
          className="tour-manage-users"
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
        {user.role !== "SuperUser" && (
          <SidebarItem
            icon={<FaBuilding />}
            text={`${user.companyName}, ${facilityName}`}
            className="tour-company-info"
          />
        )}
        {user.role === "SuperUser" && (
          <SidebarItem icon={<FaUser />} text={`${user.role}`} />
        )}
        <SidebarItem
          icon={<FaCog />}
          text="Settings"
          link="/settings"
          className="tour-manage-company"
        />
        <SidebarItem
          icon={<FaSignOutAlt />}
          text="Logout"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, link, onClick, className }) => {
  const content = (
    <div
      onClick={onClick}
      className={`flex items-center space-x-2 text-white hover:bg-[rgb(231,155,68)] p-2 rounded cursor-pointer ${className}`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );

  return link ? <Link to={link}>{content}</Link> : content;
};

export default Sidebar;
