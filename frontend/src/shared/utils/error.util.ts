// zod Error handler
import type z from 'zod';

export const formatZodErrors = (error: z.ZodError) => {
	const errors: Record<string, string> = {};
	error.issues.forEach((issue: any) => {
		const key = issue.path[0] as string;
		errors[key] = issue.message;
	});
	return errors;
};
