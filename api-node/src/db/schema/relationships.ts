import { relations } from 'drizzle-orm';
import { users } from './user.js';
import { products } from './product.js';
import { categories } from './category.js';
import { suppliers } from './supplier.js';

export const userRelations = relations(users, ({ many }) => ({
	products: many(products),
	categories: many(categories),
	suppliers: many(suppliers),
}));

export const productRelations = relations(products, ({ one, many }) => ({
	user: one(users, {
		fields: [products.userId],
		references: [users.id],
	}),
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id],
	}),
}));

export const categoryRelations = relations(categories, ({ one, many }) => ({
	user: one(users, {
		fields: [categories.userId],
		references: [users.id],
	}),
	products: many(products),
}));

export const supplierRelations = relations(suppliers, ({ one, many }) => ({
	user: one(users, {
		fields: [suppliers.userId],
		references: [users.id],
	}),
}));
