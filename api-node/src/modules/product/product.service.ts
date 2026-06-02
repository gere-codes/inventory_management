import { BaseService, type IBaseService } from '@core/base/base.service.js';
import {
	productCreateSchema,
	productSchema,
	productUpdateSchema,
	type TProduct,
	type TProductCreate,
	type TProductQuery,
	type TProductUpdate,
} from './product.shema.js';
import type { IProductRepository } from './product.repository.js';
import type { TBaseQuery } from '@src/core/schema/general.schema.js';

export interface IProductService extends IBaseService<TProduct, TProductCreate, TProductUpdate, TBaseQuery> {
	getStats(userId: string): any;
	updateQuantity({
		userId,
		productId,
		quantity,
	}: {
		userId: string;
		productId: string;
		quantity: number;
	}): Promise<TProduct>;
}
export class ProductService
	extends BaseService<TProduct, TProductCreate, TProductUpdate, IProductRepository, TProductQuery>
	implements IProductService
{
	constructor(repository: IProductRepository) {
		super(repository, productSchema, productCreateSchema, productUpdateSchema);
	}

	async getStats(userId: string) {
		return await this.repository.getStats(userId);
	}

	async updateQuantity({
		userId,
		productId,
		quantity,
	}: {
		userId: string;
		productId: string;
		quantity: number;
	}): Promise<TProduct> {
		const response = await this.repository.updateQuantity({ userId, productId, quantity });
		return this.schema.parse(response);
	}
}
