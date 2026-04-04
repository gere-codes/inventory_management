import { z } from 'zod';
import { sanitized } from '@core/validation/sanitized.js';

const passwordRules = sanitized(z.string().min(6).max(60)).transform((p) => p.trim());

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

export type TRegister = z.infer<typeof registerSchema>;
