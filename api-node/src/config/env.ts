import { z } from 'zod';

const envSchema = z.object({
	DATABASE_URL: z.url('DATABASE_URL must be a valid connection string'),
	PORT: z
		.string()
		.default('5000')
		.transform((val) => parseInt(val, 10)),
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	ACCESS_TOKEN_KEY: z.string(),
	REFRESH_TOKEN_KEY: z.string(),
	allowedOrigins: z.string().transform((val) => val.split(',').map((s) => s.trim())),
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
	console.error('Invalid environment variables:', envServer.error.flatten().fieldErrors);
	throw new Error('Invalid environment variables');
}

export const env = envServer.data;
