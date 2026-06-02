import z from 'zod';

export const commonQuery = z.object({
	isPaginated: z.preprocess((val) => val !== 'false', z.boolean()).default(true),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(50).default(10),
	search: z.string().trim().optional(),
	order: z.enum(['asc', 'desc']).default('desc'),
});
export const baseQuerySchema = commonQuery.transform((raw) => ({
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
		field: 'createdAt',
		order: raw.order,
	},
}));

export type TBaseQuery = z.infer<typeof baseQuerySchema>;

export const context = z.object({
	userId: z.uuid().optional(),
});

export type TContext = z.infer<typeof context>;
