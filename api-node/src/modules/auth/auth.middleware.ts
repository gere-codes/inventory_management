import { env } from '@config/env.js';
import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import { authRepository } from './auth.repository.js';
import jwt from 'jsonwebtoken';
import { EAuth } from './auth.enum.js';
import { validateUUID, NotAuthorizedError, catchAsync } from '@utils/index.js';

export const verifyRefreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies?.[EAuth.REFRESH_TOKEN];

	// Check if token exists
	if (!token) {
		throw new NotAuthorizedError('No refresh token provided');
	}

	// Verify Token
	const decoded = jwt.verify(token, env.REFRESH_TOKEN_KEY) as JwtPayload;

	if (!decoded.sub) {
		throw new NotAuthorizedError('Invalid token payload');
	}

	// check if the user exists
	const user = await authRepository.findById(decoded.sub);
	if (!user) {
		throw new NotAuthorizedError('User no longer exists');
	}

	req.user = { id: user.id };

	next();
});

// a middleware that authenticate a user
export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer')) {
		throw new NotAuthorizedError('authorized');
	}

	const token = authHeader.split(' ')[1];

	if (!token) {
		throw new NotAuthorizedError('authorized: invalid token');
	}

	const decoded = jwt.verify(token, env.ACCESS_TOKEN_KEY) as JwtPayload;

	if (!decoded.sub) {
		throw new NotAuthorizedError('authorized');
	}

	const userIdValidation = validateUUID(decoded.sub);

	if (!userIdValidation.success) {
		throw new NotAuthorizedError('authorized: not valid user');
	}

	const userId = decoded.sub;

	req.user = { id: userId };

	next();
});
