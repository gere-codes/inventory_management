import { BaseThunks } from '@/shared/base';
import type { TSupplier, TSupplierCreate, TSupplierUpdate } from './supplier.schema';
import { supplierService } from './supplier.service.service';

class SupplierThunk extends BaseThunks<TSupplier, TSupplierCreate, TSupplierUpdate> {
	constructor() {
		super('supplier', supplierService);
	}
}

export const supplierThunk = new SupplierThunk();
