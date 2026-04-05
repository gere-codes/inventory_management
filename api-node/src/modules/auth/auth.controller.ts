import type { Request, Response } from 'express';

import { catchAsync } from '@src/core/utils/index.js';
import { authService } from './auth.service.js';
import { EAuth } from './auth.enum.js';
import { env } from '@src/config/env.js';

export class AuthController {
	private repo = authService;
	private readonly cookieOptions = {
		httpOnly: true,
		secure: env.NODE_ENV === 'production',
		sameSite: 'none' as const,
		maxAge: 365 * 24 * 60 * 60 * 1000,
	};

	public register = catchAsync(async (req: Request, res: Response) => {
		const { user, accessToken, refreshToken } = await this.repo.register(req.body);

		res.cookie(EAuth.REFRESH_TOKEN, refreshToken, this.cookieOptions);
		return res.status(201).json({ user, accessToken });
	});
}
