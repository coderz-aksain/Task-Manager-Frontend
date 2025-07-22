import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import LoginpagaImagemain from "../../assets/images/loginpageimagemain.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const headingRef = useRef(null);
  const navigate = useNavigate();

  const BASE_URL = "https://task-manager-backend-vqen.onrender.com/api";

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    console.log("API Call: /signin (password)", { email, method: "password" });
    try {
      const response = await fetch(`${BASE_URL}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, method: "password" }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error: /signin", errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response: /signin (password)", data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      navigate(data.role === "admin" ? "/admin/tasks" : "/employee/tasks");
    } catch (err) {
      setErrorMessage(err.message || "Login failed");
      setTimeout(() => setErrorMessage(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    console.log("API Call: /request-otp", { email });
    try {
      const response = await fetch(`${BASE_URL}/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error: /request-otp", errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response: /request-otp", data);
      setOtpRequested(true);
      setOtpMessage("OTP sent to your registered email!");
      setResendCooldown(30);
      setTimeout(() => setOtpMessage(""), 3000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to send OTP");
      setTimeout(() => setErrorMessage(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    console.log("API Call: /signin (otp)", { email, otp, method: "otp" });
    try {
      const response = await fetch(`${BASE_URL}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, method: "otp" }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error: /signin (otp)", errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response: /signin (otp)", data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      navigate(data.role === "admin" ? "/admin/tasks" : "/employee/tasks");
    } catch (err) {
      setErrorMessage(err.message || "Invalid OTP");
      setTimeout(() => setErrorMessage(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    console.log("API Call: /request-otp (resend)", { email });
    try {
      const response = await fetch(`${BASE_URL}/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error: /request-otp (resend)", errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response: /request-otp (resend)", data);
      setOtpMessage("OTP resent to your registered email!");
      setResendCooldown(30);
      setOtp("");
      setTimeout(() => setOtpMessage(""), 3000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to resend OTP");
      setTimeout(() => setErrorMessage(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    console.log("API Call: /forgot-password", { forgotEmail });
    try {
      const response = await fetch(`${BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error: /forgot-password", errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response: /forgot-password", data);
      setForgotSubmitted(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotSubmitted(false);
        setForgotEmail("");
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to send reset instructions");
      setTimeout(() => setErrorMessage(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const heading = headingRef.current;
    const text = "Manage Your Tasks Efficiently and Unlock Productivity";
    let index = 0;

    const typeWriter = () => {
      if (index < text.length) {
        heading.textContent = text.substring(0, index + 1);
        index++;
        setTimeout(typeWriter, 100);
      }
    };

    heading.textContent = "";
    typeWriter();

    return () => {
      heading.textContent = "";
    };
  }, []);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2
                ref={headingRef}
                className="text-3xl font-bold text-blue-900 drop-shadow-md"
              ></h2>
            </div>
            <div className="w-full max-w-md mx-auto p-8 bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-2xl border border-blue-100">
              <div className="mb-10 text-center">
                <div className="flex justify-center items-center mb-4">
                  <div className="text-3xl font-extrabold text-blue-700 flex items-center animate-pulse">
                    EMPLOYEE'S PORTAL
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-blue-900 mb-3 animate-fade-in drop-shadow-md">
                  Welcome Back!
                </h1>
                <p className="text-blue-400 text-lg drop-shadow-md">Sign in to continue</p>
              </div>

              {isOtpLogin ? (
                <form className="space-y-6" onSubmit={otpRequested ? handleOtpSubmit : handleOtpRequest}>
                  <div className="relative group">
                    <label htmlFor="email" className="block text-sm font-semibold text-blue-900 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
                        ✉️
                      </span>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:shadow-md text-blue-900"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {otpRequested && (
                    <div className="relative group">
                      <label htmlFor="otp" className="block text-sm font-semibold text-blue-900 mb-2">
                        OTP
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
                          🔑
                        </span>
                        <input
                          type="text"
                          id="otp"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:shadow-md text-blue-900"
                          placeholder="Enter your OTP"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <p className="text-red-500 text-sm text-center animate-fade-in">
                      {errorMessage}
                    </p>
                  )}

                  {otpMessage && (
                    <p className="text-green-600 text-sm text-center animate-fade-in">
                      {otpMessage}
                    </p>
                  )}

                  {loading && (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 transform hover:scale-105"
                  >
                    {loading ? "Loading..." : otpRequested ? "Sign in" : "Send OTP"}
                  </button>

                  {otpRequested && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendCooldown > 0 || loading}
                        className={`text-sm ${resendCooldown > 0 || loading ? "text-gray-400" : "text-blue-400 hover:text-blue-600"} transition-colors duration-300 focus:outline-none`}
                      >
                        {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
                      </button>
                    </div>
                  )}
                </form>
              ) : (
                <form className="space-y-6" onSubmit={handlePasswordSubmit}>
                  <div className="relative group">
                    <label htmlFor="email" className="block text-sm font-semibold text-blue-900 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
                        ✉️
                      </span>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:shadow-md text-blue-900"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <label htmlFor="password" className="block text-sm font-semibold text-blue-900 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
                        🔒
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-blue-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:shadow-md text-blue-900"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-400 hover:text-blue-600 focus:outline-none"
                      >
                        {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-sm text-blue-400 hover:text-blue-600 transition-colors duration-300 focus:outline-none"
                    >
                      Forgot password?
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOtpLogin(true)}
                      className="text-sm text-blue-400 hover:text-blue-600 transition-colors duration-300 focus:outline-none"
                    >
                      Login with OTP
                    </button>
                  </div>

                  {errorMessage && (
                    <p className="text-red-500 text-sm text-center animate-fade-in">
                      {errorMessage}
                    </p>
                  )}

                  {loading && (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 transform hover:scale-105"
                  >
                    {loading ? "Loading..." : "Sign in"}
                  </button>
                </form>
              )}

              {isOtpLogin && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpLogin(false);
                      setOtpRequested(false);
                      setEmail("");
                      setOtp("");
                      setResendCooldown(0);
                      setOtpMessage("");
                      setErrorMessage("");
                    }}
                    className="text-sm text-blue-400 hover:text-blue-600 transition-colors duration-300 focus:outline-none"
                  >
                    Back to Password Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${LoginpagaImagemain})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 to-blue-400/40"></div>
            <div className="relative h-full flex items-center justify-center text-white text-center p-12" />
          </div>
        </div>

        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-2xl p-8 w-full max-w-sm animate-fade-in-up relative border border-blue-200">
              <button
                className="absolute top-2 right-3 text-blue-700 hover:text-blue-900 text-2xl font-bold focus:outline-none"
                onClick={() => setShowForgotModal(false)}
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center text-blue-900">Forgot Password</h2>
              <form onSubmit={handleForgotSubmit} className="space-y-6">
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-semibold text-blue-900 mb-2">
                    Enter your registered email
                  </label>
                  <input
                    type="email"
                    id="forgot-email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-blue-900"
                    placeholder="Email"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
                  disabled={forgotSubmitted || loading}
                >
                  {loading ? "Loading..." : forgotSubmitted ? "Submitted!" : "Submit"}
                </button>
                {forgotSubmitted && (
                  <p className="text-green-600 text-sm text-center mt-4 animate-fade-in">
                    If this email is registered, you'll receive reset instructions.
                  </p>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;