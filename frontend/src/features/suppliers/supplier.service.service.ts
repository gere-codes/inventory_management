import { BaseService } from '@base';
import {
	supplierCreateSchema,
	supplierSchema,
	supplierStatsSchema,
	supplierUpdateSchema,
	type TSupplier,
	type TSupplierCreate,
	type TSupplierStats,
	type TSupplierUpdate,
} from './supplier.schema';

export class SupplierService extends BaseService<TSupplier, TSupplierCreate, TSupplierUpdate, TSupplierStats> {
	constructor(resource: string) {
		super(resource, supplierSchema, supplierCreateSchema, supplierUpdateSchema, supplierStatsSchema);
	}
}

export const supplierService = new SupplierService('supplier');
