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

export const productFormSchema = z.discriminatedUnion('mode', [
	// CREATE
	z.object({
		mode: z.literal('CREATE'),
		name: z.string().min(2),
		price: z.number().min(0.01),
		categoryId: z.uuid(),
		id: z.string().optional(),
		sku: z.string().min(3, 'Minimum 3 charatesr are required'),
		quantity: z.number().min(0, 'Quantity'),
		description: z.string().optional().nullable(),
	}),

	// EDIT
	z.object({
		mode: z.literal('EDIT'),
		name: z.string().min(2),
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
