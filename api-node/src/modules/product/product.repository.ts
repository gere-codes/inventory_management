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
			id: record.id,
			name: record.name,
			price: record.price,
			quantity: record.quantity,
			sku: record.sku,
			description: record?.description,
			categoryId: record.categoryId,
			category: record.Category.name || '',
			status: this.getStockStatus(record.quantity),
			createdAt: record.createdAt,
			updatedAt: record.updatedAt,
		};
	}

	private getStockStatus(qty: number): EProductStatus {
		if (qty <= 0) return EProductStatus.OUT_OF_STOCK;
		if (qty <= 5) return EProductStatus.LOW_STOCK;
		return EProductStatus.IN_STOCK;
	}

	public async search(userId: string, term: string, page: number, limit: number): Promise<PaginatedResult<TProduct>> {
		const offset = (page - 1) * limit;
		let whereConditions = eq(this.table.userId, userId);

		if (term && term.trim() !== '') {
			const searchConditions = or(ilike(this.table.name, `%${term}%`), ilike(this.table.sku, `%${term}%`));
			whereConditions = and(whereConditions, searchConditions) as SQL;
		}

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
		const data = rows.map((row) => this.format(row));
		return {
			data,
			pagination: {
				totalItems: total,
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				itemsPerPage: limit,
			},
		};
	}
}
