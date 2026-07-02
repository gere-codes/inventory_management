import { BaseRepository, type IBaseRepository } from '@src/core/base/base.repository.js';
import type { TProduct, TProductCreate, TProductQuery, TProductUpdate } from './product.shema.js';
import { categories, products } from '@src/db/index.js';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, asc, desc, eq, gte, ilike, lte, or, SQL, sql } from 'drizzle-orm';
import { EProductStatus } from './product.enum.js';
import type { AnyPgTable } from 'drizzle-orm/pg-core';
import { sortOptions } from '@src/core/enums/query.enum.js';
import { BadRequestError } from '@src/core/utils/error.util.js';

export interface IProductRepository extends IBaseRepository<TProduct, TProductCreate, TProductUpdate, typeof products> {
	getStats(userId: string): any;
	updateQuantity({
		userId,
		productId,
		quantity,
	}: {
		userId: string;
		productId: string;
		quantity: number;
	}): Promise<TProduct>;
}
export class ProductRepository
	extends BaseRepository<TProduct, TProductCreate, TProductUpdate, typeof products>
	implements IProductRepository
{
	constructor(db: NodePgDatabase<any>) {
		super(products, db);
	}
	private readonly sortMap: Record<string, SQL> = {
		[sortOptions.featured]: desc(this.table.createdAt),
		[sortOptions.priceAsc]: asc(this.table.price),
		[sortOptions.priceDesc]: desc(this.table.price),
	};

	protected format(record: any): TProduct {
		return {
			id: record.products.id,
			name: record.products.name,
			price: record.products.price,
			quantity: record.products.quantity,
			sku: record.products.sku,
			description: record.products?.description,
			categoryId: record.products.categoryId,
			category: {
				id: record.categories.id,
				name: record.categories.name,
				slug: record.categories.slug,
			},
			images: record.products.images,
			status: this.getStockStatus(record.products.quantity),
			createdAt: record.products.createdAt,
			updatedAt: record.products.updatedAt,
		};
	}

	protected buildAdditionalFilters(filter: Partial<TProductQuery>): SQL[] {
		const filters: SQL[] = [];

		if (!filter) return filters;

		if (filter?.category && filter.category !== 'all') {
			filters.push(eq(categories.slug, filter.category));
		}

		if (filter?.minPrice) {
			filters.push(gte(this.table.price, String(filter.minPrice)));
		}

		if (filter?.maxPrice) {
			filters.push(lte(this.table.price, String(filter.maxPrice)));
		}

		return filters;
	}

	override buildSortClause(sort: TProductQuery['sortBy']): SQL {
		return this.sortMap[sort] ?? desc(this.table.createdAt);
	}

	private getStockStatus(qty: number): EProductStatus {
		if (qty <= 0) return EProductStatus.OUT_OF_STOCK;
		if (qty <= 5) return EProductStatus.LOW_STOCK;
		return EProductStatus.IN_STOCK;
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

	public async getStats(userId: string) {
		const result = await this.db
			.select({
				outOfStock: sql<number>`count(case when ${this.table.quantity} <= 0 then 1 end)`.mapWith(Number),
				lowStock:
					sql<number>`count(case when ${this.table.quantity} > 0 and ${this.table.quantity} <= 5 then 1 end)`.mapWith(
						Number,
					),
				totalProducts: sql<number>`count(*)`.mapWith(Number),
			})
			.from(this.table as AnyPgTable)
			.where(eq(this.table.userId, userId));

		const categoriesResult = await this.db
			.select({
				name: categories.name,
				count: sql<number>`count(${this.table.id})`.mapWith(Number),
			})
			.from(this.table as AnyPgTable)
			.leftJoin(categories, eq(this.table.categoryId, categories.id))
			.where(eq(this.table.userId, userId))
			.groupBy(categories.name);

		return {
			outOfStock: result[0]?.outOfStock ?? 0,
			lowStock: result[0]?.lowStock ?? 0,
			totalProducts: result[0]?.totalProducts ?? 0,
		};
	}

	public async updateQuantity({
		userId,
		productId,
		quantity,
	}: {
		userId: string;
		productId: string;
		quantity: number;
	}): Promise<TProduct> {
		const [record] = await this.db
			.update(this.table)
			.set({
				quantity: sql`GREATEST(${this.table.quantity} + ${quantity}, 0)`,
			})
			.where(and(eq(this.table.userId, userId), eq(this.table.id, productId)))
			.returning({ id: this.table.id });

		if (!record) throw new BadRequestError('Item was not updated');

		const [product] = await this.db
			.select()
			.from(this.table)
			.where(and(eq(this.table.userId, userId), eq(this.table.id, productId)))
			.leftJoin(categories, eq(this.table.categoryId, categories.id))
			.limit(1);

		return this.format(product);
	}
}
