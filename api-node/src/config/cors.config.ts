import { env } from './env.js';

const allowedOrigin = env.allowedOrigins;

export const corsOptions = {
	origin: allowedOrigin,
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
