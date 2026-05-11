import { sanitized } from '@src/core/validation/sanitized.js';
import z, { uuid } from 'zod';

export const orderSchema = z.object({
	productdtId: z.uuid(),
	name: z.string().min(1),
	price: z.coerce.number().positive(),
	description: sanitized(z.string().max(1000)).nullable().optional(),
	quantity: z.coerce.number().int().nonnegative(),
	categoryId: z.uuid(),
	sku: sanitized(z.string().min(3).max(36)),
	imageUrl: z.string().optional().nullable(),
	status: z.enum(['pending', 'cancelled', 'received']),
	type: z.enum(['new', 'reorder']),
});

export const createOrderSchema = orderSchema.extend({});
export const updateOrderSchema = orderSchema.partial();

export const responseOrderSchema = orderSchema.extend({
	id: z.uuid(),
	createdAt: z.coerce.date().transform((v) => v.toISOString()),
	updatedAt: z.coerce.date().transform((v) => v.toISOString()),
});
