

import React from 'react';
import Seveprocurelogo from '../../assets/images/seven-procure-logo.png'; // Adjust the path as necessary

const Header = ({ isLoggedIn = false, onToggleSidebar }) => {
  return (
    <header className="bg-gradient-to-r from-blue-100 via-blue-50 to-blue-200 h-20 flex items-center justify-between px-6 shadow-md w-full border-b border-blue-200">
      {/* Left Side - Hamburger and Company Logo */}
      <div className="flex items-center space-x-3">
        <button
          className="lg:hidden text-blue-700 hover:text-blue-900 p-2"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        <img
          src={Seveprocurelogo}
          alt="7procure Logo"
          style={{ width: '120px', height: '120px' }}
        />
      </div>

      {/* Right Side - Menu or Profile Icon */}
      <div className="flex items-center space-x-6">
        {/* FAQ menu always visible */}
        <a href="/faq" className="text-blue-700 hover:text-blue-900 font-medium transition duration-200">FAQ</a>
        {isLoggedIn ? (
          <>
            {/* Menu Items */}
            {/* <nav className="flex space-x-6">
              <a href="/dashboard" className="text-blue-700 hover:text-blue-900 transition duration-200">Dashboard</a>
              <a href="/tasks" className="text-blue-700 hover:text-blue-900 transition duration-200">Tasks</a>
              <a href="/profile" className="text-blue-700 hover:text-blue-900 transition duration-200">Profile</a>
              <a href="/logout" className="text-blue-700 hover:text-blue-900 transition duration-200">Logout</a>
            </nav> */}
            {/* Profile Icon */}
            {/* <div className="ml-6">
              <svg
                className="w-8 h-8 text-blue-600 hover:text-blue-900 cursor-pointer transition duration-200"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div> */}
          </>
        ) : null}
      </div>
    </header>
  );
};

export default Header;