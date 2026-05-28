import { BaseRepository, type IBaseRepository } from '@src/core/base/base.repository.js';
import type { TCreateOrder, TOrder, TUpdateOrder } from './order.schema.js';
import { orders } from '@src/db/index.js';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, gte, lte, type SQL } from 'drizzle-orm';
export interface IOrderRepository extends IBaseRepository<TOrder, TCreateOrder, TUpdateOrder> {}
export class OrderRespository
	extends BaseRepository<TOrder, TCreateOrder, TUpdateOrder, typeof orders>
	implements IOrderRepository
{
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
			image: record?.image,
			createdAt: record?.createdAt,
			updatedAt: record?.updatedAt,
		};
	}

	protected buildAdditionalFilters(filter: any): SQL[] {
		const filters: SQL[] = [];

		if (!filter) return filters;

		if (filter?.categoryId) {
			filters.push(eq(this.table.categoryId, filter.categoryId));
		}
		if (filter?.status) {
			filters.push(eq(this.table.status, filter.status));
		}

		if (filter?.minPrice) {
			filters.push(gte(this.table.price, filter.minPrice));
		}

		if (filter?.maxPrice) {
			filters.push(lte(this.table.price, filter.maxPrice));
		}

		return filters;
	}
}
