import { Router } from 'express';
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword
} from '../controllers/userController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
