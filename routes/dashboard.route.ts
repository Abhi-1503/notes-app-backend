import express, { Request, Response } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/dashboard', authMiddleware, (req: Request, res: Response): void => {
  res.status(200).json({ message: 'Welcome to your notes dashboard!' });
});

export default router;
