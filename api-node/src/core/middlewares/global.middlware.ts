import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '@utils/index.js';
import { env } from '@src/config/env.js';

export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
	const isDev = env.NODE_ENV === 'development';

	// Zod validation errors
	if (error instanceof z.ZodError) {
		return res.status(400).json({
			success: false,
			type: 'backend',
			message: 'Validation failed',
			errors: error.issues.map((issue) => ({
				path: issue.path,
				message: issue.message,
			})),
		});
	}

	// Custom errors
	if (error instanceof AppError) {
		return res.status(error.statusCode).json({
			success: false,
			type: 'backend',
			message: error.message,
			...(isDev && { stack: error.stack }),
		});
	}

	console.error('[Global Error Handler]:', error);

	return res.status(500).json({
		success: false,
		type: 'backend',
		message: 'Internal server error',
		...(isDev && { stack: error.stack }),
	});
};
