import { commonQuery } from '@src/core/schema/general.schema.js';
import { sanitized } from '@src/core/validation/sanitized.js';
import z from 'zod';

export const categoryCreateSchema = z.object({
	name: sanitized(z.string().min(2)),
	image: z.string(),
	slug: z.string().max(100),
	description: sanitized(z.string()).nullable().optional(),
});

export const categorySchema = categoryCreateSchema.extend({
	id: z.uuid(),
	createdAt: z.coerce.date().transform((v) => v.toISOString()),
	updatedAt: z.coerce.date().transform((v) => v.toISOString()),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export type TCategory = z.infer<typeof categorySchema>;
export type TCategoryCreate = z.infer<typeof categoryCreateSchema>;
export type TCategoryUpdate = z.infer<typeof categoryUpdateSchema>;

export const categoryQuerySchema = commonQuery
	.extend({
		sort: z.enum(['createdAt', 'name']).default('createdAt'),
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

export type TCategoryQuery = z.infer<typeof categoryQuerySchema>;
