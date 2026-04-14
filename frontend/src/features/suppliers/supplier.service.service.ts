import { BaseService } from '@base';
import {
	supplierCreateSchema,
	supplierSchema,
	supplierUpdateSchema,
	type TSupplier,
	type TSupplierCreate,
	type TSupplierUpdate,
} from './supplier.schema';

export class SupplierService extends BaseService<TSupplier, TSupplierCreate, TSupplierUpdate> {
	constructor(resource: string) {
		super(resource, supplierSchema, supplierCreateSchema, supplierUpdateSchema);
	}
}

export const supplierService = new SupplierService('supplier');
