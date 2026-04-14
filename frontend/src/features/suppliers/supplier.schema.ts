import z from 'zod';

export const supplierCreateSchema = z.object({
	name: z.string().min(1).max(100),
	phone: z.string().regex(/^[0-9+\-()/\s]+$/),
	address: z.string().optional().nullable(),
	description: z.string().optional().nullable(),
});

export const supplierSchema = supplierCreateSchema.extend({
	id: z.uuid(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const supplierUpdateSchema = supplierCreateSchema.partial();

export type TSupplierCreate = z.infer<typeof supplierCreateSchema>;
export type TSupplier = z.infer<typeof supplierSchema>;
export type TSupplierUpdate = z.infer<typeof supplierUpdateSchema>;
