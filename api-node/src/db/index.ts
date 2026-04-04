import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;

import * as schema from './schema.js';
import { env } from '@config/env.js';

const pool = new Pool({
	connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export const closeConnection = async () => {
	await pool.end();
};
export * from './schema.js';
