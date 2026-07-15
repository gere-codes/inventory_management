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
	id: z.uuid('product id must be a valid UUID'),
	name: z.string().min(2, 'Name must be at least 2 characters long').max(100, 'Name cannot exceed 100 characters'),
	price: z.number('Price must be a non-negative number').nonnegative('Price must be a non-negative number'),
	description: z.string().max(1000, 'Description cannot exceed 1000 characters').nullable().optional(),
	quantity: z.number('Quantity must to be a valid number').int().nonnegative(),
	categoryId: z.uuid('categoryId must be a valid UUID'),
	category: z.object({
		id: z.uuid('categoryId must be a valid UUID'),
		name: z.string('Category name must be a valid string'),
		slug: z.string('Category slug must be a valid string'),
	}),
	sku: z.string().min(3, 'SKU must be at least 3 characters ').max(36, 'SKU cannot exceed 36 characters'),
	images: imagesSchema,
	status: z.enum(
		[EProductStatus.IN_STOCK, EProductStatus.LOW_STOCK, EProductStatus.OUT_OF_STOCK],
		'Product status must be valid status',
	),
	createdAt: z.string('Created at must be a valid date string'),
	updatedAt: z.string('Updated at must be a valid date string'),
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
	stockLevel: z.object({
		lowStock: z.number(),
		outOfStock: z.number(),
		totalProducts: z.number(),
	}),
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
