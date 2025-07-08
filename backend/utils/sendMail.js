// server/utils/sendMail.js

const nodemailer = require("nodemailer");

const sendMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"HD Auth" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your OTP for Signup",
    html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
