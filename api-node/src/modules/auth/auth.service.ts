import type { TUser, TUserResponse } from '@src/db/schema/user.js';
import { loginSchema, registerSchema, type TLoginInput, type TRegisterInput } from './auth.schema.js';
import { authRepository } from './auth.repository.js';
import { AppError, ConflictError, NotAuthorizedError } from '@src/core/utils/error.util.js';
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
		if (existingUser) throw new ConflictError('User already exists');

		// Hash the password
		const hashedPassword = await bcrypt.hash(validatedUser.password, 12);

		// register user
		const user = await this.repo.create({
			name: validatedUser.name,
			email: validatedUser.email,
			password: hashedPassword,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		return {
			user,
			accessToken: this.generateAccessToken(user.id),
			refreshToken: this.generateRefreshToken(user.id),
		};
	}

	async login(userData: TLoginInput): Promise<{
		user: TUserResponse;
		accessToken: string;
		refreshToken: string;
	}> {
		const DUMMY_HASH = '$2b$10$K9RP.S9f0jNo9NfS9NfS9Oe9Oe9Oe9Oe9Oe9Oe9Oe9Oe9Oe9Oe9Oe';

		// Validate  user data
		const validatedUser = loginSchema.parse(userData);

		// Check if the user exists
		const existingUser = await this.repo.findByEmail(validatedUser.email);
		const hashedPassword = existingUser ? existingUser.password : DUMMY_HASH;

		// Compare the hashed password
		const validUser = await bcrypt.compare(validatedUser.password, hashedPassword);

		// return error if user is not valid
		if (!validUser || !existingUser) throw new NotAuthorizedError('Invalid email or password');

		const user: TUserResponse = {
			id: existingUser.id,
			name: existingUser.name,
			email: existingUser.email,
			updatedAt: existingUser.updatedAt,
		};

		return {
			user,
			accessToken: this.generateAccessToken(existingUser.id),
			refreshToken: this.generateRefreshToken(existingUser.id),
		};
	}

	async refresh(userId: string) {
		if (!userId) throw new NotAuthorizedError();
		const accessToken = this.generateAccessToken(userId);
		const refreshToken = this.generateRefreshToken(userId);
		return { accessToken, refreshToken };
	}

	private generateAccessToken(userId: string): string {
		return jwt.sign({ sub: userId }, env.ACCESS_TOKEN_KEY, { expiresIn: '15m' });
	}

	private generateRefreshToken(userId: string): string {
		return jwt.sign({ sub: userId }, env.REFRESH_TOKEN_KEY, { expiresIn: '7d' });
	}
}

export const authService = new AuthService();
