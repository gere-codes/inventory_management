import { BaseService, type IBaseService } from '@core/base/base.service.js';
import type { TProduct, TProductCreate, TProductQuery, TProductUpdate } from './product.shema.js';
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
		super(repository);
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
		return this.repository.updateQuantity({ userId, productId, quantity });
	}
}
