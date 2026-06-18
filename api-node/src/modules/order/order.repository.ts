import { BaseRepository, type IBaseRepository } from '@src/core/base/base.repository.js';
import type { TCreateOrder, TOrder, TUpdateOrder } from './order.schema.js';
import { categories, orders } from '@src/db/index.js';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, gte, lte, sql, type SQL } from 'drizzle-orm';
import type { AnyPgTable } from 'drizzle-orm/pg-core';
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
			category: {
				id: record.categories.id,
				name: record.categories.name,
				slug: record.categories.slug,
			},
			description: record.description,
			quantity: record.quantity,
			sku: record.sku,
			status: record.status,
			type: record.type,
			images: record?.images,
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

	protected override getBaseQuery() {
		return this.db.select().from(this.table).leftJoin(categories, eq(this.table.categoryId, categories.id));
	}

	protected getBaseCountQuery(whereClause: SQL<unknown> | undefined) {
		return this.db
			.select({ count: sql<number>`count(*)` })
			.from(this.table as AnyPgTable)
			.leftJoin(categories, eq(this.table.categoryId, categories.id))
			.where(whereClause);
	}
}
