const jwt = require('jsonwebtoken');
const sendMail = require("../utils/sendMail");
const User = require("../models/User");

const otpStore = new Map();

// Send OTP
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

  try {
    await sendMail(email, otp);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// Verify OTP and Signup/Login
exports.verifyOtp = async (req, res) => {
  const { email, otp, name, dob } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const record = otpStore.get(email);
  if (!record) {
    return res.status(400).json({ message: "OTP not found. Please request again." });
  }

  if (Date.now() > record.expires) {
    otpStore.delete(email);
    return res.status(400).json({ message: "OTP expired. Please request again." });
  }

  if (record.otp != otp) {
    return res.status(400).json({ message: "Invalid OTP. Please try again." });
  }

  otpStore.delete(email);

  try {
    let user = await User.findOne({ email });

    // Signup Flow
    if (name && dob) {
      if (user) {
        return res.status(409).json({
          message: "Email already registered. Please login instead.",
        });
      }

      user = await User.create({ name, dob, email });
      
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        message: "Signup successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      });
    }

    // Login Flow
    if (!user) {
      return res.status(404).json({
        message: "User not found. Please sign up first.",
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error("Error during verifyOtp:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};