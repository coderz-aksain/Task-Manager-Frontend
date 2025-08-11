

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { useToast } from "../../hooks/useToast";
import ApiService from "../../services/api";
import Header from "../../components/common/Header";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import LoginpagaImagemain from "../../assets/images/loginpageimagemain.jpg";
import { Eye, EyeOff, Mail, Lock, Key } from "lucide-react";

const Login = () => {
  const { actions } = useAppContext();
  const { success, error: showError } = useToast();
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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const headingRef = useRef(null);
  const navigate = useNavigate();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("API Call: Login with Password", { email, password, method: "password" });
      const data = await ApiService.login({
        email,
        password,
        method: "password",
      });
      console.log("API Response: Login with Password", data);

      actions.loginSuccess({
        user: { id: data.id || email, email, role: data.role }, // Construct user if missing
        token: data.token,
        role: data.role,
      });

      success("Login successful!");
      navigate(data.role === "admin" ? "/admin/tasks" : "/employee/tasks");
    } catch (err) {
      console.error("API Error: Login with Password", err.message || "Login failed");
      showError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("API Call: Request OTP", { email });
      await ApiService.requestOtp(email);
      console.log("API Response: Request OTP", "OTP sent successfully");

      setOtpRequested(true);
      setOtpMessage("OTP sent to your registered email!");
      setResendCooldown(30);
      setTimeout(() => setOtpMessage(""), 3000);
    } catch (err) {
      console.error("API Error: Request OTP", err.message || "Failed to send OTP");
      showError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("API Call: Login with OTP", { email, otp, method: "otp" });
      const data = await ApiService.login({ email, otp, method: "otp" });
      console.log("API Response: Login with OTP", data);

      actions.loginSuccess({
        user: { id: data.id || email, email, role: data.role }, // Construct user if missing
        token: data.token,
        role: data.role,
      });

      success("Login successful!");
      navigate(data.role === "admin" ? "/admin/tasks" : "/employee/tasks");
    } catch (err) {
      console.error("API Error: Login with OTP", err.message || "Invalid OTP");
      showError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("API Call: Resend OTP", { email });
      await ApiService.requestOtp(email);
      console.log("API Response: Resend OTP", "OTP resent successfully");

      setOtpMessage("OTP resent to your registered email!");
      setResendCooldown(30);
      setOtp("");
      setTimeout(() => setOtpMessage(""), 3000);
    } catch (err) {
      console.error("API Error: Resend OTP", err.message || "Failed to resend OTP");
      showError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("API Call: Forgot Password", { forgotEmail });
      await ApiService.forgotPassword(forgotEmail);
      console.log("API Response: Forgot Password", "Reset instructions sent");

      setForgotSubmitted(true);
      success("Password reset instructions sent to your email!");
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotSubmitted(false);
        setForgotEmail("");
      }, 2000);
    } catch (err) {
      console.error("API Error: Forgot Password", err.message || "Failed to send reset instructions");
      showError(err.message || "Failed to send reset instructions");
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
      <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2
                ref={headingRef}
                className="text-3xl font-bold text-gray-900"
              ></h2>
            </div>
            <Card className="w-full max-w-md mx-auto p-8">
              <div className="mb-10 text-center">
                <div className="flex justify-center items-center mb-4">
                  <div className="text-3xl font-extrabold text-blue-600 flex items-center">
                    EMPLOYEE'S PORTAL
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  Welcome Back!
                </h1>
                <p className="text-gray-600 text-lg">Sign in to continue</p>
              </div>

              {isOtpLogin ? (
                <form
                  className="space-y-6"
                  onSubmit={otpRequested ? handleOtpSubmit : handleOtpRequest}
                >
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    icon={Mail}
                    required
                  />

                  {otpRequested && (
                    <Input
                      label="OTP"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter your OTP"
                      icon={Key}
                      required
                    />
                  )}

                  {errorMessage && (
                    <p className="text-red-600 text-sm text-center">
                      {errorMessage}
                    </p>
                  )}

                  {otpMessage && (
                    <p className="text-green-600 text-sm text-center">
                      {otpMessage}
                    </p>
                  )}

                  {loading && (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                    loading={loading}
                  >
                    {otpRequested ? "Sign in" : "Send OTP"}
                  </Button>

                  {otpRequested && (
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleResendOtp}
                        disabled={resendCooldown > 0 || loading}
                      >
                        {resendCooldown > 0
                          ? `Resend OTP in ${resendCooldown}s`
                          : "Resend OTP"}
                      </Button>
                    </div>
                  )}
                </form>
              ) : (
                <form className="space-y-6" onSubmit={handlePasswordSubmit}>
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    icon={Mail}
                    required
                  />

                  <div className="relative group">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 bg-white pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowForgotModal(true)}
                    >
                      Forgot password?
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOtpLogin(true)}
                    >
                      Login with OTP
                    </Button>
                  </div>

                  {loading && (
                    <div className="flex justify-center">
                      <LoadingSpinner size="md" />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                    loading={loading}
                  >
                    Sign in
                  </Button>
                </form>
              )}

              {isOtpLogin && (
                <div className="text-center mt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsOtpLogin(false);
                      setOtpRequested(false);
                      setEmail("");
                      setOtp("");
                      setResendCooldown(0);
                      setOtpMessage("");
                    }}
                  >
                    Back to Password Login
                  </Button>
                </div>
              )}
            </Card>
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
            <Card className="w-full max-w-sm p-8 relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Forgot Password
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForgotModal(false)}
                >
                  ×
                </Button>
              </div>
              <form onSubmit={handleForgotSubmit} className="space-y-6">
                <Input
                  label="Enter your registered email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Email"
                  icon={Mail}
                  required
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <LoadingSpinner size="sm" /> : "Submit"}
                </Button>
              </form>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;