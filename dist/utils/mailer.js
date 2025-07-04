"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async ({ to, subject, html }) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ EMAIL_USER or EMAIL_PASS missing in .env');
        return;
    }
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const info = await transporter.sendMail({
            from: `"HD App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log('✅ Email sent:', info.response);
    }
    catch (error) {
        console.error('❌ Failed to send email:', error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
