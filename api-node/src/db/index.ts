import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import schema from './schema/index.js';

import { env } from '@config/env.js';

const pool = new Pool({
	connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export const closeConnection = async () => {
	await pool.end();
};
export * from './schema/index.js';
