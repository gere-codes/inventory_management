import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './user.js';

export const suppliers = pgTable('suppliers', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id),
	name: varchar('name', { length: 100 }).notNull(),
	phone: varchar('phone', { length: 36 }),
	address: varchar('address', { length: 225 }),
	description: varchar('description', { length: 225 }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
});

export type TSupplier = typeof suppliers.$inferSelect;
export type TSupplierCreate = typeof suppliers.$inferInsert;
