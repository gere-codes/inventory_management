import { pgTable, uuid, varchar, timestamp, decimal, integer } from 'drizzle-orm/pg-core';
import { users } from './user.js';
import { categories } from './category.js';

export const products = pgTable('products', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id),
	name: varchar('name', { length: 100 }).notNull(),
	description: varchar('description', { length: 1000 }),
	sku: varchar('sku', { length: 36 }).unique().notNull(),
	price: decimal('price').default('0.00').notNull(),
	quantity: integer('quantity').default(1).notNull(),
	categoryId: uuid('category_id')
		.references(() => categories.id)
		.notNull(),
	image: varchar('image', { length: 500 }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date()),
});
