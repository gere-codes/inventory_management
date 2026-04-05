import type { TUser, TUserResponse } from '@src/db/schema/user.js';
import { registerSchema, type TRegisterInput } from './auth.schema.js';
import { authRepository } from './auth.repository.js';
import { AppError } from '@src/core/utils/app-error.util.js';
import jwt from 'jsonwebtoken';
import { env } from '@src/config/env.js';
import bcrypt from 'bcrypt';

class AuthService {
	private readonly repo = authRepository;

	async register(
		userData: TRegisterInput,
	): Promise<{ user: TUserResponse; accessToken: string; refreshToken: string }> {
		// Validate user data
		const validatedUser = registerSchema.parse(userData);

		// check if the user exists
		const existingUser = await this.repo.findByEmail(validatedUser.email);
		if (existingUser) throw new AppError(409, 'User already exists');

		// Hash the password
		const hashedPassword = await bcrypt.hash(validatedUser.password, 12);

		// register user
		const user = await this.repo.register({
			name: validatedUser.name,
			email: validatedUser.email,
			password: hashedPassword,
		});

		return {
			user,
			accessToken: this.generateAccessToken(user.id),
			refreshToken: this.generateRefreshToken(user.id),
		};
	}

	private generateAccessToken(userId: string): string {
		return jwt.sign({ sub: userId }, env.ACCESS_TOKEN_KEY, { expiresIn: '15m' });
	}

	private generateRefreshToken(userId: string): string {
		return jwt.sign({ sub: userId }, env.REFRESH_TOKEN_KEY, { expiresIn: '7d' });
	}
}

export const authService = new AuthService();
