"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.login = exports.register = void 0;
const User_mongo_1 = require("../models/User-mongo");
const jwt_1 = require("../utils/jwt");
const email_1 = require("../utils/email");
const uuid_1 = require("uuid");
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }
        // Check if user already exists
        const existingUser = await User_mongo_1.UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        // Create user
        const user = await User_mongo_1.UserModel.create({ name, email, password });
        // Send verification email (with timeout)
        try {
            const emailTimeout = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Email timeout')), 10000); // 10 second timeout
            });
            await Promise.race([
                (0, email_1.sendVerificationEmail)(email, user.verification_token, name),
                emailTimeout
            ]);
            console.log('✅ Verification email sent successfully');
        }
        catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            // Don't fail the registration if email fails - user can still verify later
        }
        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please verify your email.'
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        // Find user
        const user = await User_mongo_1.UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        // Check password
        const isValidPassword = await User_mongo_1.UserModel.validatePassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        // Check if email is verified
        if (!user.is_verified) {
            return res.status(401).json({
                success: false,
                message: 'Please verify your email before logging in'
            });
        }
        // Generate token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email
        });
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.login = login;
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User_mongo_1.UserModel.findByVerificationToken(token);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }
        await User_mongo_1.UserModel.verifyEmail(user.id);
        res.json({
            success: true,
            message: 'Email verified successfully'
        });
    }
    catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.verifyEmail = verifyEmail;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        const user = await User_mongo_1.UserModel.findByEmail(email);
        if (!user) {
            // Don't reveal if email exists or not
            return res.json({
                success: true,
                message: 'If an account with this email exists, a password reset link has been sent'
            });
        }
        const resetToken = (0, uuid_1.v4)();
        const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await User_mongo_1.UserModel.setResetToken(email, resetToken, resetExpiry);
        // Send reset email
        try {
            await (0, email_1.sendPasswordResetEmail)(email, resetToken, user.name);
        }
        catch (emailError) {
            console.error('Failed to send password reset email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Failed to send password reset email'
            });
        }
        res.json({
            success: true,
            message: 'If an account with this email exists, a password reset link has been sent'
        });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Token and new password are required'
            });
        }
        const user = await User_mongo_1.UserModel.findByResetToken(token);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }
        await User_mongo_1.UserModel.resetPassword(token, newPassword);
        res.json({
            success: true,
            message: 'Password reset successful'
        });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=userController.js.map