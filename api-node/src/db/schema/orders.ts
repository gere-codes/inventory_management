import { pgTable, uuid, varchar, timestamp, decimal, integer, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './user.js';
import { categories } from './category.js';
import { products } from './product.js';

export const orderType = pgEnum('order_type', ['new', 'reorder']);
export const orderStatus = pgEnum('order_status', ['pending', 'cancelled', 'received']);

export const orders = pgTable('orders', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id),
	description: varchar('description', { length: 1000 }),
	productId: uuid('product_id')
		.references(() => products.id)
		.notNull(),
	name: varchar('name', { length: 100 }).notNull(),
	sku: varchar('sku', { length: 36 }).unique().notNull(),
	price: decimal('price').default('0.00').notNull(),
	quantity: integer('quantity').default(1).notNull(),
	categoryId: uuid('category_id')
		.references(() => categories.id)
		.notNull(),
	imageUrl: varchar('image_url', { length: 500 }),
	status: orderStatus('status').notNull().default('pending'),
	type: orderType('type').notNull().default('new'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date()),
});
