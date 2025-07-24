import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  FileText,
  Settings,
  BarChart3,
  Calendar,
  Mail,
  User,
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Tasks', href: '/tasks', icon: FileText },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Messages', href: '/messages', icon: Mail },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Dashboard</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 transition-all duration-200 ${
                            isActive(item.href)
                              ? 'bg-blue-50 text-blue-700 shadow-sm'
                              : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 shrink-0 transition-colors ${
                              isActive(item.href) ? 'text-blue-700' : 'text-gray-400 group-hover:text-blue-700'
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
                <button className="group -mx-2 flex w-full gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200">
                  <LogOut className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-red-700" />
                  Sign out
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 z-50 flex w-64 flex-col transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
          {/* Mobile header with close button */}
          <div className="flex h-16 shrink-0 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Dashboard</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          onClick={onClose}
                          className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 transition-all duration-200 ${
                            isActive(item.href)
                              ? 'bg-blue-50 text-blue-700 shadow-sm'
                              : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 shrink-0 transition-colors ${
                              isActive(item.href) ? 'text-blue-700' : 'text-gray-400 group-hover:text-blue-700'
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
                <button className="group -mx-2 flex w-full gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200">
                  <LogOut className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-red-700" />
                  Sign out
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;