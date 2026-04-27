import { BaseService, type IBaseService } from '@base';
import {
	productCreateSchema,
	productSchema,
	productUpdateSchema,
	type TProduct,
	type TProductCreate,
	type TProductUpdate,
} from './product.schema';
import { privateInstance } from '@/shared/api';

export interface IProductService extends IBaseService<TProduct, TProductCreate, TProductUpdate, FormData, FormData> {
	getStats(): Promise<any>;
}
export class ProductService
	extends BaseService<TProduct, TProductCreate, TProductUpdate, FormData, FormData>
	implements IProductService
{
	constructor(resource: string) {
		super(resource, productSchema, productCreateSchema, productUpdateSchema);
	}
	async getStats(): Promise<any> {
		const response = await privateInstance.get('/product/stats');
		return response.data.data;
	}
}

export const productService = new ProductService('product');
