import express from 'express';
import {
  sendOtpSignup,
  sendOtpSignin,
  verifyOtp,
} from '../controllers/auth.controller';
import { googleLogin } from '../controllers/google.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.post('/send-otp-signup', asyncHandler(sendOtpSignup));
router.post('/send-otp-signin', asyncHandler(sendOtpSignin));
router.post('/verify-otp', asyncHandler(verifyOtp));
router.post('/google-login', asyncHandler(googleLogin));

router.get('/dashboard', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Welcome to your notes dashboard!' });
});

export default router;
