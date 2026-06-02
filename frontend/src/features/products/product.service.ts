import { BaseService, type IBaseService } from '@base';
import {
	productCreateSchema,
	productQuerySchema,
	productSchema,
	productUpdateSchema,
	type TProduct,
	type TProductCreate,
	type TProductQuery,
	type TProductUpdate,
} from './product.schema';
import { privateInstance } from '@/shared/api';

export interface IProductService extends IBaseService<
	TProduct,
	TProductCreate,
	TProductUpdate,
	FormData,
	FormData,
	TProductQuery
> {
	getStats(): Promise<any>;
	updateQuantity({ productId, quantity }: { productId: string; quantity: number }): Promise<TProduct>;
}
export class ProductService
	extends BaseService<TProduct, TProductCreate, TProductUpdate, FormData, FormData, TProductQuery>
	implements IProductService
{
	constructor(resource: string) {
		super(resource, productSchema, productCreateSchema, productUpdateSchema, productQuerySchema);
	}
	async getStats(): Promise<any> {
		const response = await privateInstance.get('/product/stats');
		return response.data.data;
	}
	async updateQuantity({ productId, quantity }: { productId: string; quantity: number }): Promise<TProduct> {
		const response = await privateInstance.put(`/product/${productId}/quantity`, { quantity });
		return response.data.data;
	}
	protected queryBuilder(params: TProductQuery): URLSearchParams | null {
		const urlParams = new URLSearchParams();

		if (params) {
			if (params.filter && typeof params.filter === 'object') {
				Object.entries(params.filter).forEach(([key, value]) => {
					if (value !== undefined && value !== null && value !== '') {
						urlParams.append(key, String(value));
					}
				});
			}
			return urlParams;
		}

		return null;
	}
}

export const productService = new ProductService('product');
