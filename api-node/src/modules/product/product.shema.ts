import { sanitized } from '@src/core/validation/sanitized.js';
import { z } from 'zod';
import { EProductStatus } from './product.enum.js';
import { baseQuerySchema, commonQuery, withOffset } from '@src/core/schema/general.schema.js';

export const productSchema = z.object({
	id: z.uuid('product id must be a valid UUID'),
	name: sanitized(
		z.string().min(2, 'Name must be at least 2 characters long').max(100, 'Name cannot exceed 100 characters'),
	),
	price: z.coerce.number('Price must be a non-negative number').positive(),
	description: sanitized(z.string().max(1000, 'Description cannot exceed 1000 characters')).nullable().optional(),
	quantity: z.coerce.number('Quantity must to be a valid number').int().nonnegative(),
	category: z.object({
		id: z.uuid('categoryId must be a valid UUID'),
		name: sanitized(z.string('Category name must be a valid string')),
		slug: sanitized(z.string('Category slug must be a valid string')),
	}),
	status: z.enum(
		[EProductStatus.IN_STOCK, EProductStatus.LOW_STOCK, EProductStatus.OUT_OF_STOCK],
		'Product status must be valid status',
	),
	categoryId: z.uuid('categoryId must be a valid UUID'),
	sku: sanitized(z.string().min(3, 'SKU must be at least 3 characters ').max(36, 'SKU cannot exceed 36 characters')),
	images: z
		.array(sanitized(z.string('Must be a valid string')))
		.optional()
		.nullable(),
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
		sortBy: z.enum(['featured', 'priceAsc', 'priceDesc']).default('featured'),
		minPrice: z.coerce.number().optional().default(0),
		maxPrice: z.coerce.number().optional().default(0),
	})
	.transform(withOffset);

export type TProductQuery = z.infer<typeof productQuerySchema>;

export const productStatsSchema = z.object({
	stockLevel: z.object({
		lowStock: z.number(),
		outOfStock: z.number(),
		totalProducts: z.number(),
	}),
});

export type TProductStats = z.infer<typeof productStatsSchema>;
