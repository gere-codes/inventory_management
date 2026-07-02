import { commonQuery, withOffset } from '@src/core/schema/general.schema.js';
import { sanitized } from '@src/core/validation/sanitized.js';
import z, { optional } from 'zod';

export const orderSchema = z.object({
	id: z.uuid(),
	productId: z.uuid().optional().nullable(),
	name: sanitized(z.string().min(1)),
	price: z.coerce.number().min(0.01),
	quantity: z.coerce.number().int().nonnegative(),
	description: sanitized(z.string().max(1000)).nullable().optional(),
	categoryId: z.uuid().optional(),
	category: z.object({
		id: z.uuid(),
		name: z.string(),
		slug: z.string(),
	}),
	sku: sanitized(z.string().min(3).max(36)),
	images: z.array(z.string()).optional().nullable(),
	status: z.enum(['pending', 'cancelled', 'received']),
	type: z.enum(['new', 'reorder']),
	createdAt: z.coerce.date().transform((v) => v.toISOString()),
	updatedAt: z.coerce.date().transform((v) => v.toISOString()),
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

export const orderQuerySchema = commonQuery
	.extend({
		search: z.string().optional(),
		category: z.string().optional(),
		sortBy: z.enum(['featured', 'priceAsc', 'priceDesc', 'nameAsc', 'nameDesc']).default('featured'),
	})
	.transform(withOffset);

export type TOrderQuery = z.infer<typeof orderQuerySchema>;

export const orderStatsSchema = z.object({});
export type TOrderStats = z.infer<typeof orderStatsSchema>;
