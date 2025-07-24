



import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, CheckSquare, User, LogOut, Plus, X } from 'lucide-react';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const [activeItem, setActiveItem] = React.useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set active item based on current route
    const currentItem = menuItems.find(item => item.path === location.pathname);
    setActiveItem(currentItem ? currentItem.name : 'Employee List');
  }, [location.pathname]);

  const handleMenuClick = (name) => {
    setActiveItem(name);
    if (isOpen) toggleSidebar(); // Close sidebar on mobile after click
    if (name === 'Logout') {
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload(); // Reload the page after navigation
  };

  const menuItems = [
    { name: 'Employee List', icon: Users, path: '/admin/employeelist' },
    { name: 'All Tasks', icon: CheckSquare, path: '/admin/tasks' },
    { name: 'Add Tasks', icon: Plus, path: '/admin/createtasks' },
    { name: 'Profile', icon: User, path: '/admin/profile' },
    { name: 'Logout', icon: LogOut, path: '/' },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out lg:static lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 flex flex-col h-screen`}
      >
        {/* Mobile header with close button */}
        <div className="flex h-16 shrink-0 items-center justify-between px-6 lg:justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-semibold text-gray-900 lg:hidden xl:block">Admin Portal</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col px-6 py-4">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {menuItems.slice(0, -1).map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        onClick={() => handleMenuClick(item.name)}
                        className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 transition-all duration-200 ${
                          location.pathname === item.path
                            ? 'bg-blue-50 text-blue-700 shadow-sm'
                            : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 shrink-0 transition-colors ${
                            location.pathname === item.path ? 'text-blue-700' : 'text-gray-400 group-hover:text-blue-700'
                          }`}
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>

            {/* Logout */}
            <li className="mt-auto">
              <button 
                onClick={() => handleMenuClick('Logout')}
                className="group -mx-2 flex w-full gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
              >
                <LogOut className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-red-700" />
                Sign out
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;