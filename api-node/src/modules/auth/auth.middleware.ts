import { env } from '@src/config/env.js';
import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import { authRepository } from './auth.repository.js';
import jwt from 'jsonwebtoken';

export const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies?.refreshToken;
	if (!token) return res.status(401).json({ message: 'No refresh token' });

	try {
		const refreshToken = req.cookies?.refreshToken;
		if (!refreshToken) return res.status(401).json({ message: 'Not authorized' });

		const decodedToken = jwt.verify(refreshToken, env.REFRESH_TOKEN_KEY);
		if (!decodedToken) return res.status(401).json({ message: 'Not authorized' });

		const { sub } = decodedToken as JwtPayload;

		const userId = sub as string;
		const user = await authRepository.findById(userId);

		if (!user) return res.status(401).json({ message: 'User not found' });
		req.user = { id: userId };

		next();
	} catch (err) {
		return res.status(403).json({ message: 'Refresh token expired or invalid' });
	}
};
