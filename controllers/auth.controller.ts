import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { sendEmail } from '../utils/mailer';
import jwt from 'jsonwebtoken';

// SIGNUP OTP HANDLER
export const sendOtpSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { email, name, dob } = req.body;
    if (!email || !name || !dob) {
      return res.status(400).json({ message: 'Email, name, and DOB are required' });
    }
    console.log('📨 Email being sent to:', email);

    const otp = crypto.randomInt(100000, 999999).toString();
    const emailContent = `<h3>Your OTP Code</h3><p><strong>${otp}</strong> is your One Time Password.</p>`;

    await sendEmail({ to: email, subject: 'Signup OTP', html: emailContent });

    await User.findOneAndUpdate(
      { email },
      { email, name, dob, otp },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      message: 'OTP sent successfully',
      otpPreview: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// SIGNIN OTP HANDLER
export const sendOtpSignin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up.' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const emailContent = `<h3>Your OTP Code</h3><p><strong>${otp}</strong> is your OTP for login.</p>`;

    await sendEmail({ to: email, subject: 'Login OTP', html: emailContent });

    user.otp = otp;
    await user.save();

    return res.status(200).json({
      message: 'OTP sent successfully',
      otpPreview: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// OTP VERIFY HANDLER (common for both)
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    return res.status(200).json({ message: 'OTP verified', token });
  } catch (error) {
    next(error);
  }
};
