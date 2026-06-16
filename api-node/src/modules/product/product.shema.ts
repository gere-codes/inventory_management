import { sanitized } from '@src/core/validation/sanitized.js';
import { z } from 'zod';
import { EProductStatus } from './product.enum.js';
import { baseQuerySchema, commonQuery } from '@src/core/schema/general.schema.js';

export const productSchema = z.object({
	id: z.uuid(),
	name: sanitized(z.string().min(2).max(100)),
	price: z.coerce.number().positive(),
	description: sanitized(z.string().max(1000)).nullable().optional(),
	quantity: z.coerce.number().int().nonnegative(),
	category: z.object({
		id: z.uuid(),
		name: sanitized(z.string()),
		slug: sanitized(z.string()),
	}),
	status: z.enum([EProductStatus.IN_STOCK, EProductStatus.LOW_STOCK, EProductStatus.OUT_OF_STOCK]),
	categoryId: z.uuid(),
	sku: sanitized(z.string().min(3).max(36)),
	images: z.array(z.string()).optional().nullable(),
	createdAt: z.coerce.date().transform((v) => v.toISOString()),
	updatedAt: z.coerce.date().transform((v) => v.toISOString()),
});

export const commonFields = productSchema.omit({
	id: true,
	category: true,
	status: true,
	createdAt: true,
	updatedAt: true,
});

export const productCreateSchema = commonFields.extend({});
export const productUpdateSchema = commonFields.partial();

export type TProduct = z.infer<typeof productSchema>;
export type TProductCreate = z.infer<typeof productCreateSchema>;
export type TProductUpdate = z.infer<typeof productUpdateSchema>;

export const productQuerySchema = commonQuery
	.extend({
		category: z.string().optional(),
		sort: z.enum(['createdAt', 'price']).default('createdAt'),
		minPrice: z.coerce.number().optional().default(0),
		maxPrice: z.coerce.number().optional().default(0),
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
			category: raw.category,
			minPrice: raw.minPrice,
			maxPrice: raw.maxPrice,
		},
		sort: {
			field: raw.sort,
			order: raw.order,
		},
	}));

export type TProductQuery = z.infer<typeof productQuerySchema>;
