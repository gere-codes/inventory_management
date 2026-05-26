import z, { nullable } from 'zod';

export const categorySchema = z.object({
	id: z.uuid(),
	name: z.string().min(2),
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
