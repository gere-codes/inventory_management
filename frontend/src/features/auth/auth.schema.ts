import z from 'zod';
export const passwordRules = z
	.string()
	.min(6, 'Password must be at least 6 characters')
	.max(60, ' Password cannot exceed 60 characters')
	.transform((p) => p.trim());
export const loginSchema = z.object({
	email: z.email('Enter a valid email'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type TLoginFormData = z.infer<typeof loginSchema>;

export const registerchema = z
	.object({
		name: z.string().min(3, 'Please enter a valid name'),
		email: z.email('Enter a valid email'),
		password: passwordRules,
		confirmPassword: passwordRules,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export type TRegisterFormData = z.infer<typeof registerchema>;
