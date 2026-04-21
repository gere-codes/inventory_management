import { and, desc, eq, ilike, SQL, sql, type AnyTable, type ColumnBaseConfig } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { AnyPgTable, PgColumn, PgTable } from 'drizzle-orm/pg-core';
import { AppError } from '@utils';
import type { PaginatedResult } from '../types/general.js';

export interface IBaseRepository<T, TCreate, TUpdate> {
	getAll(userId: string): Promise<T[]>;
	getById(userId: string, id: string): Promise<T | null>;
	create(userId: string, data: TCreate): Promise<T | null>;
	update(userId: string, id: string, data: TUpdate): Promise<T>;
	delete(userId: string, id: string): Promise<T>;
	search(userId: string, term: string, page: number, limit: number): Promise<PaginatedResult<T>>;
	paginate(userId: string, page?: number, limit?: number): Promise<PaginatedResult<T>>;
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
> implements IBaseRepository<T, TCreate, TUpdate> {
	protected table: TTable;
	protected db: NodePgDatabase;

	constructor(table: TTable, db: NodePgDatabase) {
		this.table = table;
		this.db = db;
	}

	protected abstract format(record: any): T;

	protected getBaseQuery(): any {
		return this.db.select().from(this.table as AnyPgTable);
	}

	protected async findOne(where: SQL | undefined): Promise<T> {
		const result = await this.getBaseQuery().where(where).limit(1);
		if (!result) {
			throw new AppError(404, 'Item not found');
		}
		return this.format(result[0]);
	}

	async getAll(userId: string): Promise<T[]> {
		const results = await this.db
			.select()
			.from(this.table as AnyPgTable)
			.where(eq(this.table.userId, userId));

		return results.map((result) => this.format(result));
	}

	async getById(userId: string, id: string): Promise<T> {
		const whereConditions = and(eq(this.table.id, id), eq(this.table.userId, userId));
		return await this.findOne(whereConditions);
	}

	async create(userId: string, data: TCreate): Promise<T | null> {
		const payload = { ...data, userId };
		const [record] = await this.db.insert(this.table).values(payload).returning({ id: this.table.id });

		if (!record) throw new AppError(400, 'Item was not created');

		const whereConditions = and(eq(this.table.id, record.id), eq(this.table.userId, userId));
		return await this.findOne(whereConditions);
	}

	async update(userId: string, id: string, data: TUpdate): Promise<T> {
		const [record] = await this.db
			.update(this.table as AnyPgTable)
			.set(data as any)
			.where(and(eq(this.table.userId, userId), eq(this.table.id, id)))
			.returning({ id: this.table.id });

		if (!record) throw new AppError(400, 'Item was not updated');
		const whereConditions = and(eq(this.table.id, record.id), eq(this.table.userId, userId));

		return await this.findOne(whereConditions);
	}

	async delete(userId: string, id: string): Promise<T> {
		const whereConditions = and(eq(this.table.id, id), eq(this.table.userId, userId));

		const record = await this.findOne(whereConditions);

		await this.db.delete(this.table as AnyPgTable).where(whereConditions);

		return record;
	}

	async paginate(userId: string, page: number = 1, limit: number = 10): Promise<PaginatedResult<T>> {
		const offset = (page - 1) * limit;

		const results = await this.db
			.select()
			.from(this.table as AnyPgTable)
			.where(eq(this.table.userId, userId))
			.orderBy(desc(this.table.createdAt))
			.limit(limit)
			.offset(offset);

		const countResult = await this.db
			.select({ count: sql<number>`count(*)` })
			.from(this.table as AnyPgTable)
			.where(eq(this.table.userId, userId));

		const total = countResult[0]?.count ?? 0;

		return {
			data: results.map((result) => this.format(result)),
			pagination: {
				totalItems: Number(total),
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				itemsPerPage: limit,
			},
		};
	}

	public async search(userId: string, term: string, page: number, limit: number): Promise<PaginatedResult<T>> {
		const offset = (page - 1) * limit;

		const conditions: (SQL | undefined)[] = [eq(this.table.userId, userId)];

		const trimmedTerm = term.trim();
		if (term?.trim()) {
			conditions.push(ilike(this.table.name, `%${trimmedTerm}%`));
		}

		const whereConditions = and(...conditions);

		const rows = await this.db
			.select()
			.from(this.table as AnyPgTable)
			.where(whereConditions)
			.orderBy(desc(this.table.createdAt))
			.limit(limit)
			.offset(offset);

		const countResult = await this.db
			.select({ count: sql<number>`cast(count(*) as integer)` })
			.from(this.table as AnyPgTable)
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
