import { commonQuery } from '@/shared/schema';
import z, { nullable } from 'zod';
const imageSchema = z.union([
	z.instanceof(File).refine((f) => f.size <= 5 * 1024 * 1024, 'Max 5MB'),
	z.string(),
	z.null(),
	z.undefined(),
]);

export const categorySchema = z.object({
	id: z.uuid(),
	name: z.string().min(2),
	image: imageSchema,
	description: z.string().nullable().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

const commonFields = categorySchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const categoryCreateSchema = commonFields.extend({});
export const categoryUpdateSchema = commonFields.partial();

export const categoryFormSchema = z.discriminatedUnion('mode', [
	commonFields.extend({
		mode: z.literal('CREATE'),
	}),
	commonFields.extend({
		mode: z.literal('EDIT'),
		id: z.uuid(),
	}),
]);

export type TCategory = z.infer<typeof categorySchema>;
export type TCategoryCreate = z.infer<typeof categoryCreateSchema>;
export type TCategoryUpdate = z.infer<typeof categoryUpdateSchema>;
export type TCategoryForm = z.infer<typeof categoryFormSchema>;

export const categoryQuerySchema = commonQuery
	.extend({
		search: z.string().optional(),
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
