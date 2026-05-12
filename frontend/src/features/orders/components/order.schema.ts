import z from 'zod';
export const orderSchema = z.object({
	id: z.uuid(),
	userId: z.uuid(),
	productId: z.uuid(),
	name: z.string().min(1),
	price: z.coerce.number().nonnegative().multipleOf(0.01),
	quantity: z.coerce.number().int().nonnegative(),
	description: z.string().max(1000).nullable().optional(),
	categoryId: z.uuid(),
	sku: z.string().min(3).max(36),
	imageUrl: z.string().optional().nullable(),
	status: z.enum(['pending', 'cancelled', 'received']),
	type: z.enum(['new', 'reorder']),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const createOrderSchema = orderSchema.omit({
	id: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
});

export const updateOrderSchema = createOrderSchema.partial();

export type TOrder = z.infer<typeof orderSchema>;
export type TCreateOrder = z.infer<typeof createOrderSchema>;
export type TUpdateOrder = z.infer<typeof updateOrderSchema>;
