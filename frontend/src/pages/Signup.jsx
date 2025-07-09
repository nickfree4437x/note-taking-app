import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bg from "./bg.jpg";
import logo from "./logo.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    otp: "",
  });

  const [focusedFields, setFocusedFields] = useState({
    name: false,
    dob: false,
    email: false,
    otp: false,
  });

  const [errors, setErrors] = useState({});
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email format";

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFocus = (field) => {
    setFocusedFields({ ...focusedFields, [field]: true });
  };

  const handleBlur = (field) => {
    if (!formData[field]) {
      setFocusedFields({ ...focusedFields, [field]: false });
    }
  };

  const handleGetOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      Object.values(validationErrors).forEach(error => toast.error(error));
      return;
    }

    try {
      await axios.post("https://note-taking-app-z2ks.onrender.com/api/auth/send-otp", {
        email: formData.email,
      });
      setShowOtpInput(true);
      toast.success("OTP sent to your email!");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(errorMsg);
      setErrors({ ...errors, api: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      const errorMsg = "Please enter a valid 6-digit OTP";
      setErrors({ otp: errorMsg });
      toast.error(errorMsg);
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post("https://note-taking-app-z2ks.onrender.com/api/auth/verify-otp", {
        name: formData.name,
        dob: formData.dob,
        email: formData.email,
        otp: formData.otp,
      });

      if (res.status === 200) {
        // Store token and user data
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        toast.success("Account created successfully!");
        // Redirect directly to dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "OTP verification failed. Try again.";
      toast.error(errorMsg);
      if (err.response?.status === 409) {
        setErrors({ email: errorMsg });
      } else {
        setErrors({ ...errors, otp: errorMsg });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 p-6 bg-white">
        {/* Logo - Desktop: Top-left | Mobile: Centered */}
        <div className="flex md:block justify-center">
          <img src={logo} alt="Logo" className="h-10 w-24 md:mb-10" />
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto">
          {/* Heading - Desktop: Left-aligned | Mobile: Centered */}
          <div className="md:text-left text-center mb-8">
            <h1 className="text-3xl mt-4 font-bold text-gray-800">Sign up</h1>
            <p className="text-gray-500 mt-2 text-sm">
              Sign up to enjoy the feature of HD
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleGetOtp}>
            {/* Name Field */}
            <div className="relative">
              <label
                className={`absolute left-4 transition-all duration-200 ${
                  focusedFields.name || formData.name
                    ? "top-0 text-xs text-blue-500 bg-white px-1 -mt-3"
                    : "top-3.5 text-gray-400"
                }`}
              >
                Your Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 pt-3"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => handleFocus("name")}
                onBlur={() => handleBlur("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Date Field */}
            <div className="relative">
              <input
                type={focusedFields.dob ? "date" : "text"}
                name="dob"
                placeholder="Date of Birth"
                className="w-full border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-500"
                value={formData.dob}
                onChange={handleChange}
                onFocus={() => setFocusedFields({ ...focusedFields, dob: true })}
                onBlur={(e) => {
                  if (!e.target.value) {
                    setFocusedFields({ ...focusedFields, dob: false });
                  }
                }}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
              )}
            </div>


            {/* Email Field */}
            <div className="relative">
              <label
                className={`absolute left-4 transition-all duration-200 ${
                  focusedFields.email || formData.email
                    ? "top-0 text-xs text-blue-500 bg-white px-1 -mt-3"
                    : "top-3.5 text-gray-500"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 pt-3"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {!showOtpInput && (
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading && <FaSpinner className="animate-spin mr-2" />}
                Get OTP
              </button>
            )}
          </form>

          {showOtpInput && (
            <div className="mt-6 space-y-5">
              {/* OTP Field */}
              <div className="relative">
                <label
                  className={`absolute left-4 transition-all duration-200 ${
                    focusedFields.otp || formData.otp
                      ? "top-0 text-xs text-blue-400 bg-white px-1 -mt-3"
                      : "top-3.5 text-gray-400"
                  }`}
                >
                  Enter OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  className="w-full border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 pt-3"
                  value={formData.otp}
                  onChange={handleChange}
                  onFocus={() => handleFocus("otp")}
                  onBlur={() => handleBlur("otp")}
                />
                {errors.otp && (
                  <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading && <FaSpinner className="animate-spin mr-2" />}
                Sign Up
              </button>
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Background Image */}
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

export default Signup;
