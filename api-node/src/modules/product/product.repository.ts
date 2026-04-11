import { BaseRepository } from '@src/core/base/base.repository.js';
import type { TProduct, TProductCreate, TProductUpdate } from './product.shema.js';
import { categories, products } from '@src/db/index.js';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { PaginatedResult } from '@src/core/types/general.js';
import { and, desc, eq, ilike, or, SQL, sql } from 'drizzle-orm';
import { EProductStatus } from './product.enum.js';

export class ProductRepository extends BaseRepository<TProduct, TProductCreate, TProductUpdate, typeof products> {
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

	public async paginate(userId: string, page: number, limit: number) {
		const offset = (page - 1) * limit;

		const conditions: (SQL | undefined)[] = [eq(this.table.userId, userId)];

		const whereConditions = and(...conditions);

		const rows = await this.db
			.select()
			.from(this.table)
			.leftJoin(categories, eq(this.table.categoryId, categories.id))
			.where(whereConditions)
			.orderBy(desc(this.table.createdAt))
			.limit(limit)
			.offset(offset);

		const countResult = await this.db
			.select({ count: sql<number>`cast(count(*) as integer)` })
			.from(this.table)
			.where(whereConditions);

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
	public async search(userId: string, term: string, page: number, limit: number): Promise<PaginatedResult<TProduct>> {
		const offset = (page - 1) * limit;

		const conditions: (SQL | undefined)[] = [eq(this.table.userId, userId)];

		if (term?.trim()) {
			conditions.push(or(ilike(this.table.name, `%${term}%`), ilike(this.table.sku, `%${term}%`)));
		}

		const whereConditions = and(...conditions);

		const rows = await this.db
			.select()
			.from(this.table)
			.leftJoin(categories, eq(this.table.categoryId, categories.id))
			.where(whereConditions)
			.orderBy(desc(this.table.createdAt))
			.limit(limit)
			.offset(offset);

		const countResult = await this.db
			.select({ count: sql<number>`cast(count(*) as integer)` })
			.from(this.table)
			.where(whereConditions);

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
}
