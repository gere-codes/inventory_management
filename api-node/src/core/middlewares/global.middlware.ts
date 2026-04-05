// src/middleware/errorHandler.ts
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '@utils/index.js';

export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
	let statusCode = error.statusCode || 500;
	let message = error.message || 'Internal Server Error';

	//  zod errors
	if (error instanceof z.ZodError) {
		return res.status(400).json({
			success: false,
			errors: error.issues.map((err) => ({
				message: err.message,
				path: err.path,
			})),
		});
	}

	// customer errors
	if (error instanceof AppError) {
		return res.status(statusCode).json({
			status: 'error',
			message,
		});
	}

	console.error('[Global Error Handler]:', error);
	return res.status(500).json({
		success: false,
		message: 'Internal server error',
	});
};
