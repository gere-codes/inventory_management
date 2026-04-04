import { z } from 'zod';
import { passwordRules, sanitized } from '@core/validation/sanitized.js';

export const registerSchema = z
	.object({
		name: sanitized(z.string().min(2).max(50)),
		email: sanitized(z.email()).transform((e) => e.toLowerCase().trim()),
		password: passwordRules,
		confirmPassword: passwordRules,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export const loginSchema = z.object({
	email: sanitized(z.email()).transform((e) => e.toLowerCase().trim()),
	password: passwordRules,
});
