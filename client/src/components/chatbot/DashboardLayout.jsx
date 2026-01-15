import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ChatList from "./ChatList.jsx";
import { FaBars, FaTimes } from "react-icons/fa";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <div className="hidden md:block w-80 flex-shrink-0 border-r border-gray-700">
        <ChatList />
      </div>

      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50 z-50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-gray-900 z-50">
            <div className="relative h-full">
              <ChatList />
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors z-50"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="md:hidden fixed top-3 left-4 z-30">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-gray-800 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
        >
          <FaBars className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-900 to-gray-800 w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
