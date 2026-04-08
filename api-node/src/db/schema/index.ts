import { users } from './user.js';
import { products } from './product.js';
import { suppliers } from './supplier.js';
import { categories } from './category.js';
import { userRelations, productRelations, categoryRelations, supplierRelations } from './relationships.js';

const schema = {
	users,
	products,
	suppliers,
	categories,
	userRelations,
	productRelations,
	categoryRelations,
	supplierRelations,
};

export { users, products, suppliers, categories };
export default schema;
