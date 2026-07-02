import { BaseService, type IBaseService } from '@src/core/base/base.service.js';
import type { TSupplier, TSupplierCreate, TSupplierStats, TSupplierUpdate } from './supplier.schema.js';
import type { ISupplierRepository } from './supplier.repository.js';

export interface ISupplierService extends IBaseService<TSupplier, TSupplierCreate, TSupplierUpdate, TSupplierStats> {}

export class SupplierService
	extends BaseService<TSupplier, TSupplierCreate, TSupplierUpdate, TSupplierStats, ISupplierRepository>
	implements ISupplierService
{
	constructor(repository: ISupplierRepository) {
		super(repository);
	}
}
