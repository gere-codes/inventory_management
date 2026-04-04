import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { env } from '@config/env.js';
import { db, closeConnection } from '@db/index.js';
import { sql } from 'drizzle-orm';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.send('OK'));

async function startServer() {
	try {
		// connect to db
		console.log('⏳ Connecting to database...');
		await db.execute(sql`SELECT 1`);
		console.log('✅ Database connected');

		// start the app
		app.listen(env.PORT, () => {
			console.log(`🚀 Server ready at http://localhost:${env.PORT}`);
		});
	} catch (error) {
		console.error('❌ Failed to start server:', error);
		process.exit(1);
	}
}

process.on('SIGTERM', async () => {
	console.log('SIGTERM signal received: closing HTTP server');
	await closeConnection();
	process.exit(0);
});

startServer();
