import { BaseRepository, type IBaseRepository } from '@src/core/base/base.repository.js';
import type { TProduct, TProductCreate, TProductUpdate } from './product.shema.js';
import { categories, products } from '@src/db/index.js';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, desc, eq, ilike, or, SQL, sql } from 'drizzle-orm';
import { EProductStatus } from './product.enum.js';
import type { AnyPgTable } from 'drizzle-orm/pg-core';
import { AppError } from '@src/core/utils/app-error.util.js';

export interface IProductRepository extends IBaseRepository<TProduct, TProductCreate, TProductUpdate> {
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

	protected format(record: any): TProduct {
		return {
			id: record.products.id,
			name: record.products.name,
			price: record.products.price,
			quantity: record.products.quantity,
			sku: record.products.sku,
			description: record.products?.description,
			categoryId: record.products.categoryId,
			category: record.categories.name || '',
			image: record.products.image,
			status: this.getStockStatus(record.products.quantity),
			createdAt: record.products.createdAt,
			updatedAt: record.products.updatedAt,
		};
	}

	private getStockStatus(qty: number): EProductStatus {
		if (qty <= 0) return EProductStatus.OUT_OF_STOCK;
		if (qty <= 5) return EProductStatus.LOW_STOCK;
		return EProductStatus.IN_STOCK;
	}

	public override async paginate(userId: string, page: number, limit: number) {
		const offset = (page - 1) * limit;

		const rows = await this.db
			.select()
			.from(this.table)
			.leftJoin(categories, eq(this.table.categoryId, categories.id))
			.where(eq(this.table.userId, userId))
			.orderBy(desc(this.table.createdAt))
			.limit(limit)
			.offset(offset);

		const countResult = await this.db
			.select({ count: sql<number>`cast(count(*) as integer)` })
			.from(this.table)
			.where(eq(this.table.userId, userId));

		const total = countResult[0]?.count ?? 0;

		return {
			data: rows.map((row) => this.format(row)),
			pagination: {
				totalItems: total,
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				itemsPerPage: limit,
			},
		};
	}

	public async search(userId: string, term: string, page: number, limit: number) {
		const offset = (page - 1) * limit;

		const pattern = `%${term.trim()}%`;

		const rows = await this.db
			.select()
			.from(this.table)
			.leftJoin(categories, eq(this.table.categoryId, categories.id))
			.where(
				and(eq(this.table.userId, userId), or(ilike(this.table.name, pattern), ilike(this.table.sku, pattern))),
			)
			.orderBy(desc(this.table.createdAt))
			.limit(limit)
			.offset(offset);

		const countResult = await this.db
			.select({ count: sql<number>`cast(count(*) as integer)` })
			.from(this.table)
			.where(eq(this.table.userId, userId));

		const total = countResult[0]?.count ?? 0;

		return {
			data: rows.map((row) => this.format(row)),
			pagination: {
				totalItems: total,
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				itemsPerPage: limit,
			},
		};
	}

	protected override getBaseQuery() {
		return this.db.select().from(this.table).leftJoin(categories, eq(this.table.categoryId, categories.id));
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
			categories: categoriesResult,
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

		if (!record) throw new AppError(400, 'Item was not updated');

		const [product] = await this.db
			.select()
			.from(this.table)
			.where(and(eq(this.table.userId, userId), eq(this.table.id, productId)))
			.leftJoin(categories, eq(this.table.categoryId, categories.id))
			.limit(1);

		return this.format(product);
	}
}
