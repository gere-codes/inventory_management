import { BaseService, type IBaseService } from '@src/core/base/base.service.js';
import {
	supplierCreateSchema,
	supplierSchema,
	supplierUpdateSchema,
	type TSupplier,
	type TSupplierCreate,
	type TSupplierUpdate,
} from './supplier.schema.js';
import type { IBaseRepository } from '@src/core/base/base.repository.js';
import type { ISupplierRepository } from './supplier.repository.js';

export interface ISupplierService extends IBaseService<TSupplier, TSupplierCreate, TSupplierUpdate> {}

export class SupplierService
	extends BaseService<TSupplier, TSupplierCreate, TSupplierUpdate, ISupplierRepository>
	implements ISupplierService
{
	constructor(repository: ISupplierRepository) {
		super(repository, supplierSchema, supplierCreateSchema, supplierUpdateSchema);
	}
}
