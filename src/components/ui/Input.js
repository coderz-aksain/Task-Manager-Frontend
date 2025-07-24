import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const inputClasses = `block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
    error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
  } ${Icon && iconPosition === 'left' ? 'pl-10' : ''} ${
    Icon && iconPosition === 'right' ? 'pr-10' : ''
  } ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-4 w-4 text-gray-400" />
          </div>
        )}
        
        <input className={inputClasses} {...props} />
        
        {Icon && iconPosition === 'right' && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <Icon className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;