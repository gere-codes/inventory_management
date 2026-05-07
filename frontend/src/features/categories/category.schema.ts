import z, { nullable } from 'zod';

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

export const categoryFormSchema = z.discriminatedUnion('mode', [
	z.object({
		mode: z.literal('CREATE'),
		id: z.uuid().optional(),
		name: z.string(),
		description: z.string().optional().nullable(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	}),
	z.object({
		mode: z.literal('EDIT'),
		id: z.uuid(),
		name: z.string(),
		description: z.string().optional().nullable(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	}),
]);

export type TCategoryForm = z.infer<typeof categoryFormSchema>;
