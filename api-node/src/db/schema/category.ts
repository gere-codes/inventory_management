import { pgTable, uuid, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './user.js';

export const categories = pgTable(
	'categories',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: uuid('user_id')
			.references(() => users.id)
			.notNull(),
		name: varchar('name', { length: 100 }).notNull(),
		image: varchar('image', { length: 500 }).notNull(),
		slug: varchar('slug', { length: 100 }).notNull().unique(),
		description: varchar('description', { length: 225 }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => {
		return {
			slugIdx: uniqueIndex('slug_idx').on(table.slug),
		};
	},
);

export type TCategory = typeof categories.$inferSelect;
export type TCategoryCreate = typeof categories.$inferInsert;
