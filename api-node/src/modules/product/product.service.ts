import { BaseService, type IBaseService } from '@core/base/base.service.js';
import type { IBaseRepository } from '@src/core/base/base.repository.js';
import {
	productCreateSchema,
	productSchema,
	productUpdateSchema,
	type TProduct,
	type TProductCreate,
	type TProductUpdate,
} from './product.shema.js';
import type { IProductRepository } from './product.repository.js';

export interface IProductService extends IBaseService<TProduct, TProductCreate, TProductUpdate> {
	getStats(userId: string): any;
}
export class ProductService
	extends BaseService<TProduct, TProductCreate, TProductUpdate, IProductRepository>
	implements IProductService
{
	constructor(repository: IProductRepository) {
		super(repository, productSchema, productCreateSchema, productUpdateSchema);
	}

	async getStats(userId: string) {
		return await this.repository.getStats(userId);
	}
}
