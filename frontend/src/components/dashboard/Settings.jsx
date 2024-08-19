import React from 'react'
import Sidebar from './Sidebar';
import NavbarD from './NavbarD';

const Settings = () => {
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
}

export default Settings
