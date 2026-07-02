import { BaseRepository, type IBaseRepository } from '@src/core/base/base.repository.js';
import { categories, db, products } from '@src/db/index.js';
import type { TCategory, TCategoryCreate, TCategoryQuery, TCategoryStats, TCategoryUpdate } from './category.schema.js';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm';
import type { AnyPgTable } from 'drizzle-orm/pg-core';
export interface ICategoryRepository extends IBaseRepository<
	TCategory,
	TCategoryCreate,
	TCategoryUpdate,
	TCategoryStats,
	typeof categories,
	TCategoryQuery
> {}
export class CategoryRepository
	extends BaseRepository<TCategory, TCategoryCreate, TCategoryUpdate, TCategoryStats, typeof categories>
	implements ICategoryRepository
{
	constructor(db: NodePgDatabase<any>) {
		super(categories, db);
	}

	protected format(record: any): TCategory {
		return {
			id: record.id,
			name: record.name,
			image: record.image,
			slug: record.slug,
			description: record.description,
			createdAt: record.createdAt,
			updatedAt: record.updatedAt,
		};
	}

	public async getStats(userId: string): Promise<TCategoryStats> {
		const productsPerCategory = await this.db
			.select({
				name: categories.name,
				count: sql<number>`count(${this.table.id})`.mapWith(Number),
			})
			.from(this.table as AnyPgTable)
			.leftJoin(products, eq(this.table.id, products.id))
			.where(eq(this.table.userId, userId))
			.groupBy(categories.name);

		const totalCategories = await this.db
			.select({ count: sql<number>`count(*)`.mapWith(Number) })
			.from(categories)
			.where(eq(categories.userId, userId));

		const count = totalCategories[0]?.count;
		return {
			totalCategories: count || 0,
			productsPerCategory,
		};
	}
}
