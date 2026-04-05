import { sanitized } from '@src/core/validation/sanitized.js';
import z, { object } from 'zod';

export const userSchema = object({
	id: z.uuid(),
	name: sanitized(z.string().min(2, 'Please enter a valid name').max(50, 'Name is too long')),
	email: sanitized(z.email('Please enter a valid email address').max(50, 'Email is too long')).transform((email) =>
		email.trim().toLowerCase(),
	),
	createdAt: z.date(),
	updatedAt: z.date(),
});
