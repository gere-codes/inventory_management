import { BaseRepository, type IBaseRepository } from '@src/core/base/base.repository.js';
import type { TSupplier, TSupplierCreate, TSupplierStats, TSupplierUpdate } from './supplier.schema.js';
import { suppliers } from '@src/db/index.js';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export interface ISupplierRepository extends IBaseRepository<
	TSupplier,
	TSupplierCreate,
	TSupplierUpdate,
	TSupplierStats,
	typeof suppliers
> {}

export class SupplierRepository
	extends BaseRepository<TSupplier, TSupplierCreate, TSupplierUpdate, TSupplierStats, typeof suppliers>
	implements ISupplierRepository
{
	constructor(db: NodePgDatabase<any>) {
		super(suppliers, db);
	}

	protected format(record: any): TSupplier {
		return {
			id: record.id,
			name: record.name,
			phone: record.phone,
			description: record.description,
			address: record.address,
			updatedAt: record.updatedAt,
			createdAt: record.createdAt,
		};
	}
}
