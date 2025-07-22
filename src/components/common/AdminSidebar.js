


import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUsers, FaTasks, FaUser, FaSignOutAlt, FaPlus } from 'react-icons/fa';

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
    { name: 'Employee List', icon: <FaUsers className="w-5 h-5" />, path: '/admin/employeelist' },
    { name: 'All Tasks', icon: <FaTasks className="w-5 h-5" />, path: '/admin/tasks' },
    { name: 'Add Tasks', icon: <FaPlus className="w-5 h-5" />, path: '/admin/createtasks' },
    { name: 'Profile', icon: <FaUser className="w-5 h-5" />, path: '/admin/profile' },
    { name: 'Logout', icon: <FaSignOutAlt className="w-5 h-5" />, path: '/' },
  ];

  return (
    <div>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-50 to-blue-200 shadow-xl transform transition-transform duration-300 ease-in-out lg:static lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 flex flex-col max-w-[20rem] p-4 h-screen`}
      >
        {/* Sidebar Header */}
        <div className="p-4 mb-2">
          <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-800">
            EMPLOYEE PORTAL
          </h5>
        </div>

        {/* Navigation */}
        <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-800">
          <hr className="my-2 border-blue-200" />

          {/* Menu Items */}
          <div className="flex flex-col gap-y-8 flex-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => handleMenuClick(item.name)}
                className={`flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-blue-800 hover:bg-blue-100 hover:text-blue-700'
                }`}
              >
                <div className="grid mr-4 place-items-center">
                  {item.icon}
                </div>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AdminSidebar;