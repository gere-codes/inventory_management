import { users } from './user.js';
import { products } from './product.js';
import { suppliers } from './supplier.js';
import { categories } from './category.js';
import { orders } from './order.js';
import {
	userRelations,
	productRelations,
	categoryRelations,
	supplierRelations,
	orderRelations,
} from './relationships.js';

const schema = {
	users,
	products,
	suppliers,
	categories,
	orders,
	userRelations,
	productRelations,
	categoryRelations,
	supplierRelations,
	orderRelations,
};

export { users, products, suppliers, categories, orders };
export default schema;
