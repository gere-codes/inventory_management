import { BaseService, type IBaseService } from '@base';
import {
	productCreateSchema,
	productQuerySchema,
	productSchema,
	productStatsSchema,
	productUpdateSchema,
	type TProduct,
	type TProductCreate,
	type TProductQuery,
	type TProductStats,
	type TProductUpdate,
} from './product.schema';
import { privateInstance } from '@/shared/api';

export interface IProductService extends IBaseService<
	TProduct,
	TProductCreate,
	TProductUpdate,
	TProductStats,
	FormData,
	FormData,
	TProductQuery
> {
	getStats(): Promise<any>;
	updateQuantity({ productId, quantity }: { productId: string; quantity: number }): Promise<TProduct>;
}
export class ProductService
	extends BaseService<TProduct, TProductCreate, TProductUpdate, TProductStats, FormData, FormData, TProductQuery>
	implements IProductService
{
	constructor(resource: string) {
		super(
			resource,
			productSchema,
			productCreateSchema,
			productUpdateSchema,
			productStatsSchema,
			productQuerySchema,
		);
	}
	async getStats(): Promise<any> {
		const response = await privateInstance.get('/product/stats');
		return response.data.data;
	}
	async updateQuantity({ productId, quantity }: { productId: string; quantity: number }): Promise<TProduct> {
		const response = await privateInstance.put(`/product/${productId}/quantity`, { quantity });
		return response.data.data;
	}
}

export const productService = new ProductService('product');
