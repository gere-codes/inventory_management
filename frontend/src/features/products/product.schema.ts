import { z } from 'zod';
import { EProductStatus } from './product.enum.js';
import { baseQuerySchema, commonQuery } from '@/shared/schema/general.schema.js';
const imageSchema = z.union([
	z.instanceof(File).refine((f) => f.size <= 5 * 1024 * 1024, 'Max 5MB'),
	z.string(),
	z.null(),
	z.undefined(),
]);

const imagesSchema = z.array(imageSchema).optional().nullable();

export const productCreateSchema = z.object({
	name: z.string().min(2).max(100),
	price: z.number().nonnegative(),
	description: z.string().max(1000).nullable().optional(),
	quantity: z.number().int().nonnegative(),
	categoryId: z.uuid(),
	sku: z.string().min(3).max(36),
	images: imagesSchema,
});

export const productSchema = productCreateSchema.extend({
	id: z.uuid(),
	category: z.string(),
	status: z.enum([EProductStatus.IN_STOCK, EProductStatus.LOW_STOCK, EProductStatus.OUT_OF_STOCK]),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export const productUpdateSchema = productCreateSchema.partial();

export const productFormSchema = z.discriminatedUnion('mode', [
	// CREATE
	z.object({
		mode: z.literal('CREATE'),
		name: z.string().min(2),
		images: imagesSchema,
		price: z.number().min(0.01),
		categoryId: z.uuid(),
		id: z.string().optional(),
		sku: z.string().min(3, { message: 'Minimum 3 characters are required' }),
		quantity: z.number().min(0, { message: 'Quantity must be ≥ 0' }),
		description: z.string().optional().nullable(),
	}),

	// EDIT
	z.object({
		mode: z.literal('EDIT'),
		name: z.string().min(2),
		images: imagesSchema,
		price: z.number().min(0.01),
		categoryId: z.uuid(),
		id: z.uuid(),
		sku: z.string().min(3, ' SKU must be minium 3 characters'),
		quantity: z.number().min(0, 'Quantity'),
		description: z.string().optional().nullable(),
	}),
]);

export type TProduct = z.infer<typeof productSchema>;
export type TProductCreate = z.infer<typeof productCreateSchema>;
export type TProductUpdate = z.infer<typeof productUpdateSchema>;

export type TProductFormValues = z.infer<typeof productFormSchema>;

export const productStatsSchema = z.object({
	categories: z.array(
		z.object({
			name: z.string(),
			count: z.number(),
		}),
	),
	lowStock: z.number(),
	outOfStock: z.number(),
	totalProducts: z.number(),
});

export type TProductStats = z.infer<typeof productStatsSchema>;

export const productQuerySchema = commonQuery
	.extend({
		search: z.string().optional(),
		categoryId: z.uuid().optional(),
		sort: z.enum(['createdAt', 'price', 'name']).default('createdAt'),
		order: z.enum(['asc', 'desc']).default('desc'),
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
