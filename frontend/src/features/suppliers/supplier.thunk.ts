import { BaseThunks } from '@/shared/base';
import type { TSupplier, TSupplierCreate, TSupplierStats, TSupplierUpdate } from './supplier.schema';
import { supplierService } from './supplier.service.service';

class SupplierThunk extends BaseThunks<TSupplier, TSupplierCreate, TSupplierUpdate, TSupplierStats> {
	constructor() {
		super('supplier', supplierService);
	}
}

export const supplierThunk = new SupplierThunk();
