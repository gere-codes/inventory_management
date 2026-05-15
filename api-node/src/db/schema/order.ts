import { pgTable, uuid, varchar, timestamp, decimal, integer, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './user.js';
import { categories } from './category.js';
import { products } from './product.js';

export const orders = pgTable('orders', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id),
	description: varchar('description', { length: 1000 }),
	productId: uuid('product_id').references(() => products.id),

	name: varchar('name', { length: 100 }).notNull(),
	sku: varchar('sku', { length: 36 }).unique().notNull(),
	price: decimal('price').default('0.00').notNull(),
	quantity: integer('quantity').default(1).notNull(),
	categoryId: uuid('category_id')
		.references(() => categories.id)
		.notNull(),
	imageUrl: varchar('image_url', { length: 500 }),
	status: varchar('status', { length: 20 }).notNull().default('pending'),
	type: varchar('type', { length: 20 }).notNull().default('new'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date()),
});
