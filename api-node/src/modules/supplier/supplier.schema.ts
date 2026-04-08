import { sanitized, sanitizedPhone } from '@src/core/validation/sanitized.js';
import z from 'zod';

export const supplierCreateSchema = z.object({
	name: sanitized(z.string().min(1).max(100)),
	phone: sanitizedPhone,
	address: sanitized(z.string()).optional().nullable(),
	description: sanitized(z.string()),
});

export const supplierSchema = supplierCreateSchema.extend({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const supplierUpdateSchema = supplierCreateSchema.partial();

export type TSupplierCreate = z.infer<typeof supplierCreateSchema>;
export type TSupplier = z.infer<typeof supplierSchema>;
export type TSupplierUpdate = z.infer<typeof supplierUpdateSchema>;
