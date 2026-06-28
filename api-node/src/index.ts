import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';

import { env } from '@config/env.js';
import { db, closeConnection } from '@db/index.js';
import { sql } from 'drizzle-orm';

import apiRoutes from '@routes/index.js';
import { globalErrorHandler } from '@middlewares/index.js';
import { apiLimiter, corsOptions } from '@config/index.js';

const app = express();

// Middleware
app.set('trust proxy', 1);
app.get('/health', (req, res) => res.send('OK'));
app.use(
	helmet({
		xPoweredBy: false,
		frameguard: { action: 'deny' },
		crossOriginResourcePolicy: { policy: 'cross-origin' },
	}),
);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiLimiter);

app.use(
	'/api/uploads',
	express.static('uploads', {
		index: false,
		fallthrough: true,
	}),
);

app.use('/api', apiRoutes);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/*spat', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// global error handler
app.use(globalErrorHandler);

async function startServer() {
	try {
		// connect to db
		console.log('Connecting to database...');
		await db.execute(sql`SELECT 1`);
		console.log('Database connected');

		// start the app
		app.listen(Number(env.PORT), () => {
			console.log(`Server ready at http://localhost:${env.PORT}`);
		});
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
}

process.on('SIGTERM', async () => {
	console.log('SIGTERM signal received: closing HTTP server');
	await closeConnection();
	process.exit(0);
});

startServer();
