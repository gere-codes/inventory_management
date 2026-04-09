import z from 'zod';

export const uuidSchema = z.uuid({ message: 'Invalid ID format' });
export const validateUUID = (id: string) => {
	return uuidSchema.safeParse(id);
};
