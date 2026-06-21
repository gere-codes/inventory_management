import { BaseController } from '@src/core/base/base.controller.js';
import {
	supplierCreateSchema,
	supplierQuerySchema,
	supplierSchema,
	supplierUpdateSchema,
	type TSupplier,
	type TSupplierCreate,
	type TSupplierUpdate,
} from './supplier.schema.js';
import { SupplierRepository } from './supplier.repository.js';
import { db } from '@src/db/index.js';
import { SupplierService, type ISupplierService } from './supplier.service.js';

class SupplierController extends BaseController<TSupplier, TSupplierCreate, TSupplierUpdate, ISupplierService> {
	constructor() {
		const repo = new SupplierRepository(db);
		const service = new SupplierService(repo);
		super(service, supplierSchema, supplierCreateSchema, supplierUpdateSchema, supplierQuerySchema);
	}
}

export const supplierController = new SupplierController();
