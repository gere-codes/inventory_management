import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

// users schema
export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 100 }).notNull(),
	email: varchar('email', { length: 100 }).unique().notNull(),
	password: varchar('password', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
});

export type TUser = typeof users.$inferSelect;
export type TUserResponse = Omit<TUser, 'password' | 'createdAt'>;
export type TUserInsert = typeof users.$inferInsert;
