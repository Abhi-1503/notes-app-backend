"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.sendOtpSignin = exports.sendOtpSignup = void 0;
const crypto_1 = __importDefault(require("crypto"));
const user_model_1 = __importDefault(require("../models/user.model"));
const mailer_1 = require("../utils/mailer");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// SIGNUP OTP HANDLER
const sendOtpSignup = async (req, res, next) => {
    try {
        const { email, name, dob } = req.body;
        if (!email || !name || !dob) {
            return res.status(400).json({ message: 'Email, name, and DOB are required' });
        }
        console.log('📨 Email being sent to:', email);
        const otp = crypto_1.default.randomInt(100000, 999999).toString();
        const emailContent = `<h3>Your OTP Code</h3><p><strong>${otp}</strong> is your One Time Password.</p>`;
        await (0, mailer_1.sendEmail)({ to: email, subject: 'Signup OTP', html: emailContent });
        await user_model_1.default.findOneAndUpdate({ email }, { email, name, dob, otp }, { upsert: true, new: true });
        return res.status(200).json({
            message: 'OTP sent successfully',
            otpPreview: process.env.NODE_ENV !== 'production' ? otp : undefined,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.sendOtpSignup = sendOtpSignup;
// SIGNIN OTP HANDLER
const sendOtpSignin = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please sign up.' });
        }
        const otp = crypto_1.default.randomInt(100000, 999999).toString();
        const emailContent = `<h3>Your OTP Code</h3><p><strong>${otp}</strong> is your OTP for login.</p>`;
        await (0, mailer_1.sendEmail)({ to: email, subject: 'Login OTP', html: emailContent });
        user.otp = otp;
        await user.save();
        return res.status(200).json({
            message: 'OTP sent successfully',
            otpPreview: process.env.NODE_ENV !== 'production' ? otp : undefined,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.sendOtpSignin = sendOtpSignin;
// OTP VERIFY HANDLER (common for both)
const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }
        const user = await user_model_1.default.findOne({ email });
        if (!user || user.otp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        return res.status(200).json({ message: 'OTP verified', token });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyOtp = verifyOtp;
