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

interface IProductService extends IBaseService<TProduct, TProductCreate, TProductUpdate> {}
export class ProductService extends BaseService<TProduct, TProductCreate, TProductUpdate> implements IProductService {
	constructor(repository: IBaseRepository<TProduct, TProductCreate, TProductUpdate>) {
		super(repository, productSchema, productCreateSchema, productUpdateSchema);
	}
}
