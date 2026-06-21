import { z } from 'zod';
import { EProductStatus } from './product.enum.js';
import { baseQuerySchema, commonQuery, withOffset } from '@/shared/schema/general.schema.js';
const imageSchema = z.union([
	z.instanceof(File).refine((f) => f.size <= 5 * 1024 * 1024, 'Max 5MB'),
	z.string(),
	z.null(),
	z.undefined(),
]);

const imagesSchema = z.array(imageSchema).optional().nullable();

export const productSchema = z.object({
	id: z.uuid(),
	name: z.string().min(2).max(100),
	price: z.coerce.number().nonnegative(),
	description: z.string().max(1000).nullable().optional(),
	quantity: z.number().int().nonnegative(),
	categoryId: z.uuid(),
	category: z.object({
		id: z.uuid(),
		name: z.string(),
		slug: z.string(),
	}),
	sku: z.string().min(3).max(36),
	images: imagesSchema,
	status: z.enum([EProductStatus.IN_STOCK, EProductStatus.LOW_STOCK, EProductStatus.OUT_OF_STOCK]),
	createdAt: z.string(),
	updatedAt: z.string(),
});

const commonFields = productSchema.omit({
	id: true,
	category: true,
	status: true,
	createdAt: true,
	updatedAt: true,
});

export const productCreateSchema = commonFields.extend({});
export const productUpdateSchema = commonFields.partial();

export const productFormSchema = z.discriminatedUnion('mode', [
	// CREATE
	commonFields.extend({
		mode: z.literal('CREATE'),
	}),

	// EDIT
	commonFields.extend({
		mode: z.literal('EDIT'),
		id: z.uuid(),
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
		category: z.string().optional(),
		sortBy: z.enum(['featured', 'priceAsc', 'priceDesc']).default('featured'),
		minPrice: z.coerce.number().optional().default(0),
		maxPrice: z.coerce.number().optional().default(0),
	})
	.transform(withOffset);

export type TProductQuery = z.infer<typeof productQuerySchema>;

export type TProductQueryInput = z.input<typeof productQuerySchema>;
export type TProductQueryOutput = z.output<typeof productQuerySchema>;
