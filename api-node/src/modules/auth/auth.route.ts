import { Router } from 'express';
import { authConroller } from './auth.controller.js';
import { verifyRefreshToken } from './auth.middleware.js';
import { authLimiter } from '@src/config/index.js';

export const authRoutes = Router();

authRoutes.post('/register', authLimiter, authConroller.register);
authRoutes.post('/login', authLimiter, authConroller.login);
authRoutes.post('/refresh', verifyRefreshToken, authConroller.refresh);
authRoutes.post('/logout', authConroller.logout);
