import { sanitized } from '@src/core/validation/sanitized.js';
import z from 'zod';

export const categoryCreateSchema = z.object({
	name: sanitized(z.string().min(2)),
	description: sanitized(z.string()).nullable().optional(),
});

export const categorySchema = categoryCreateSchema.extend({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export type TCategory = z.infer<typeof categorySchema>;
export type TCategoryCreate = z.infer<typeof categoryCreateSchema>;
export type TCategoryUpdate = z.infer<typeof categoryUpdateSchema>;
