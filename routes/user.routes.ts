import { Router } from 'express';
import { getCurrentUser } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/user', authMiddleware, getCurrentUser);

export default router;
