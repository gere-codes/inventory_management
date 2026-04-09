import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { env } from '@config/env.js';
import { db, closeConnection } from '@db/index.js';
import { sql } from 'drizzle-orm';

import apiRoutes from '@routes/index.js';
import { globalErrorHandler } from '@middlewares/index.js';
import { apiLimiter, corsOptions } from '@config/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	helmet({
		xPoweredBy: false,
		frameguard: { action: 'deny' },
	}),
);
app.use(cookieParser());

app.use(apiLimiter);

app.get('/health', (req, res) => res.send('OK'));

app.use('/api', apiRoutes);

// global error handler
app.use(globalErrorHandler);

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
