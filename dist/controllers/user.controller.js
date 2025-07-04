"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await user_model_1.default.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({
            name: user.name,
            email: user.email,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch user' });
    }
};
exports.getCurrentUser = getCurrentUser;
