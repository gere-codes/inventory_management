import { Router } from 'express';
import { authRoutes } from '@modules/auth/index.js';

const apiRoutes = Router();

apiRoutes.use('/auth', authRoutes);

export default apiRoutes;
