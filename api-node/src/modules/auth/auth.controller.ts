import type { Request, Response } from 'express';

import { catchAsync } from '@src/core/utils/index.js';
import { authService } from './auth.service.js';
import { EAuth } from './auth.enum.js';
import { env } from '@src/config/env.js';

class AuthController {
	private repo = authService;
	private readonly cookieOptions = {
		httpOnly: true,
		secure: true,
		sameSite: 'none' as const,
		maxAge: 365 * 24 * 60 * 60 * 1000,
	};

	public register = catchAsync(async (req: Request, res: Response) => {
		const { user, accessToken, refreshToken } = await this.repo.register(req.body);

		res.cookie(EAuth.REFRESH_TOKEN, refreshToken, this.cookieOptions);
		return res.status(201).json({ user, accessToken });
	});

	public login = catchAsync(async (req: Request, res: Response) => {
		const { user, accessToken, refreshToken } = await this.repo.login(req.body);

		res.cookie(EAuth.REFRESH_TOKEN, refreshToken, this.cookieOptions);
		return res.status(201).json({ user, accessToken });
	});

	public refresh = catchAsync(async (req: Request, res: Response) => {
		const { accessToken, refreshToken } = await this.repo.refresh(req.user.id);

		res.cookie(EAuth.REFRESH_TOKEN, refreshToken, this.cookieOptions);
		return res.status(200).json({ accessToken });
	});

	public logout = catchAsync(async (req: Request, res: Response) => {
		console.log('logout requested');
		res.clearCookie(EAuth.REFRESH_TOKEN, {
			...this.cookieOptions,
			maxAge: 0,
		});
		return res.status(200).json({
			success: true,
		});
	});
}

export const authConroller = new AuthController();
