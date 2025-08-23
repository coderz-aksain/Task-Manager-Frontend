


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
import { Formik, Form } from "formik";
import * as Yup from "yup";

// Validation schemas
const passwordSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const otpRequestSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

const otpSubmitSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  otp: Yup.string().required("OTP is required"),
});

const forgotPasswordSchema = Yup.object({
  forgotEmail: Yup.string().email("Invalid email address").required("Email is required"),
});

const Login = () => {
  const { actions } = useAppContext();
  const { success, error: showError } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCount, setErrorCount] = useState({ email: 0, password: 0, otp: 0 });

  const headingRef = useRef(null);
  const navigate = useNavigate();

  // Clear error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setErrorCount({ email: 0, password: 0, otp: 0 });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Handle resend OTP cooldown
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Typewriter effect for heading
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

  const handlePasswordSubmit = async (values, { setSubmitting, setErrors }) => {
    setLoading(true);
    try {
      console.log("API Call: Login with Password", { ...values, method: "password" });
      const data = await ApiService.login({
        ...values,
        method: "password",
      });
      console.log("API Response: Login with Password", data);

      actions.loginSuccess({
        user: { id: data.id || values.email, email: values.email, role: data.role },
        token: data.token,
        role: data.role,
      });

      success("Login successful!");
      navigate(data.role === "admin" ? "/admin/tasks" : "/employee/tasks");
    } catch (err) {
      console.error("API Error: Login with Password", err.message || "Login failed");
      setErrorMessage(err.message || "Login failed");
      showError(err.message || "Login failed");
      setErrorCount((prev) => ({
        email: values.email ? prev.email : prev.email + 1,
        password: values.password ? prev.password : prev.password + 1,
        otp: prev.otp,
      }));
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleOtpRequest = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      console.log("API Call: Request OTP", { email: values.email });
      await ApiService.requestOtp(values.email);
      console.log("API Response: Request OTP", "OTP sent successfully");

      setOtpRequested(true);
      setOtpMessage("OTP sent to your registered email!");
      setResendCooldown(30);
      setTimeout(() => setOtpMessage(""), 3000);
    } catch (err) {
      console.error("API Error: Request OTP", err.message || "Failed to send OTP");
      setErrorMessage(err.message || "Failed to send OTP");
      showError(err.message || "Failed to send OTP");
      setErrorCount((prev) => ({
        ...prev,
        email: values.email ? prev.email : prev.email + 1,
      }));
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleOtpSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      console.log("API Call: Login with OTP", { ...values, method: "otp" });
      const data = await ApiService.login({ ...values, method: "otp" });
      console.log("API Response: Login with OTP", data);

      actions.loginSuccess({
        user: { id: data.id || values.email, email: values.email, role: data.role },
        token: data.token,
        role: data.role,
      });

      success("Login successful!");
      navigate(data.role === "admin" ? "/admin/tasks" : "/employee/tasks");
    } catch (err) {
      console.error("API Error: Login with OTP", err.message || "Invalid OTP");
      setErrorMessage(err.message || "Invalid OTP");
      showError(err.message || "Invalid OTP");
      setErrorCount((prev) => ({
        ...prev,
        otp: values.otp ? prev.otp : prev.otp + 1,
      }));
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleResendOtp = async (email) => {
    setLoading(true);
    try {
      console.log("API Call: Resend OTP", { email });
      await ApiService.requestOtp(email);
      console.log("API Response: Resend OTP", "OTP resent successfully");

      setOtpMessage("OTP resent to your registered email!");
      setResendCooldown(30);
      setTimeout(() => setOtpMessage(""), 3000);
    } catch (err) {
      console.error("API Error: Resend OTP", err.message || "Failed to resend OTP");
      setErrorMessage(err.message || "Failed to resend OTP");
      showError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      console.log("API Call: Forgot Password", { forgotEmail: values.forgotEmail });
      await ApiService.forgotPassword(values.forgotEmail);
      console.log("API Response: Forgot Password", "Reset instructions sent");

      setForgotSubmitted(true);
      success("Password reset instructions sent to your email!");
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotSubmitted(false);
      }, 2000);
    } catch (err) {
      console.error("API Error: Forgot Password", err.message || "Failed to send reset instructions");
      setErrorMessage(err.message || "Failed to send reset instructions");
      showError(err.message || "Failed to send reset instructions");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

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
                <Formik
                  initialValues={{ email: "", otp: "" }}
                  validationSchema={otpRequested ? otpSubmitSchema : otpRequestSchema}
                  onSubmit={otpRequested ? handleOtpSubmit : handleOtpRequest}
                >
                  {({ errors, touched, handleChange, handleBlur, values }) => (
                    <Form className="space-y-6">
                      <div className={errors.email && touched.email && errorCount.email > 0 ? "animate-shake" : ""}>
                        <Input
                          label="Email"
                          type="email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your email"
                          icon={Mail}
                          required
                        />
                        {errors.email && touched.email && (
                          <p className={`text-red-600 text-sm mt-1 ${errorCount.email > 1 ? "animate-shake" : ""}`}>
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {otpRequested && (
                        <div className={errors.otp && touched.otp && errorCount.otp > 0 ? "animate-shake" : ""}>
                          <Input
                            label="OTP"
                            type="text"
                            name="otp"
                            value={values.otp}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter your OTP"
                            icon={Key}
                            required
                          />
                          {errors.otp && touched.otp && (
                            <p className={`text-red-600 text-sm mt-1 ${errorCount.otp > 1 ? "animate-shake" : ""}`}>
                              {errors.otp}
                            </p>
                          )}
                        </div>
                      )}

                      {errorMessage && (
                        <p className={`text-red-600 text-sm text-center ${errorCount.email > 1 || errorCount.otp > 1 ? "animate-shake" : ""}`}>
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
                          <LoadingSpinner size="md" />
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
                            onClick={() => handleResendOtp(values.email)}
                            disabled={resendCooldown > 0 || loading}
                          >
                            {resendCooldown > 0
                              ? `Resend OTP in ${resendCooldown}s`
                              : "Resend OTP"}
                          </Button>
                        </div>
                      )}
                    </Form>
                  )}
                </Formik>
              ) : (
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validationSchema={passwordSchema}
                  onSubmit={handlePasswordSubmit}
                >
                  {({ errors, touched, handleChange, handleBlur, values }) => (
                    <Form className="space-y-6">
                      <div className={errors.email && touched.email && errorCount.email > 0 ? "animate-shake" : ""}>
                        <Input
                          label="Email"
                          type="email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your email"
                          icon={Mail}
                          required
                        />
                        {errors.email && touched.email && (
                          <p className={`text-red-600 text-sm mt-1 ${errorCount.email > 1 ? "animate-shake" : ""}`}>
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className={errors.password && touched.password && errorCount.password > 0 ? "animate-shake" : ""}>
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
                              name="password"
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
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
                        {errors.password && touched.password && (
                          <p className={`text-red-600 text-sm mt-1 ${errorCount.password > 1 ? "animate-shake" : ""}`}>
                            {errors.password}
                          </p>
                        )}
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

                      {errorMessage && (
                        <p className={`text-red-600 text-sm text-center ${errorCount.email > 1 || errorCount.password > 1 ? "animate-shake" : ""}`}>
                          {errorMessage}
                        </p>
                      )}

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
                    </Form>
                  )}
                </Formik>
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
              <Formik
                initialValues={{ forgotEmail: "" }}
                validationSchema={forgotPasswordSchema}
                onSubmit={handleForgotSubmit}
              >
                {({ errors, touched, handleChange, handleBlur, values }) => (
                  <Form className="space-y-6">
                    <div className={errors.forgotEmail && touched.forgotEmail && errorCount.email > 0 ? "animate-shake" : ""}>
                      <Input
                        label="Enter your registered email"
                        type="email"
                        name="forgotEmail"
                        value={values.forgotEmail}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Email"
                        icon={Mail}
                        required
                      />
                      {errors.forgotEmail && touched.forgotEmail && (
                        <p className={`text-red-600 text-sm mt-1 ${errorCount.email > 1 ? "animate-shake" : ""}`}>
                          {errors.forgotEmail}
                        </p>
                      )}
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <LoadingSpinner size="sm" /> : "Submit"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </>
  );
};

export default Login;