import express from 'express';
import {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  getCurrentUser,
} from '../controllers/auth.controllers.js';
import {
  registerUserValidationRules,
  loginUserValidationRules,
} from '../validators/auth.validatior.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUserValidationRules, register);
router.post('/login', loginUserValidationRules, login);
router.post('/refresh', refresh);
router.post('/logout', authMiddleware, logout);
router.post('/logout-all', authMiddleware, logoutAll);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
