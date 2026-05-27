import { BaseRepository, type IBaseRepository } from '@src/core/base/base.repository.js';
import { categories, db } from '@src/db/index.js';
import type { TCategory, TCategoryCreate, TCategoryUpdate } from './category.schema.js';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { PaginatedResult } from '@src/core/types/general.js';
import { and, desc, eq, ilike, or, sql, SQL, type SQLWrapper } from 'drizzle-orm';
export interface ICategoryRepository extends IBaseRepository<TCategory, TCategoryCreate, TCategoryUpdate> {}
export class CategoryRepository
	extends BaseRepository<TCategory, TCategoryCreate, TCategoryUpdate, typeof categories>
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
			description: record.description,
			createdAt: record.createdAt,
			updatedAt: record.updatedAt,
		};
	}
}
