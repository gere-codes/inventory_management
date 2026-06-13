import { db, closeConnection } from './index.js';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

async function runMigration() {
	console.log('⏳ Running database migrations...');
	try {
		await migrate(db, { migrationsFolder: './drizzle' });
		console.log('✅ Migrations applied successfully!');
	} catch (error) {
		console.error('❌ Migration failed:', error);
	} finally {
		await closeConnection();
		process.exit(0);
	}
}

runMigration();
