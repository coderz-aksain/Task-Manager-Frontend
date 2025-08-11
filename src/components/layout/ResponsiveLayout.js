import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Header from '../common/Header';
import AdminSidebar from '../common/AdminSidebar';
import Sidebar from '../common/Sidebar';

const ResponsiveLayout = ({ children, title = 'Dashboard' }) => {
  const { state, actions } = useAppContext();
  const { sidebarOpen, role } = state;

  const SidebarComponent = role === 'admin' ? AdminSidebar : Sidebar;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="sticky top-0 h-screen z-40">
        <SidebarComponent 
          isOpen={sidebarOpen} 
          toggleSidebar={actions.toggleSidebar} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header 
          isLoggedIn={state.isAuthenticated} 
          onToggleSidebar={actions.toggleSidebar}
          title={title}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => actions.setSidebar(false)}
        />
      )}
    </div>
  );
};

export default ResponsiveLayout;