
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/actions/authActions';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSubmitted(true);
    // Here you can dispatch a forgot password action if you have one
    // dispatch(forgotPassword(forgotEmail));
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSubmitted(false);
      setForgotEmail('');
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-2xl transform transition-all duration-500">
      {/* Tasky Logo/Brand */}
      <div className="mb-10 text-center">
        <div className="flex justify-center items-center mb-4">
          <div className="text-3xl font-extrabold text-blue-600 flex items-center color-black">
            EMPLOYEE'S PORTAL
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3 animate-fade-in animate-pulse">
          Welcome Back!
        </h1>
        <p className="text-gray-500 text-lg">
          Sign in to continue
        </p>
      </div>

      <div className="space-y-8">
        {/* Email Field */}
        <div className="relative group">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-300 group-focus-within:text-blue-600"
          >
            Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-blue-600">
              ✉️
            </span>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="relative group">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-300 group-focus-within:text-blue-600"
          >
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-blue-600">
              🔒
            </span>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-300 focus:outline-none"
          >
            Forgot password?
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm animate-shake">{error}</p>
        )}

        {/* Sign In Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 transform hover:scale-105"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>

    
    </div>
  );
};

export default LoginForm;
