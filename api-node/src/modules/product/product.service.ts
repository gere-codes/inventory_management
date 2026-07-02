import { BaseService, type IBaseService } from '@core/base/base.service.js';
import type { TProduct, TProductCreate, TProductQuery, TProductStats, TProductUpdate } from './product.shema.js';
import type { IProductRepository } from './product.repository.js';
import type { TBaseQuery } from '@src/core/schema/general.schema.js';
import { serviceError } from '@src/core/utils/error.util.js';

export interface IProductService extends IBaseService<
	TProduct,
	TProductCreate,
	TProductUpdate,
	TProductStats,
	TBaseQuery
> {
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
	extends BaseService<TProduct, TProductCreate, TProductUpdate, TProductStats, IProductRepository, TProductQuery>
	implements IProductService
{
	constructor(repository: IProductRepository) {
		super(repository);
	}

	async getStats(userId: string) {
		try {
			return await this.repository.getStats(userId);
		} catch (error) {
			return serviceError(error, 'Service Layer: getStats products failed', 'Failed to retrieve stats', {});
		}
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
