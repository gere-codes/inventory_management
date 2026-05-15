import { sanitized } from '@src/core/validation/sanitized.js';
import { z } from 'zod';
import { EProductStatus } from './product.enum.js';

export const productCreateSchema = z.object({
	name: sanitized(z.string().min(2).max(100)),
	price: z.coerce.number().positive(),
	description: sanitized(z.string().max(1000)).nullable().optional(),
	quantity: z.coerce.number().int().nonnegative(),
	categoryId: z.uuid(),
	sku: sanitized(z.string().min(3).max(36)),
	image: z.string().optional().nullable(),
});

export const productSchema = productCreateSchema.extend({
	id: z.uuid(),
	category: sanitized(z.string()),
	status: z.enum([EProductStatus.IN_STOCK, EProductStatus.LOW_STOCK, EProductStatus.OUT_OF_STOCK]),
	createdAt: z.coerce.date().transform((v) => v.toISOString()),
	updatedAt: z.coerce.date().transform((v) => v.toISOString()),
});
export const productUpdateSchema = productCreateSchema.partial();

export type TProduct = z.infer<typeof productSchema>;
export type TProductCreate = z.infer<typeof productCreateSchema>;
export type TProductUpdate = z.infer<typeof productUpdateSchema>;
