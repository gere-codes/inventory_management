import z from 'zod';

export const categoryCreateSchema = z.object({
	name: z.string().min(2),
	description: z.string().nullable().optional(),
});

export const categorySchema = categoryCreateSchema.extend({
	id: z.uuid(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export type TCategory = z.infer<typeof categorySchema>;
export type TCategoryCreate = z.infer<typeof categoryCreateSchema>;
export type TCategoryUpdate = z.infer<typeof categoryUpdateSchema>;
