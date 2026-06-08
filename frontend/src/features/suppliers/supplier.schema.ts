import { EModalMode } from '@/shared/components/common';
import { commonQuery, withOffset } from '@/shared/schema';
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

export const supplierFormSchema = z.discriminatedUnion('mode', [
	z.object({
		mode: z.literal(EModalMode.CREATE),
		id: z.uuid().optional(),
		name: z.string().min(1).max(100),
		phone: z.string().regex(/^[0-9+\-()/\s]+$/),
		address: z.string().optional().nullable(),
		description: z.string().optional().nullable(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	}),
	z.object({
		mode: z.literal(EModalMode.EDIT),
		id: z.uuid(),
		name: z.string().min(1).max(100),
		phone: z.string().regex(/^[0-9+\-()/\s]+$/),
		address: z.string().optional().nullable(),
		description: z.string().optional().nullable(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	}),
]);

export type TSupplierForm = z.infer<typeof supplierFormSchema>;

export const suppplierQuerySchema = commonQuery
	.extend({
		search: z.string().optional(),
		sort: z.enum(['createdAt', 'name']).default('createdAt'),
	})
	.transform(withOffset);

export type TSupplierQuery = z.infer<typeof suppplierQuerySchema>;
