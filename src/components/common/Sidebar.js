

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import {
  Calendar,
  CheckSquare,
  User,
  LogOut,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { actions } = useAppContext();
  const [activeItem, setActiveItem] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Tasks",
      icon: CheckSquare,
      path: "/employee/tasks",
      tooltip: "View your tasks",
    },
     {
      name: "Create Task",
      icon: Plus,
      path: "/employee/createtask",
      tooltip: "Create new tasks",
    },
    {
      name: "Profile",
      icon: User,
      path: "/employee/profile",
      tooltip: "Edit your profile",
    },
   
  ];

  React.useEffect(() => {
    const currentItem = menuItems.find(
      (item) => item.path === location.pathname
    );
    setActiveItem(currentItem ? currentItem.name : "Tasks");
  }, [location.pathname]);

  const handleMenuClick = (name) => {
    setActiveItem(name);
    if (name === "Logout") handleLogout();
  };

  const handleLogout = () => {
    actions.logout();
    navigate("/");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed z-50 inset-y-0 left-0 transform bg-white border-r shadow-md 
          transition-all duration-300 ease-in-out h-screen
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full"} 
          lg:translate-x-0 lg:static
          ${!isOpen && "lg:w-20 lg:group-hover:w-64"} 
          ${isSidebarExpanded ? "lg:w-64" : ""} 
          overflow-hidden flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            {isOpen || isSidebarExpanded ? (
              <span className="transition-opacity duration-200 text-xl font-semibold text-gray-900">
                Employee Portal
              </span>
            ) : null}
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col justify-between flex-1 relative">
          <nav className="flex-1 px-2 py-4">
            <ul className="space-y-2 sidebar-nav">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.name} className="relative group">
                    <Link
                      to={item.path}
                      onClick={() => handleMenuClick(item.name)}
                      className={`flex items-center gap-x-3 rounded-md p-2 text-sm font-medium transition-all
          ${
            isActive
              ? "bg-blue-100 text-blue-700"
              : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
          }
        `}
                    >
                      <Icon
                        className={`h-5 w-5 shrink-0 ${
                          isActive ? "text-blue-700" : "text-gray-400"
                        }`}
                      />
                      {(isOpen || isSidebarExpanded) && (
                        <span className="transition-opacity duration-200 whitespace-nowrap">
                          {item.name}
                        </span>
                      )}
                    </Link>

                    {/* Tooltip shown only when sidebar is collapsed */}
                    {!isOpen && !isSidebarExpanded && (
                      <div
                        className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 
                        bg-gray-800 text-white text-xs rounded-md px-2 py-1 
                        whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                      >
                        {item.tooltip}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="px-2 py-4 border-t border-gray-200">
            <button
              onClick={() => handleMenuClick("Logout")}
              className="flex items-center gap-x-3 rounded-md p-2 text-sm font-medium text-gray-700 hover:bg-red-100 hover:text-red-700 w-full transition-all"
            >
              <LogOut className="h-5 w-5 text-gray-400" />
              {(isOpen || isSidebarExpanded) && (
                <span className="transition-opacity duration-200 whitespace-nowrap">
                  Sign out
                </span>
              )}
            </button>
          </div>

          {/* Expand/Collapse Toggle (Visible only on large screens) */}
          <div className="px-2 py-2 border-t border-gray-200 lg:block hidden">
            <button
              onClick={() => setIsSidebarExpanded((prev) => !prev)}
              className="flex items-center gap-x-3 rounded-md p-2 text-sm font-medium text-gray-600 hover:bg-gray-100 w-full transition-all"
            >
              {isSidebarExpanded ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
              {(isOpen || isSidebarExpanded) && (
                <span className="transition-opacity duration-200 whitespace-nowrap">
                  {isSidebarExpanded ? "Collapse" : "Expand"}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      <style>
        {`
          .sidebar-nav li {
            position: relative;
          }
          .sidebar-nav li .opacity-0 {
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
          }
          .sidebar-nav li:hover .opacity-0 {
            opacity: 1;
          }
        `}
      </style>
    </>
  );
};

export default Sidebar;
