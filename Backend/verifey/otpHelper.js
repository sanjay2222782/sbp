const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");

function generateOTP() {
  const otp = speakeasy.totp({
    secret: process.env.OTP_SECRET_KEY, // Store secret in env file
    encoding: "base32",
  });
  return otp;
}

async function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
}

function verifyOTP(token) {
  return speakeasy.totp.verify({
    secret: process.env.OTP_SECRET_KEY,
    encoding: "base32",
    token: token,
    window: 1,
  });
}

module.exports = { generateOTP, sendOTPEmail, verifyOTP };
