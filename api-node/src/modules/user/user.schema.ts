import { sanitized } from '@src/core/validation/sanitized.js';
import z, { object } from 'zod';

export const userSchema = object({
	id: z.uuid(),
	name: sanitized(z.string().min(2, 'Please enter a valid name').max(50, 'Name is too long')),
	email: sanitized(z.email('Please enter a valid email address').max(50, 'Email is too long')).transform((email) =>
		email.trim().toLowerCase(),
	),
	role: sanitized(z.string().min(2, 'Role is not valid').max(10, 'Not valid role')),
	password: sanitized(z.string().min(8, 'password requires at least 8 characters')),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
});

export type TUser = z.infer<typeof userSchema>;

export const userCreateSchema = userSchema.omit({ id: true, role: true, createdAt: true, updatedAt: true });
export type TUserCreate = z.infer<typeof userCreateSchema>;

export const userResponseSchema = userSchema.omit({ password: true, role: true });
export type TUserResponse = z.infer<typeof userResponseSchema>;
