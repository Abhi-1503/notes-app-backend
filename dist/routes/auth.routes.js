"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const google_controller_1 = require("../controllers/google.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = express_1.default.Router();
router.post('/send-otp-signup', (0, asyncHandler_1.asyncHandler)(auth_controller_1.sendOtpSignup));
router.post('/send-otp-signin', (0, asyncHandler_1.asyncHandler)(auth_controller_1.sendOtpSignin));
router.post('/verify-otp', (0, asyncHandler_1.asyncHandler)(auth_controller_1.verifyOtp));
router.post('/google-login', (0, asyncHandler_1.asyncHandler)(google_controller_1.googleLogin));
router.get('/dashboard', auth_middleware_1.authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Welcome to your notes dashboard!' });
});
exports.default = router;
