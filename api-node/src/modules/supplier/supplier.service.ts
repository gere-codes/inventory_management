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

interface ISupplierService extends IBaseService<TSupplier, TSupplierCreate, TSupplierUpdate> {}

export class SupplierService
	extends BaseService<TSupplier, TSupplierCreate, TSupplierUpdate>
	implements ISupplierService
{
	constructor(repository: IBaseRepository<TSupplier, TSupplierCreate, TSupplierUpdate>) {
		super(repository, supplierSchema, supplierCreateSchema, supplierUpdateSchema);
	}
}
