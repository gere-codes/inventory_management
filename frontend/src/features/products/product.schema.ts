import { z } from 'zod';
import { EProductStatus } from './product.enum.js';

export const productCreateSchema = z.object({
	name: z.string().min(2).max(100),
	price: z.number().nonnegative(),
	description: z.string().max(1000).nullable().optional(),
	quantity: z.number().int().nonnegative(),
	categoryId: z.uuid(),
	sku: z.string().min(3).max(36),
});

export const productSchema = productCreateSchema.extend({
	id: z.uuid(),
	category: z.string(),
	status: z.enum([EProductStatus.IN_STOCK, EProductStatus.LOW_STOCK, EProductStatus.OUT_OF_STOCK]),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export const productUpdateSchema = productCreateSchema.partial();

export type TProduct = z.infer<typeof productSchema>;
export type TProductCreate = z.infer<typeof productCreateSchema>;
export type TProductUpdate = z.infer<typeof productSchema>;
