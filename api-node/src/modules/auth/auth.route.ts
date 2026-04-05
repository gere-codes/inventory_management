import { Router } from 'express';
import { authConroller } from './auth.controller.js';
import { verifyRefreshToken } from './auth.middleware.js';

export const authRoutes = Router();

authRoutes.post('/register', authConroller.register);
authRoutes.post('/login', authConroller.login);
authRoutes.post('/refresh', verifyRefreshToken, authConroller.refresh);
authRoutes.post('/logout', authConroller.logout);
