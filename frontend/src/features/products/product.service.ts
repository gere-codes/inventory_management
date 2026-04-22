import { BaseService } from '@base';
import {
	productCreateSchema,
	productSchema,
	productUpdateSchema,
	type TProduct,
	type TProductCreate,
	type TProductUpdate,
} from './product.schema';

export class ProductService extends BaseService<TProduct, TProductCreate, TProductUpdate, FormData, FormData> {
	constructor(resource: string) {
		super(resource, productSchema, productCreateSchema, productUpdateSchema);
	}
}

export const productService = new ProductService('product');
