"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = exports.sendVerificationEmail = void 0;

const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

// Verification Email
const sendVerificationEmail = async (email, token, name) => {
  const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${token}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL, // Example: "Expense Manager <onboarding@resend.dev>"
      to: email,
      subject: "Verify Your Email - Expense Manager",
      html: `
        <h2>Welcome to Expense Manager, ${name}!</h2>
        <p>Click below to verify your email:</p>
        <a href="${verificationUrl}" 
           style="background:#4CAF50;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">
           Verify Email
        </a>
        <p>If the button doesn’t work, copy and paste this link in your browser:</p>
        <p>${verificationUrl}</p>
      `,
    });

    if (error) {
      console.error("Error sending verification email:", error);
      throw error;
    }

    console.log("Verification email sent:", data);
  } catch (err) {
    console.error("Unexpected error sending verification email:", err);
    throw err;
  }
};
exports.sendVerificationEmail = sendVerificationEmail;

// Password Reset Email
const sendPasswordResetEmail = async (email, token, name) => {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${token}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "Password Reset - Expense Manager",
      html: `
        <h2>Hello ${name},</h2>
        <p>You requested to reset your password. Click below to continue:</p>
        <a href="${resetUrl}" 
           style="background:#f44336;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">
           Reset Password
        </a>
        <p>If the button doesn’t work, copy and paste this link:</p>
        <p>${resetUrl}</p>
      `,
    });

    if (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }

    console.log("Password reset email sent:", data);
  } catch (err) {
    console.error("Unexpected error sending reset email:", err);
    throw err;
  }
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
