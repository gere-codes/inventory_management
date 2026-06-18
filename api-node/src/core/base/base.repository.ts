import { and, asc, desc, eq, ilike, SQL, sql, type ColumnBaseConfig } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { AnyPgTable, PgColumn, PgSelectDynamic, PgTable } from 'drizzle-orm/pg-core';
import { AppError } from '@utils';
import type { ICollectionResult } from '../types/general.js';
import type { TBaseQuery, TContext } from '../schema/general.schema.js';
import { sortOptions } from '../enums/query.enum.js';

export interface IBaseRepository<T, TCreate, TUpdate, TQuery extends TBaseQuery = TBaseQuery> {
	getAll(userId: string): Promise<T[]>;
	create(data: TCreate): Promise<string>;
	update(id: string, data: TUpdate): Promise<void>;
	delete(id: string): Promise<void>;
	findOne(id: string): Promise<T>;
	findById(id: string): Promise<any | null>;
	findAll(context: TContext, options: TQuery): Promise<T[]>;
	findManyAndCount(context: TContext, options: TQuery): Promise<ICollectionResult<T>>;
}

type AnyUserIdColumn = PgColumn<ColumnBaseConfig<'string', string>>;
type AnyIdColumn = PgColumn<ColumnBaseConfig<'string', string>>;
type AnyCreatedAtColumn = PgColumn<ColumnBaseConfig<'date', string>>;
type AnyNameColumn = PgColumn<ColumnBaseConfig<'string', string>>;

type TableWithOtherProperties = PgTable<any> & {
	userId: AnyUserIdColumn;
	id: AnyIdColumn;
	createdAt: AnyCreatedAtColumn;
	name: AnyNameColumn;
};

export abstract class BaseRepository<
	T,
	TCreate,
	TUpdate,
	TTable extends TableWithOtherProperties,
	TQuery extends TBaseQuery = TBaseQuery,
> implements IBaseRepository<T, TCreate, TUpdate, TQuery> {
	protected table: TTable;
	protected db: NodePgDatabase;
	protected MAX_ITEMS = 1000;

	constructor(table: TTable, db: NodePgDatabase) {
		this.table = table;
		this.db = db;
	}

	protected abstract format(record: any): T;

	protected getBaseQuery(): PgSelectDynamic<any> {
		return this.db
			.select()
			.from(this.table as AnyPgTable)
			.$dynamic();
	}

	protected getBaseCountQuery(whereClause: SQL<unknown> | undefined) {
		return this.db
			.select({ count: sql<number>`count(*)` })
			.from(this.table as AnyPgTable)
			.where(whereClause);
	}

	async findById(id: string): Promise<typeof this.table.$inferSelect | null> {
		const result = await this.db
			.select()
			.from(this.table as AnyPgTable)
			.where(eq(this.table.id, id))
			.limit(1);

		return result[0] || null;
	}

	async findOne(id: string): Promise<T> {
		const result = await this.getBaseQuery().where(eq(this.table.id, id)).limit(1);

		if (!result || result.length === 0) throw new AppError(404, 'Item not found');

		return this.format(result[0]);
	}

	async getAll(userId: string): Promise<T[]> {
		const results = await this.db
			.select()
			.from(this.table as AnyPgTable)
			.where(eq(this.table.userId, userId));

		return results.map((result) => this.format(result));
	}

	async create(data: TCreate): Promise<string> {
		const [record] = await this.db.insert(this.table).values(data).returning({ id: this.table.id });

		if (!record) throw new AppError(400, 'Item was not created');

		return record.id as string;
	}

	async update(id: string, data: TUpdate): Promise<void> {
		await this.db
			.update(this.table as AnyPgTable)
			.set(data as any)
			.where(eq(this.table.id, id));
		return;
	}

	async delete(id: string): Promise<void> {
		await this.db.delete(this.table as AnyPgTable).where(eq(this.table.id, id));
		return;
	}

	protected buildAdditionalFilters(filter: any): SQL[] {
		return [];
	}

	protected buildFilters(context: TContext, options: TQuery): SQL<unknown> | undefined {
		const filters: SQL[] = [];

		// context
		if (context?.userId) {
			filters.push(eq(this.table.userId, sql`${context?.userId}`));
		}

		// filter
		if (options?.search) {
			filters.push(ilike(this.table.name, `${options.search}%`));
		}

		const additionaFilters = this.buildAdditionalFilters(options);

		if (additionaFilters.length > 0) {
			filters.push(...additionaFilters);
		}
		return filters.length > 0 ? and(...filters) : undefined;
	}

	// sort
	protected buildSortClause(sortBy: TQuery['sortBy']): SQL<unknown> {
		return desc(this.table.createdAt);
	}

	async findAll(context: TContext, options: TQuery): Promise<T[]> {
		const whereClause = this.buildFilters(context, options);

		const results = (await this.getBaseQuery()
			.where(whereClause)
			.orderBy(desc(this.table.createdAt))
			.limit(options?.limit || this.MAX_ITEMS)) as T[];

		return results.map((result) => this.format(result));
	}

	async findManyAndCount(context: TContext, options: TQuery): Promise<ICollectionResult<T>> {
		const { page, limit, offset } = options;

		const whereClause = this.buildFilters(context, options);
		const sortClause = this.buildSortClause(options?.sortBy);

		const [results, countResult] = await Promise.all([
			this.getBaseQuery().where(whereClause).orderBy(sortClause).limit(limit).offset(offset) as Promise<T[]>,
			this.getBaseCountQuery(whereClause),
		]);

		const total = Number(countResult[0]?.count ?? 0);
		const totalPages = Math.ceil(total / limit);
		const normalizedPage = totalPages > 0 && page > totalPages ? totalPages : page;

		return {
			data: results.map((result) => this.format(result)),
			pagination: {
				page: normalizedPage,
				limit,
				totalItems: total,
				totalPages,
			},
		};
	}
}
