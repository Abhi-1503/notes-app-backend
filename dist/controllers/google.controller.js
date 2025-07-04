"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = void 0;
const google_auth_library_1 = require("google-auth-library");
const user_model_1 = __importDefault(require("../models/user.model"));
const jwt_1 = require("../utils/jwt");
const client = new google_auth_library_1.OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);
const googleLogin = async (req, res, next) => {
    try {
        const { credential } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.VITE_GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            res.status(400).json({ error: 'Invalid Google token' });
            return;
        }
        const user = await user_model_1.default.findOneAndUpdate({ email: payload.email }, { name: payload.name, email: payload.email }, { upsert: true, new: true });
        const token = (0, jwt_1.generateToken)({ id: user._id });
        res.json({ token, user });
    }
    catch (error) {
        next(error);
    }
};
exports.googleLogin = googleLogin;
