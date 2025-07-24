import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, CheckSquare, User, LogOut, X, Menu } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [activeItem, setActiveItem] = React.useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Tasks', icon: CheckSquare, path: '/employee/tasks' },
    { name: 'Create Task', icon: Calendar, path: '/employee/createtasks' },
    { name: 'Profile', icon: User, path: '/employee/profile' },
  ];

  useEffect(() => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    setActiveItem(currentItem ? currentItem.name : 'Tasks');
  }, [location.pathname]);

  const handleMenuClick = (name) => {
    setActiveItem(name);
    if (name === 'Logout') {
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      {/* Hamburger button on mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={toggleSidebar}>
          <Menu className="h-6 w-6 text-gray-800" />
        </button>
      </div>

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
          transition-transform duration-300 ease-in-out h-screen
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full'} 
          lg:translate-x-0 lg:static
          group lg:w-20 lg:hover:w-64 overflow-hidden flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span
              className={`${
                isOpen ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'
              } transition-opacity duration-200 text-xl font-semibold text-gray-900 hidden lg:block`}
            >
              Employee Portal
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col justify-between flex-1">
          <nav className="flex-1 px-2 py-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={() => handleMenuClick(item.name)}
                      className={`group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium transition-all
                        ${
                          isActive
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
                        }
                      `}
                    >
                      <Icon
                        className={`h-5 w-5 shrink-0 ${
                          isActive
                            ? 'text-blue-700'
                            : 'text-gray-400 group-hover:text-blue-700'
                        }`}
                      />
                      <span
                        className={`${
                          isOpen ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'
                        } transition-opacity duration-200 whitespace-nowrap`}
                      >
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="px-2 py-4 border-t border-gray-200">
            <button
              onClick={() => handleMenuClick('Logout')}
              className="group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium text-gray-700 hover:bg-red-100 hover:text-red-700 w-full transition-all"
            >
              <LogOut className="h-5 w-5 text-gray-400 group-hover:text-red-700" />
              <span
                className={`${
                  isOpen ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'
                } transition-opacity duration-200 whitespace-nowrap`}
              >
                Sign out
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
