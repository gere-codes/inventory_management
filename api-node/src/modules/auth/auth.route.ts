import { Router } from 'express';
import { authConroller } from './auth.controller.js';

export const authRoutes = Router();

authRoutes.post('/register', authConroller.register);
authRoutes.post('/login', authConroller.login);
