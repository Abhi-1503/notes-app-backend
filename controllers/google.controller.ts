import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user.model';
import { generateToken } from '../utils/jwt';

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const user = await User.findOneAndUpdate(
      { email: payload.email },
      { name: payload.name, email: payload.email },
      { upsert: true, new: true }
    );

    const token = generateToken({ id: user._id });
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
};