import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import bg from "./bg.jpg";
import logo from "./logo.png";
import { toast, Toaster } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [focusedFields, setFocusedFields] = useState({ email: false, otp: false });
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const handleSendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setErrors({ email: "Enter a valid email address" });
      toast.error("Enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("https://note-taking-app-z2ks.onrender.com/api/auth/send-otp", { email });
      setOtpSent(true);
      setErrors({});
      toast.success("OTP sent to your email!");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send OTP";
      setErrors({ email: msg });
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      const msg = "Enter valid 6-digit OTP";
      setErrors({ otp: msg });
      toast.error(msg);
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("https://note-taking-app-z2ks.onrender.com/api/auth/verify-otp", { email, otp });

      if (res.status === 200) {
        const token = res.data.token;
        const user = res.data.user;

        if (keepLoggedIn) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("user", JSON.stringify(user));
        }

        toast.success("Login successful!");

        // 🔁 Hard redirect so token loads correctly
        window.location.href = "/dashboard";
      }
    } catch (error) {
      const msg = error.response?.data?.message || "OTP verification failed";
      setErrors({ otp: msg });
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFocus = (field) => {
    setFocusedFields({ ...focusedFields, [field]: true });
  };

  const handleBlur = (field) => {
    if (!field || !field.length) {
      setFocusedFields({ ...focusedFields, [field]: false });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Toaster position="top-right" />

      {/* Left Side */}
      <div className="w-full md:w-1/2 p-6 bg-white">
        <div className="flex md:block justify-center">
          <img src={logo} alt="Logo" className="h-10 w-24 md:mb-10" />
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="md:text-left text-center mb-8">
            <h1 className="text-3xl mt-4 font-bold text-gray-800">Sign in</h1>
            <p className="text-gray-500 mt-2 text-sm">
              Please login to continue to your account
            </p>
          </div>

          <div className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <label
                className={`absolute left-4 transition-all duration-200 ${
                  focusedFields.email || email
                    ? "top-0 text-xs text-blue-500 bg-white px-1 -mt-3"
                    : "top-3.5 text-gray-400"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 pt-3"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({});
                }}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                disabled={otpSent}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* OTP Input */}
            <div className="relative">
              <label
                className={`absolute left-4 transition-all duration-200 ${
                  focusedFields.otp || otp
                    ? "top-0 text-xs text-blue-500 bg-white px-1 -mt-3"
                    : "top-3.5 text-gray-400"
                }`}
              >
                Enter OTP
              </label>
              <input
                type={showOtp ? "text" : "password"}
                name="otp"
                className="w-full border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 pt-3"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setErrors({});
                }}
                onFocus={() => handleFocus("otp")}
                onBlur={() => handleBlur("otp")}
                disabled={!otpSent}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowOtp(!showOtp)}
              >
                {showOtp ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
              )}
            </div>

            {/* Buttons */}
            {!otpSent ? (
              <button
                onClick={handleSendOtp}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
                Get OTP
              </button>
            ) : (
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
                Sign In
              </button>
            )}

            {/* Resend & Keep Me Logged In */}
            {otpSent && (
              <div className="mt-3 flex justify-between items-center text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    className="form-checkbox rounded text-blue-600"
                  />
                  <span className="text-gray-600">Keep me logged in</span>
                </label>
                <button
                  onClick={handleSendOtp}
                  className="text-blue-600 font-medium text-[1rem] hover:underline"
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              </div>
            )}

            {/* Switch to Signup */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Need an account?{" "}
              <Link to="/" className="text-blue-600 font-medium hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src={bg}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
    </div>
  );
};

export default Login;
