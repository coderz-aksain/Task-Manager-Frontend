import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue', 
  className = '',
  text = '' 
}) => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colors = {
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    green: 'border-green-600',
    red: 'border-red-600',
    yellow: 'border-yellow-600',
    purple: 'border-purple-600',
    pink: 'border-pink-600',
    indigo: 'border-indigo-600',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <div
          className={`
            ${sizes[size]} 
            border-2 
            ${colors[color]} 
            border-t-transparent 
            rounded-full 
            animate-spin
          `}
        />
        {text && (
          <span className="text-sm text-gray-600 font-medium">
            {text}
          </span>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;