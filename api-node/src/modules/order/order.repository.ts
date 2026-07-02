import { BaseRepository, type IBaseRepository } from '@src/core/base/base.repository.js';
import type { TCreateOrder, TOrder, TOrderStats, TUpdateOrder } from './order.schema.js';
import { categories, orders } from '@src/db/index.js';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, gte, lte, sql, type SQL } from 'drizzle-orm';
import type { AnyPgTable } from 'drizzle-orm/pg-core';
export interface IOrderRepository extends IBaseRepository<
	TOrder,
	TCreateOrder,
	TUpdateOrder,
	TOrderStats,
	typeof orders
> {}
export class OrderRespository
	extends BaseRepository<TOrder, TCreateOrder, TUpdateOrder, TOrderStats, typeof orders>
	implements IOrderRepository
{
	constructor(db: NodePgDatabase<any>) {
		super(orders, db);
	}

	format(record: any): TOrder {
		const { orders, categories } = record;
		return {
			id: orders.id,
			name: orders.name,
			categoryId: orders.categoryId,
			price: orders.price,
			productId: orders.productId,
			category: {
				id: categories.id,
				name: categories.name,
				slug: categories.slug,
			},
			description: orders.description,
			quantity: orders.quantity,
			sku: orders.sku,
			status: orders.status,
			type: orders.type,
			images: orders?.images,
			createdAt: orders?.createdAt,
			updatedAt: orders?.updatedAt,
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
