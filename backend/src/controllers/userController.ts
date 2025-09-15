import { Request, Response } from "express";
import { UserModel, CreateUserData, LoginData } from "../models/User-mongo";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/email-brevo";
import { v4 as uuidv4 } from "uuid";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password }: CreateUserData = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Check for password complexity
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create user
    const user = await UserModel.create({
      name: sanitizedName,
      email: sanitizedEmail,
      password,
    });

    // Send verification email (fast HTTP API only)
    try {
      const emailResult = await sendVerificationEmail(
        email,
        user.verification_token!,
        name
      );
      if (emailResult.success) {
        console.log("✅ Verification email sent successfully");
      } else {
        console.error("Failed to send verification email:", emailResult.error);
      }
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail the registration if email fails - user can still verify later
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginData = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Sanitize inputs
    const sanitizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await UserModel.findByEmail(sanitizedEmail);
    if (!user) {
      // Use consistent response time to prevent timing attacks
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isValidPassword = await UserModel.validatePassword(
      password,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if email is verified
    if (!user.is_verified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    // Generate tokens
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Generate refresh token (assuming user has a tokenVersion field, default to 0 if not)
    const tokenVersion = user.token_version || 0;
    const refreshToken = generateRefreshToken(user.id, tokenVersion);

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only use secure in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      token, // Access token
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const user = await UserModel.findByVerificationToken(token);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    await UserModel.verifyEmail(user.id);

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Sanitize input
    const sanitizedEmail = email.trim().toLowerCase();

    const user = await UserModel.findByEmail(sanitizedEmail);
    if (!user) {
      // Don't reveal if email exists or not
      return res.json({
        success: true,
        message:
          "If an account with this email exists, a password reset link has been sent",
      });
    }

    const resetToken = uuidv4();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await UserModel.setResetToken(sanitizedEmail, resetToken, resetExpiry);

    // Send reset email
    try {
      await sendPasswordResetEmail(email, resetToken, user.name);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send password reset email",
      });
    }

    res.json({
      success: true,
      message:
        "If an account with this email exists, a password reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Check for password complexity
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    const user = await UserModel.findByResetToken(token);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    await UserModel.resetPassword(token, newPassword);

    // Increment token version to invalidate all existing refresh tokens
    await UserModel.incrementTokenVersion(user.id);

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Get user ID from request (requires auth middleware)
    const userId = (req as any).user?.id;

    if (userId) {
      // Increment token version to invalidate all refresh tokens
      await UserModel.incrementTokenVersion(userId.toString());
    }

    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    // Verify refresh token
    const { userId, tokenVersion } = verifyRefreshToken(refreshToken);

    // Get user and check token version
    const user = await UserModel.findById(userId.toString());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify token version matches (prevents use of revoked tokens)
    if (user.token_version !== tokenVersion) {
      return res.status(401).json({
        success: false,
        message: "Token has been revoked",
      });
    }

    // Generate new access token
    const newAccessToken = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Return new access token
    res.json({
      success: true,
      token: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};
