import { loginSchema, registerSchema, type TLoginInput, type TRegisterInput } from './auth.schema.js';
import { authRepository } from './auth.repository.js';
import { AppError, ConflictError, NotAuthorizedError, NotFoundError } from '@src/core/utils/error.util.js';
import jwt from 'jsonwebtoken';
import { env } from '@src/config/env.js';
import bcrypt from 'bcrypt';
import { userResponseSchema, type TUserResponse } from '../user/user.schema.js';

class AuthService {
	private readonly repo = authRepository;

	async register(
		userData: TRegisterInput,
	): Promise<{ user: TUserResponse; accessToken: string; refreshToken: string }> {
		// Validate user data
		const validatedUser = registerSchema.parse(userData);

		// check if the user exists
		const existingUser = await this.repo.findByEmailRaw(validatedUser.email);
		if (existingUser) throw new ConflictError('User already exists');

		// Hash the password
		const hashedPassword = await bcrypt.hash(validatedUser.password, 12);

		// register user
		const userEmail = await this.repo.create({
			name: validatedUser.name,
			email: validatedUser.email,
			password: hashedPassword,
		});

		// get user data;
		const user = await this.repo.findByEmailRaw(userEmail);
		if (!user) throw new NotFoundError('User not found');

		const userResponse = userResponseSchema.parse(user);

		return {
			user: userResponse,
			accessToken: this.generateAccessToken(user.id, user.role),
			refreshToken: this.generateRefreshToken(user.id, user.role),
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
		const existingUser = await this.repo.findByEmailRaw(validatedUser.email);
		const hashedPassword = existingUser ? existingUser.password : DUMMY_HASH;

		// Compare the hashed password
		const validUser = await bcrypt.compare(validatedUser.password, hashedPassword);

		// return error if user is not valid
		if (!validUser || !existingUser) throw new NotAuthorizedError('Invalid email or password');

		const user = userResponseSchema.parse(existingUser);

		return {
			user,
			accessToken: this.generateAccessToken(existingUser.id, existingUser.role),
			refreshToken: this.generateRefreshToken(existingUser.id, existingUser.role),
		};
	}

	async refresh(userId: string, userRole: string) {
		if (!userId) throw new NotAuthorizedError();
		const accessToken = this.generateAccessToken(userId, userRole);
		const refreshToken = this.generateRefreshToken(userId, userRole);
		return { accessToken, refreshToken };
	}

	private generateAccessToken(userId: string, userRole: string): string {
		const payload = {
			sub: userId,
			role: userRole,
		};
		return jwt.sign(payload, env.ACCESS_TOKEN_KEY, { expiresIn: '15m' });
	}

	private generateRefreshToken(userId: string, userRole: string): string {
		const payload = {
			sub: userId,
			role: userRole,
		};
		return jwt.sign(payload, env.REFRESH_TOKEN_KEY, { expiresIn: '7d' });
	}
}

export const authService = new AuthService();
