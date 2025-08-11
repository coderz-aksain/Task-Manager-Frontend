

import React, { useState } from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import Seveprocurelogo from '../../assets/images/icon.png'; // Adjust the path as necessary

const Header = ({ isLoggedIn = false, onToggleSidebar, title }) => {
  const { state } = useAppContext();
  const [showSearch, setShowSearch] = useState(false);
  
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side - Hamburger and Company Logo */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          {onToggleSidebar && (
            <button
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={onToggleSidebar}
              aria-label="Toggle Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          
          {/* Logo - responsive sizing */}
          <img
            src={Seveprocurelogo}
            alt="7procure Logo"
            className="h-10 w-10 sm:h-12 sm:w-12"
          />
          
          {/* Title - shown on larger screens */}
          {title && (
            <h1 className="hidden sm:block text-lg lg:text-xl font-semibold text-gray-900">
              {title}
            </h1>
          )}
        </div>

        {/* Right Side - Search and Navigation */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors sm:hidden"
              >
                {/* <Search className="h-5 w-5" /> */}
              </button>
              {/* <div className="hidden sm:block">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"
                  />
                </div>
              </div> */}
              {showSearch && (
                <div className="absolute right-0 top-full mt-2 w-64 sm:hidden">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                    onBlur={() => setShowSearch(false)}
                  />
                </div>
              )}
            </div>
          )}

          {/* FAQ menu - only show when not logged in */}
          {!isLoggedIn && (
            <a 
              href="/faq" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hidden sm:block"
            >
              FAQ
            </a>
          )}
          
          {/* Notifications - only show when logged in */}
          {isLoggedIn && (
            <button className="relative p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          )}

          {/* Profile - only show when logged in */}
          {/* {isLoggedIn && state.user && (
            <div className="relative">
              <button className="flex items-center space-x-2 rounded-lg p-2 text-gray-700 hover:bg-gray-100 transition-colors">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  {state.user.profileImage ? (
                    <img 
                      src={state.user.profileImage} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  {state.user.firstName || state.user.name || 'User'}
                </span>
              </button>
            </div>
          )} */}
        </div>
      </div>
    </header>
  );
};

export default Header;