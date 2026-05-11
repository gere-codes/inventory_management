import { BaseRepository } from '@src/core/base/base.repository.js';
import type { TCreateOrder, TOrder, TUpdateOrder } from './order.schema.js';
import { orders } from '@src/db/index.js';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export class OrderRespository extends BaseRepository<TOrder, TCreateOrder, TUpdateOrder, typeof orders> {
	constructor(db: NodePgDatabase<any>) {
		super(orders, db);
	}

	format(record: any): TOrder {
		return {
			id: record.id,
			name: record.name,
			categoryId: record.categoryId,
			price: record.price,
			productId: record.productId,
			description: record.description,
			quantity: record.quantity,
			sku: record.sku,
			status: record.status,
			type: record.type,
			imageUrl: record?.imageUrl,
			createdAt: record?.createdAt,
			updatedAt: record?.updatedAt,
		};
	}
}
