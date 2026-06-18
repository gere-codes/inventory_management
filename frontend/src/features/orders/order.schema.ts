import { commonQuery, withOffset } from '@/shared/schema';
import z, { uuid } from 'zod';
const imageSchema = z.union([
	z.instanceof(File).refine((f) => f.size <= 5 * 1024 * 1024, 'Max 5MB'),
	z.string(),
	z.null(),
	z.undefined(),
]);

const imagesSchema = z.array(imageSchema).optional().nullable();

export const orderSchema = z.object({
	id: z.uuid(),
	productId: z.uuid().optional().nullable(),
	name: z.string().min(1),
	price: z.number().min(0.01),
	quantity: z.number().min(0),
	description: z.string().max(1000).nullable().optional(),
	categoryId: z.uuid(),
	category: z.object({
		id: z.uuid(),
		name: z.string(),
		slug: z.string(),
	}),
	sku: z.string().min(3).max(36),
	images: imagesSchema,
	status: z.enum(['pending', 'cancelled', 'received']),
	type: z.enum(['new', 'reorder']),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

const commonFields = orderSchema.omit({
	id: true,
	category: true,
	createdAt: true,
	updatedAt: true,
});
export const createOrderSchema = commonFields.extend({});

export const updateOrderSchema = commonFields.partial();

export type TOrder = z.infer<typeof orderSchema>;
export type TCreateOrder = z.infer<typeof createOrderSchema>;
export type TUpdateOrder = z.infer<typeof updateOrderSchema>;

export const orderFormSchema = z.discriminatedUnion('mode', [
	commonFields.extend({
		mode: z.literal('CREATE'),
	}),

	commonFields.extend({
		mode: z.literal('EDIT'),
		id: z.uuid(),
	}),
]);

export type TOrderForm = z.infer<typeof orderFormSchema>;

export const orderQuerySchema = commonQuery
	.extend({
		search: z.string().optional(),
		categoryId: z.uuid().optional(),
		sort: z.enum(['createdAt', 'price', 'name']).default('createdAt'),
		order: z.enum(['asc', 'desc']).default('desc'),
	})
	.transform(withOffset);

export type TOrdertQuery = z.infer<typeof orderQuerySchema>;
