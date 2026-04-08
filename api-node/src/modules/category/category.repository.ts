import { BaseRepository } from '@src/core/base/base.repository.js';
import { categories, db } from '@src/db/index.js';
import type { TCategory, TCategoryCreate, TCategoryUpdate } from './category.schema.js';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { PaginatedResult } from '@src/core/types/general.js';
import { and, desc, eq, ilike, or, sql, SQL, type SQLWrapper } from 'drizzle-orm';

export class CategoryRepository extends BaseRepository<TCategory, TCategoryCreate, TCategoryUpdate, typeof categories> {
	constructor(db: NodePgDatabase<any>) {
		super(categories, db);
	}

	protected format(record: any): TCategory {
		return {
			id: record.id,
			name: record.name,
			description: record.description,
			createdAt: record.createdAt,
			updatedAt: record.updatedAt,
		};
	}

	public async search(
		userId: string,
		term: string,
		page: number,
		limit: number,
	): Promise<PaginatedResult<TCategory>> {
		const offset = (page - 1) * limit;

		const conditions: (SQL | undefined)[] = [eq(this.table.userId, userId)];

		const trimmedTerm = term.trim();
		if (term?.trim()) {
			conditions.push(ilike(this.table.name, `%${trimmedTerm}%`));
		}

		const whereConditions = and(...conditions);

		const rows = await this.db
			.select()
			.from(this.table)
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
