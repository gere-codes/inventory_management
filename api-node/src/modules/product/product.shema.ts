import { sanitized } from '@src/core/validation/sanitized.js';
import { z } from 'zod';
import { EProductStatus } from './product.enum.js';
import { baseQuerySchema, commonQuery } from '@src/core/schema/general.schema.js';

export const productCreateSchema = z.object({
	name: sanitized(z.string().min(2).max(100)),
	price: z.coerce.number().positive(),
	description: sanitized(z.string().max(1000)).nullable().optional(),
	quantity: z.coerce.number().int().nonnegative(),
	categoryId: z.uuid(),
	sku: sanitized(z.string().min(3).max(36)),
	images: z.array(z.string()).optional().nullable(),
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

export const productQuerySchema = commonQuery
	.extend({
		categoryId: z.uuid().optional(),
		sort: z.enum(['createdAt', 'price']).default('createdAt'),
	})
	.transform((raw) => ({
		isPaginated: raw.isPaginated,
		pagination: {
			page: raw.page,
			limit: raw.limit,
			offset: (raw.page - 1) * raw.limit,
		},
		filter: {
			search: raw.search,
			categoryId: raw.categoryId,
		},
		sort: {
			field: raw.sort,
			order: raw.order,
		},
	}));

export type TProductQuery = z.infer<typeof productQuerySchema>;
