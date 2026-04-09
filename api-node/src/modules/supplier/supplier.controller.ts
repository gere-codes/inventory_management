import { BaseController } from '@src/core/base/base.controller.js';
import type { TSupplier, TSupplierCreate, TSupplierUpdate } from './supplier.schema.js';
import { SupplierRepository } from './supplier.repository.js';
import { db } from '@src/db/index.js';
import { SupplierService } from './supplier.service.js';

class SupplierController extends BaseController<TSupplier, TSupplierCreate, TSupplierUpdate> {
	constructor() {
		const repo = new SupplierRepository(db);
		const service = new SupplierService(repo);
		super(service);
	}
}

export const supplierController = new SupplierController();
