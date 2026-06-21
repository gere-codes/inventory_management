import z from 'zod';

export const commonQuery = z.object({
	isPaginated: z.boolean().default(true),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(50).default(10),
	search: z.string().optional(),
	sortBy: 'featured',
});

export const withOffset = <T extends { page: number; limit: number }>(data: T) => ({
	...data,
	offset: (data.page - 1) * data.limit,
});

export const baseQuerySchema = commonQuery.transform(withOffset);

export type TBaseQuery = z.infer<typeof baseQuerySchema>;

export const paginationSchema = z
	.object({
		page: z.number(),
		limit: z.number(),
		totalItems: z.number(),
		totalPages: z.number(),
	})
	.nullish();

export type TPagination = z.infer<typeof paginationSchema>;
