import { commonQuery, withOffset } from '@src/core/schema/general.schema.js';
import { sanitized, sanitizedPhone } from '@src/core/validation/sanitized.js';
import z from 'zod';

export const supplierCreateSchema = z.object({
	name: sanitized(z.string().min(1).max(100)),
	phone: sanitizedPhone,
	address: sanitized(z.string()).optional().nullable(),
	description: sanitized(z.string()).optional().nullable(),
});

export const supplierSchema = supplierCreateSchema.extend({
	id: z.uuid(),
	createdAt: z.coerce.date().transform((v) => v.toISOString()),
	updatedAt: z.coerce.date().transform((v) => v.toISOString()),
});

export const supplierUpdateSchema = supplierCreateSchema.partial();

export type TSupplierCreate = z.infer<typeof supplierCreateSchema>;
export type TSupplier = z.infer<typeof supplierSchema>;
export type TSupplierUpdate = z.infer<typeof supplierUpdateSchema>;

export const supplierQuerySchema = commonQuery
	.extend({
		search: z.string().optional(),
		sortBy: z.enum(['featured', 'nameAsc', 'nameDesc']).default('featured'),
	})
	.transform(withOffset);

export type TSupplierQuery = z.infer<typeof supplierQuerySchema>;
