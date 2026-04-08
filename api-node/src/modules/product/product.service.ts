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
import { EProductStatus } from './product.enum.js';

interface IProductService extends IBaseService<TProduct, TProductCreate, TProductUpdate> {}
export class ProductService extends BaseService<TProduct, TProductCreate, TProductUpdate> implements IProductService {
	constructor(repository: IBaseRepository<TProduct, TProductCreate, TProductUpdate>) {
		super(repository, productSchema, productCreateSchema, productUpdateSchema);
	}

	protected format(record: any): TProduct {
		return {
			id: record.id,
			name: record.name,
			price: record.price,
			quantity: record.quantity,
			sku: record.sku,
			description: record?.description,
			categoryId: record.categoryId,
			category: record.Category.name || '',
			status: this.getStockStatus(record.quantity),
			createdAt: record.createdAt,
			updatedAt: record.updatedAt,
		};
	}

	private getStockStatus(qty: number): EProductStatus {
		if (qty <= 0) return EProductStatus.OUT_OF_STOCK;
		if (qty <= 5) return EProductStatus.LOW_STOCK;
		return EProductStatus.IN_STOCK;
	}
}
