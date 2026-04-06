import z from 'zod';
export const userSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	email: z.email(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date(),
});

export type TUser = z.infer<typeof userSchema>;
