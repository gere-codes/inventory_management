import { commonQuery } from '@src/core/schema/general.schema.js';
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
		sort: z.enum(['createdAt', 'name']).default('createdAt'),
		order: z.enum(['asc', 'desc']).default('desc'),
	})
	.transform((raw) => ({
		isPaginated: raw.isPaginated,
		pagination: {
			page: raw.page,
			limit: raw.limit,
			offset: (raw.page - 1) * raw.limit,
		},
		filter: {
			search: raw.search,
		},
		sort: {
			field: raw.sort,
			order: raw.order,
		},
	}));

export type TSupplierQuery = z.infer<typeof supplierQuerySchema>;
