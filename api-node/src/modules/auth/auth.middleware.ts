import { env } from '@src/config/env.js';
import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import { authRepository } from './auth.repository.js';
import jwt from 'jsonwebtoken';
import { AppError } from '@src/core/utils/app-error.util.js';
import { catchAsync } from '@src/core/utils/catch-async.util.js';
import { EAuth } from './auth.enum.js';

export const verifyRefreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies?.[EAuth.REFRESH_TOKEN];

	// Check if token exists
	if (!token) {
		throw new AppError(401, 'No refresh token provided');
	}

	// Verify Token
	const decoded = jwt.verify(token, env.REFRESH_TOKEN_KEY) as JwtPayload;

	if (!decoded.sub) {
		throw new AppError(401, 'Invalid token payload');
	}

	// check if the user exists
	const user = await authRepository.findById(decoded.sub);
	if (!user) {
		throw new AppError(401, 'User no longer exists');
	}

	req.user = { id: user.id };

	next();
});
